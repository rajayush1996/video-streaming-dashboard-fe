"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@utils/authGuard";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";

import LaunchIcon from "@mui/icons-material/Launch";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useDashboardData } from "@hooks/useDashboard";
import VideocamIcon from "@mui/icons-material/Videocam";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateIcon from "@mui/icons-material/Create";
import FlagIcon from "@mui/icons-material/Flag";
import StorageIcon from "@mui/icons-material/Storage";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  useFetchCreatorRequests,
  useHandleCreatorRequest,
} from "./hooks/useCreatorRequests";
import { CheckCircleOutline, CloseOutlined } from "@mui/icons-material";

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const incrementTime = duration / end > 5 ? 5 : duration / end;
    let timer;

    // Don't run with zero as target
    if (end === 0) {
      setCount(0);
      return;
    }

    // Handle count animation
    const updateCount = () => {
      start += 1;
      setCount(start);
      if (start < end) {
        timer = setTimeout(updateCount, incrementTime);
      } else {
        setCount(end);
      }
    };

    updateCount();

    return () => clearTimeout(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Styled components
const StyledMetricCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  backgroundColor: color
    ? theme.palette[color].light
    : theme.palette.primary.light,
  color: color
    ? theme.palette[color].contrastText
    : theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[6],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 60,
  height: 60,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  marginBottom: theme.spacing(2),
}));

// Format timestamp to relative time
const formatRelativeTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

// Activity icon based on type
const getActivityIcon = (action, resourceType) => {
  if (action === "uploaded" || action === "published")
    return <CloudUploadIcon color="success" />;
  if (action === "updated") return <CreateIcon color="primary" />;
  if (action === "commented") return <ArticleIcon color="info" />;
  if (action === "deleted") return <ReportProblemIcon color="error" />;
  if (action === "flagged") return <FlagIcon color="warning" />;
  return null;
};

// Homepage component
function HomePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    refetch: refetchDashboard,
  } = useDashboardData();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: creatorRequests = [],
    isLoading: isCRLoading,
    isError: crError,
    refetch: refetchRequests,
  } = useFetchCreatorRequests();

  const { mutate: handleRequest, isLoading: isHandling } =
    useHandleCreatorRequest();

  // helper to format date
  const fmtTime = (ts) => formatRelativeTime(ts);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      handleRefresh(); // call wrapped one that spins too
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);
  // Redirect functions
  const goToVideoUpload = () => router.push("/videos/upload");
  const goToBlogUpload = () => router.push("/blogs/upload");
  const goToFlagged = () => router.push("/flagged");

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDashboard(), refetchRequests()]);
    setTimeout(() => setRefreshing(false), 1000); // spin for 1s
  };

  // Map API response to component data
  const metrics = data?.metrics || {};
  const activities = data?.activities?.items || [];
  const systemStatus = data?.systemStatus || {};

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Dashboard Overview
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                color="primary"
              />
            }
            label="Auto Refresh"
            sx={{ mr: 1 }}
          />
          <Tooltip title="Refresh now">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon className={refreshing ? "spin" : ""} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color="primary">
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconContainer>
                <VideocamIcon sx={{ fontSize: 32, color: "white" }} />
              </IconContainer>
              <Typography variant="h3" component="div" fontWeight="bold">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <AnimatedCounter value={metrics.approvedVideos || 0} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ opacity: 0.8 }}
              >
                Total Videos
              </Typography>
            </CardContent>
          </StyledMetricCard>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color="secondary">
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconContainer>
                <ArticleIcon sx={{ fontSize: 32, color: "white" }} />
              </IconContainer>
              <Typography variant="h3" component="div" fontWeight="bold">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <AnimatedCounter value={metrics.approvedReels || 0} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ opacity: 0.8 }}
              >
                Total Blogs
              </Typography>
            </CardContent>
          </StyledMetricCard>
        </Grid> */}

        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color="secondary">
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconContainer>
                <LiveTvIcon sx={{ fontSize: 32, color: "white" }} />
              </IconContainer>
              <Typography variant="h3" component="div" fontWeight="bold">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <AnimatedCounter value={metrics.approvedReels || 0} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ opacity: 0.8 }}
              >
                Total Reels
              </Typography>
            </CardContent>
          </StyledMetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color="info">
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconContainer>
                <VisibilityIcon sx={{ fontSize: 32, color: "white" }} />
              </IconContainer>
              <Typography variant="h3" component="div" fontWeight="bold">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <AnimatedCounter value={metrics.totalViews || 0} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ opacity: 0.8 }}
              >
                Total Views
              </Typography>
            </CardContent>
          </StyledMetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color="success">
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconContainer>
                <PeopleIcon sx={{ fontSize: 32, color: "white" }} />
              </IconContainer>
              <Typography variant="h3" component="div" fontWeight="bold">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <AnimatedCounter value={metrics.usersCount || 0} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{ opacity: 0.8 }}
              >
                Total Users
              </Typography>
            </CardContent>
          </StyledMetricCard>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography
        variant="h5"
        gutterBottom
        fontWeight="bold"
        sx={{ mt: 6, mb: 3 }}
      >
        Quick Actions
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <StyledActionButton
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<VideocamIcon />}
            onClick={goToVideoUpload}
          >
            Upload Video
          </StyledActionButton>
        </Grid>

        <Grid item xs={12} sm={4}>
          <StyledActionButton
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<ArticleIcon />}
            onClick={goToBlogUpload}
          >
            Write a Blog
          </StyledActionButton>
        </Grid>

        <Grid item xs={12} sm={4}>
          <StyledActionButton
            variant="contained"
            color="warning"
            fullWidth
            startIcon={<FlagIcon />}
            onClick={goToFlagged}
          >
            View Flagged Content
          </StyledActionButton>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activities */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Recent Activities
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                <Table>
                  <TableBody>
                    {activities.map((activity, index) => (
                      <TableRow key={activity.resourceId || index} hover>
                        <TableCell
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ mr: 2 }}>
                              {activity.user.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {activity.user}{" "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {activity.action}
                                </Typography>{" "}
                                {activity.resourceName}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 0.5,
                                }}
                              >
                                {getActivityIcon(
                                  activity.action,
                                  activity.resourceType
                                )}
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  {formatRelativeTime(activity.time)}
                                </Typography>
                                <Chip
                                  label={activity.resourceType}
                                  size="small"
                                  color={
                                    activity.resourceType === "video"
                                      ? "primary"
                                      : "secondary"
                                  }
                                  variant="outlined"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                        >
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              System Status
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Stack spacing={{ xs: 2, sm: 4, md: 8 }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StorageIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Storage Used
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {(systemStatus.storage?.used / 1000000000 || 0).toFixed(
                        0
                      )}{" "}
                      /{" "}
                      {(
                        systemStatus.storage?.capacity / 1000000000 || 0
                      ).toFixed(0)}{" "}
                      GB
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={systemStatus.storage?.usedPercentage || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="primary"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    align="right"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    {(systemStatus.storage?.usedPercentage || 0).toFixed(1)}%
                    used
                  </Typography>
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Pending Moderation
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          {systemStatus.moderation?.pendingVideos || 0}
                        </Typography>
                        <Typography variant="body2">Videos</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "secondary.light",
                          color: "secondary.contrastText",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          {systemStatus.moderation?.pendingBlogs || 0}
                        </Typography>
                        <Typography variant="body2">Blogs</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 5 }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<FlagIcon />}
                    fullWidth
                    onClick={goToFlagged}
                  >
                    Review Pending Content
                  </Button>
                </Box>
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Pending Creator Requests
            </Typography>

            {isCRLoading ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : crError ? (
              <Typography color="error">Failed to load requests.</Typography>
            ) : creatorRequests.length === 0 ? (
              <Typography color="text.secondary">
                No pending requests.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      {/* <TableCell>Reason</TableCell>
                      <TableCell>Content Focus</TableCell> */}
                      <TableCell>Name</TableCell>
                      <TableCell>Profile URL</TableCell>
                      {/* <TableCell>Portfolio</TableCell> */}
                      <TableCell>Documents</TableCell>
                      <TableCell>ID Proof</TableCell>
                      {/* <TableCell>Submitted</TableCell> */}
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creatorRequests.map((req) => (
                      <TableRow key={req.id} hover>
                        <TableCell>{req.userId}</TableCell>
                        <TableCell>{req.name}</TableCell>
                        {/* <TableCell>{req.reason}</TableCell> */}
                        {/* <TableCell>
                          {req.contentFocus || (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              —
                            </Typography>
                          )}
                        </TableCell> */}
                        <TableCell>
                          {req?.photo ? (
                            <IconButton
                              component="a"
                              href={req?.photo}
                              target="_blank"
                              rel="noopener"
                              size="small"
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {req.documents && req.documents.length > 0 ? (
                            req.documents.map((url, i) => (
                              <IconButton
                                key={i}
                                size="small"
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener"
                                title={url.split("/").pop()}
                              >
                                <DescriptionIcon fontSize="small" />
                              </IconButton>
                            ))
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {req?.idProof ? (
                            <IconButton
                              size="small"
                              component="a"
                              href={req?.idProof}
                              target="_blank"
                              rel="noopener"
                              title={req?.idProof.split("/").pop()}
                            >
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              None
                            </Typography>
                          )}
                        </TableCell>
                        {/* <TableCell>
                          {formatRelativeTime(req.createdAt)}
                          {req.idProof ? (
                            <IconButton
                              size="small"
                              component="a"
                              href={req.idProof}
                              target="_blank"
                              rel="noopener"
                            >
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </TableCell> */}
                        <TableCell>
                          <Chip
                            label={req.status.toUpperCase()}
                            size="small"
                            color={
                              req.status === "pending"
                                ? "warning"
                                : req.status === "approved"
                                ? "success"
                                : "error"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              color="success"
                              disabled={isHandling}
                              onClick={() =>
                                handleRequest({
                                  id: req.id,
                                  status: "approved",
                                })
                              }
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={isHandling}
                              onClick={() =>
                                handleRequest({
                                  id: req.id,
                                  action: "rejected",
                                })
                              }
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// Wrap the HomePage with AuthGuard
export default function ProtectedHomePage() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}
