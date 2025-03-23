'use client';
import { Box, Text } from '@mantine/core';

export default function HeaderBar({ appName }) {
  return (
    <Box className="h-16 bg-white shadow-md flex items-center px-6 justify-between border-b border-gray-300">
      <Text className="text-xl font-bold text-gray-700">{appName} Dashboard</Text>
    </Box>
  );
}