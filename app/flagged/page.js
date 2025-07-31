"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Chip,
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
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/material";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NoData from "@/components/NoData";
import {
  usePendingModeration,
  useModerationAction,
} from "@/hooks/useModeration";
import { formatDate } from "@/utils/helpers/util";
import { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";

function ModerationTable({ title, items, onAction }) {
  if (!items.length) return null;

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  console.log(
    "🚀 ~ :38 ~ ModerationTable ~ rejectDialogOpen:",
    rejectDialogOpen
  );
  const [rejectReason, setRejectReason] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);

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
              <TableCell>createdAt</TableCell>
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
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item?.userProfile?.displayName ||
                    item.userCred?.username ||
                    item.userCred?.email ||
                    "Unknown User"}
                </TableCell>
                <TableCell>{item.mediaType || "-"}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
                <TableCell>
                  {item.lengthSec ? `${item.lengthSec}s` : "-"}
                </TableCell>
                <TableCell>{item?.category?.name || "-"}</TableCell>
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

      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
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
    </Box>
  );
}

// function ModerationSection({ title, items, onAction }) {
//   if (!items.length) return null;
//   return (
//     <Box sx={{ mb: 4 }}>
//       <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
//         {title}
//       </Typography>
//       {items.map((item) => (
//         <ModerationCard key={item.id} item={item} onAction={onAction} />
//       ))}
//     </Box>
//   );
// }

function PendingModerationPage() {
  // 🟢 Step 1: All hooks at the top in order
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);


  const { data, isLoading, refetch } = usePendingModeration();
  const action = useModerationAction();

  const handleAction = (id, status, reason = null) => {
    action.mutate({ id, status, reason });
  };

  // 🟡 Step 2: Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      setTriggerRefresh((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 🟡 Step 3: Refetch trigger
  useEffect(() => {
    refetch();
  }, [triggerRefresh]);

  // 🟠 Step 4: Loading state
  if (isLoading) return <LoadingSkeleton count={6} height={120} />;

  const items = data || [];

  const grouped = {
    videos: [],
    reels: [],
    blogs: [],
    others: [],
  };

  items.forEach((item) => {
    const type = (item.mediaType || item.type || "").toLowerCase();
    if (type === "video" || type === "videos") grouped.videos.push(item);
    else if (type === "reel" || type === "reels") grouped.reels.push(item);
    else if (type === "blog" || type === "blogs") grouped.blogs.push(item);
    else grouped.others.push(item);
  });

  // 🟢 Step 5: UI
  return (
    <Box>
      {/* 🔁 Refresh Controls */}
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
                setTriggerRefresh((prev) => prev + 1);
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

      {/* No Data fallback */}
      {items.length === 0 ? (
        <NoData message="No pending content" />
      ) : (
        <>
          <ModerationTable
            title="Videos"
            items={grouped.videos}
            onAction={handleAction}
          />
          <ModerationTable
            title="Reels"
            items={grouped.reels}
            onAction={handleAction}
          />
          <ModerationTable
            title="Blogs"
            items={grouped.blogs}
            onAction={handleAction}
          />
          <ModerationTable
            title="Other"
            items={grouped.others}
            onAction={handleAction}
          />
        </>
      )}
    </Box>
  );
}

export default function Page() {
  return <PendingModerationPage />;
}
