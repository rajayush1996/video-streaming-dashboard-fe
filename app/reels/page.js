"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-hot-toast";
// import { useDeleteReel } from "@hooks/useReels";
import DashboardLayout from "@/components/DashboardLayout";
import NoData from "@/components/NoData";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useCategoriesByType } from "@/hooks/useCategories";
import { useMediaMetadata } from "@/hooks/useMediaMetadata";
// import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Upload as UploadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import VideoTable from "@/components/VideoTable";
import { useDeleteReel, useUpdateReel } from "@/hooks/useReels";

const ITEMS_PER_PAGE = 6;

function ReelsPage() {
  // const router = useRouter();
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  // const [search, setSearch] = useState('');
  // const [searchInput, setSearchInput] = useState('');
  // const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data, isLoading, isError } = useMediaMetadata({
    page,
    limit: ITEMS_PER_PAGE,
    searchQuery,
    category: selectedCategory,
    type: "reel",
  });

  const { data: categoryResponse } = useCategoriesByType("reels");
  const categories = categoryResponse || [];

  const deleteReel = useDeleteReel();
  const updateReel = useUpdateReel();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (_, value) => setPage(value);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleAddReel = () => router.push("/reels/upload");
  const handleEditReel = (id) => router.push(`/reels/edit/${id}`);
  const handleViewReel = (id) => router.push(`/reels/${id}`);

  // const handleDeleteReel = (id) => {
  //   if (window.confirm('Are you sure you want to delete this reel?')) {
  //     deleteReelMutation.mutate(id, {
  //       onSuccess: () => {
  //         toast.success('Reel deleted successfully');
  //         location.reload(); // you can replace with refetch() if available
  //       },
  //       onError: (error) => {
  //         toast.error(error.message || 'Failed to delete reel');
  //       },
  //     });
  //   }
  // };

  const handleDelete = async (reel) => {
    try {
      await deleteReel.mutateAsync(reel.id);
      toast.success("Reel deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete reel");
    }
  };

  // const renderReels = () => {
  //   if (!data?.results?.length) {
  //     return (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           height: '60vh',
  //           textAlign: 'center',
  //         }}
  //       >
  //         <NoData message="No reels found" />
  //       </Box>
  //     );
  //   }

  //   return (
  //     <Grid container spacing={3}>
  //       {data.results.map((reel) => (
  //         <Grid item xs={12} sm={6} md={4} lg={3} key={reel.id}>
  //           <Card
  //             sx={{
  //               height: '100%',
  //               display: 'flex',
  //               flexDirection: 'column',
  //               borderRadius: 3,
  //               overflow: 'hidden',
  //               boxShadow: 3,
  //               transition: 'transform 0.2s ease-in-out, box-shadow 0.3s',
  //               '&:hover': {
  //                 transform: 'scale(1.02)',
  //                 boxShadow: 6,
  //               },
  //             }}
  //           >
  //             <CardMedia
  //               component="div"
  //               sx={{ position: 'relative', pt: '177.78%', cursor: 'pointer' }}
  //               onClick={() => handleViewReel(reel.id)}
  //             >
  //               <Box
  //                 component="img"
  //                 src={reel.thumbnailUrl || reel.mediaFileUrl}
  //                 alt={reel.title}
  //                 sx={{
  //                   position: 'absolute',
  //                   top: 0,
  //                   left: 0,
  //                   width: '100%',
  //                   height: '100%',
  //                   objectFit: 'cover',
  //                 }}
  //               />
  //             </CardMedia>
  //             <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
  //               <Typography variant="subtitle1" fontWeight="600" noWrap>
  //                 {reel.title}
  //               </Typography>
  //               <Typography variant="caption" color="text.secondary">
  //                 {reel.views || 0} views
  //               </Typography>
  //             </CardContent>
  //             <CardActions sx={{ justifyContent: 'center', pb: 1 }}>
  //               <IconButton size="small" onClick={() => handleViewReel(reel.id)}>
  //                 <VisibilityIcon />
  //               </IconButton>
  //               <IconButton size="small" onClick={() => handleEditReel(reel.id)}>
  //                 <EditIcon />
  //               </IconButton>
  //               <IconButton size="small" onClick={() => handleDeleteReel(reel.id)}>
  //                 <DeleteIcon />
  //               </IconButton>
  //             </CardActions>
  //           </Card>
  //         </Grid>
  //       ))}
  //     </Grid>
  //   );
  // };

  const handleUpdate = async (updateData) => {
    try {
      await updateReel.mutateAsync(updateData);
      toast.success("Reel updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update reel");
    }
  };

  const totalPages = data?.totalPages || 1;

  if (isError) {
    <Container>
      <Box
        sx={{
          textAlign: "center",
          color: "error.main",
          p: 4,
          bgcolor: "error.light",
          borderRadius: 1,
        }}
      >
        <Typography>Error loading reels. Please try again later.</Typography>
      </Box>
    </Container>;
  }

  // return (
  //   <DashboardLayout>
  //     <Box sx={{ mb: 4 }}>
  //       {/* Header */}
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           flexDirection: { xs: 'column', sm: 'row' },
  //           justifyContent: 'space-between',
  //           alignItems: { xs: 'flex-start', sm: 'center' },
  //           gap: 2,
  //           mb: 3,
  //         }}
  //       >
  //         <Typography variant="h4" component="h1">
  //           Reels
  //         </Typography>
  //         <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddReel}>
  //           Upload Reel
  //         </Button>
  //       </Box>

  //       {/* Filters */}
  //       <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <TextField
  //             fullWidth
  //             size="small"
  //             placeholder="Search reels..."
  //             value={searchInput}
  //             onChange={(e) => setSearchInput(e.target.value)}
  //             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
  //             InputProps={{
  //               endAdornment: (
  //                 <IconButton onClick={handleSearch} edge="end">
  //                   <SearchIcon />
  //                 </IconButton>
  //               ),
  //             }}
  //           />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <FormControl fullWidth size="small">
  //             <InputLabel>Category</InputLabel>
  //             <Select value={category} label="Category" onChange={handleCategoryChange}>
  //               <MenuItem value="">All Categories</MenuItem>
  //               {categories?.map((cat) => (
  //                 <MenuItem key={cat.id} value={cat.id}>
  //                   {cat.name}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <FormControl fullWidth size="small">
  //             <InputLabel>Items per page</InputLabel>
  //             <Select
  //               value={limit}
  //               label="Items per page"
  //               onChange={(e) => {
  //                 setLimit(e.target.value);
  //                 setPage(1);
  //               }}
  //             >
  //               <MenuItem value={12}>12</MenuItem>
  //               <MenuItem value={24}>24</MenuItem>
  //               <MenuItem value={48}>48</MenuItem>
  //             </Select>
  //           </FormControl>
  //         </Grid>
  //       </Grid>

  //       {/* Grid or Loading */}
  //       {isLoading ? (
  //         <LoadingSkeleton count={limit} height={300} />
  //       ) : (
  //         renderReels()
  //       )}

  //       {/* Pagination */}
  //       {data && data.totalPages > 0 && (
  //         <Stack alignItems="center" sx={{ mt: 4 }}>
  //           <Pagination
  //             count={data.totalPages}
  //             page={page}
  //             onChange={handlePageChange}
  //             color="primary"
  //             showFirstButton
  //             showLastButton
  //           />
  //         </Stack>
  //       )}
  //     </Box>
  //   </DashboardLayout>
  // );
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Reels
        </Typography>
        <Link
          href="/reels/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <UploadIcon sx={{ fontSize: 20 }} />
          Upload Reel
        </Link>
      </Box>
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ position: "relative" }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "text.secondary",
                fontSize: 20,
              }}
            />
            <input
              type="text"
              placeholder="Search reels..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-700/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat?.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
              }`}
            >
              {cat?.name}
            </button>
          ))}
        </Box>
      </Box>
      <VideoTable
        videos={data?.results || []}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        categories={categoryResponse}
      />
    </Container>
  );
}

export default ReelsPage;
