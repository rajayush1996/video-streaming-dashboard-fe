"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NoData from "@/components/NoData";
import { usePendingModeration, useModerationAction } from "@/hooks/useModeration";
import { formatDate } from "@/utils/helpers/util";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Hls from "hls.js";

/* ------------------------------
   HLS-aware <video> wrapper (JS)
   ------------------------------ */
const HlsVideo = forwardRef(function HlsVideo(
  { src, poster, ...props },
  ref
) {
  const vidRef = useRef(null);
  const hlsRef = useRef(null);
  useImperativeHandle(ref, () => vidRef.current);

  useEffect(() => {
    const v = vidRef.current;
    if (!v || !src) return;

    // cleanup any previous instance
    if (hlsRef.current) {
      try { hlsRef.current.stopLoad(); hlsRef.current.destroy(); } catch {}
      hlsRef.current = null;
    }
    try { v.pause(); v.removeAttribute("src"); v.load(); } catch {}

    const isM3U8 = /\.m3u8($|\?)/i.test(src);

    if (isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        // xhrSetup: (xhr) => { xhr.withCredentials = true; }, // if your CDN uses cookies
        // lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.attachMedia(v);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
      hls.on(Hls.Events.ERROR, (_e, data) => {
        console.error("HLS error", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              try { hls.destroy(); } catch {}
              hlsRef.current = null;
              try { v.src = src; v.load(); } catch {}
          }
        }
      });
    } else if (isM3U8 && v.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari/iOS)
      // v.crossOrigin = "anonymous"; // if CORS needed
      v.src = src;
      v.load();
    } else {
      // MP4 or anything else
      v.src = src;
      v.load();
    }

    return () => {
      if (hlsRef.current) {
        try { hlsRef.current.stopLoad(); hlsRef.current.destroy(); } catch {}
        hlsRef.current = null;
      }
      if (v) {
        try { v.pause(); v.removeAttribute("src"); v.load(); } catch {}
      }
    };
  }, [src]);

  return (
    <video
      ref={vidRef}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
      {...props}
    />
  );
});

/* ------------------------------
   Moderation Table
   ------------------------------ */
function ModerationTable({ title, items, onAction }) {
  if (!items.length) return null;

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedPoster, setSelectedPoster] = useState("");

  const videoElRef = useRef(null);

  const handleViewVideo = (url, poster) => {
    setSelectedVideoUrl(url || "");
    setSelectedPoster(poster || "");
    setVideoDialogOpen(true);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Processing Status</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{ width: 50, height: 50, borderRadius: 4, objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item?.userProfile?.displayName ||
                    item?.userCred?.username ||
                    item?.userCred?.email ||
                    "Unknown User"}
                </TableCell>
                <TableCell>{item.mediaType || "-"}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
                <TableCell>{item.lengthSec ? `${item.lengthSec}s` : "-"}</TableCell>
                <TableCell>{item?.category?.name || "-"}</TableCell>
                <TableCell>{item?.processingStatus || "-"}</TableCell>
                <TableCell>
                  {item?.processingStatus === "done" && item?.videoUrl ? (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "none" }}
                      onClick={() => handleViewVideo(item.videoUrl, item.thumbnailUrl)}
                    >
                      View Video
                    </Button>
                  ) : (
                    "Not ready"
                  )}
                </TableCell>
                <TableCell>
                  {item?.processingStatus === "uploading"
                    ? "Video is currently uploading"
                    : item?.processingStatus === "processing"
                    ? "Video is currently processing"
                    : item?.processingStatus === "done"
                    ? "Video processing complete"
                    : "-"}
                </TableCell>
                <TableCell>{formatDate(item?.createdAt) || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onAction(item?._id, "approved")}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      setSelectedItemId(item._id);
                      setRejectReason("");
                      setRejectDialogOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onAction(selectedItemId, "rejected", rejectReason);
              setRejectDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Video Preview</DialogTitle>
        <DialogContent>
          {selectedVideoUrl && (
            <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
              {/* Simple, reliable: HlsVideo does all the work */}
              <HlsVideo
                key={selectedVideoUrl}
                ref={videoElRef}
                src={selectedVideoUrl}
                poster={selectedPoster}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ------------------------------
   Page container
   ------------------------------ */
function PendingModerationPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = usePendingModeration();
  const action = useModerationAction();

  const handleAction = (id, status, reason = null) => {
    action.mutate({ id, status, reason });
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      setTriggerRefresh((p) => p + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    refetch();
  }, [triggerRefresh]);

  if (isLoading) return <LoadingSkeleton count={6} height={120} />;

  const items = data || [];
  const grouped = { videos: [], reels: [], blogs: [], others: [] };
  items.forEach((item) => {
    const type = (item.mediaType || item.type || "").toLowerCase();
    if (type === "video" || type === "videos") grouped.videos.push(item);
    else if (type === "reel" || type === "reels") grouped.reels.push(item);
    else if (type === "blog" || type === "blogs") grouped.blogs.push(item);
    else grouped.others.push(item);
  });

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                color="primary"
              />
            }
            label="Auto Refresh"
          />
          <Tooltip title="Manual Refresh">
            <IconButton
              onClick={() => {
                setRefreshing(true);
                setLastRefresh(new Date());
                setTriggerRefresh((p) => p + 1);
                setTimeout(() => setRefreshing(false), 1000);
              }}
            >
              <RefreshIcon className={refreshing ? "spin" : ""} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Last refreshed: {formatDate(lastRefresh)}
        </Typography>
      </Stack>

      {items.length === 0 ? (
        <NoData message="No pending content" />
      ) : (
        <>
          <ModerationTable title="Videos" items={grouped.videos} onAction={handleAction} />
          <ModerationTable title="Reels" items={grouped.reels} onAction={handleAction} />
          <ModerationTable title="Blogs" items={grouped.blogs} onAction={handleAction} />
          <ModerationTable title="Other" items={grouped.others} onAction={handleAction} />
        </>
      )}
    </Box>
  );
}

export default function Page() {
  return <PendingModerationPage />;
}
