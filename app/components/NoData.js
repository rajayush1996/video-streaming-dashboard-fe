import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const NoData = ({ message = 'No data available' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        color: 'text.secondary',
        py: 4,
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
};

export default NoData;