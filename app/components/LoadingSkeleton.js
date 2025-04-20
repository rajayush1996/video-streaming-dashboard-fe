'use client';

import React from 'react';
import { Grid, Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ count = 12, height = 250 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={height} animation="wave" />
            <Skeleton variant="text" height={30} width="80%" sx={{ mt: 1 }} />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;