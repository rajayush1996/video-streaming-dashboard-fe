"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Select,
  TextInput,
  Badge,
  Grid,
  Card,
  Image,
  Stack,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { useMediaMetadata } from "@hooks/useMediaMetadata";
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconPlayerPlay,
  IconEye,
  IconClock,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";

export default function VideosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 9;

  const { data, isLoading, error } = useMediaMetadata({
    skip,
    limit,
    category: selectedCategory,
    searchQuery,
  });

  const categories = [
    { value: "", label: "All Categories" },
    { value: "gaming", label: "Gaming" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
  ];

  const handlePlay = (video) => {
    const videoData = encodeURIComponent(JSON.stringify(video));
    router.push(`/videos/${video.id}?data=${videoData}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Container size="xl" className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Title order={1} className="text-gray-900 text-4xl font-bold mb-4">
            Explore Videos
          </Title>
          <Text className="text-gray-600 text-lg">
            Discover and watch amazing content from creators around the world
          </Text>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <TextInput
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              icon={<IconSearch size={16} />}
              classNames={{
                input:
                  "bg-white border-gray-300 text-black placeholder-gray-500",
              }}
            />
            <Select
              placeholder="Select category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              data={categories}
              className="w-full md:w-64"
              classNames={{
                input: "bg-white border-gray-300 text-black",
                dropdown: "bg-white border border-gray-300",
                item: "text-black hover:bg-gray-100",
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-6 rounded-xl border border-red-300">
            <Text className="text-red-600">
              Error loading videos: {error.message}
            </Text>
          </div>
        ) : (
          <Grid gutter="xl">
            {data?.results?.map((video) => (
              <Grid.Col key={video.id} span={12} sm={6} md={4}>
                <Card
                  className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  withBorder
                >
                  <Card.Section>
                    <div className="relative">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        height={200}
                        className="w-full object-cover"
                      />
                      <div className="relative group">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          height={200}
                          className="w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            leftIcon={<IconPlayerPlayFilled size={16} />}
                            onClick={() => handlePlay(video)}
                            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                          >
                            Play
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Section>

                  <Stack spacing="xs" className="p-4">
                    <div className="flex justify-between items-start">
                      <Text
                        className="text-gray-900 font-semibold line-clamp-2"
                        size="lg"
                      >
                        {video.title}
                      </Text>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon>
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown className="bg-white border border-gray-300">
                          <Menu.Item>Add to playlist</Menu.Item>
                          <Menu.Item>Share</Menu.Item>
                          <Menu.Item>Report</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600 text-sm">
                      <div className="flex items-center space-x-1">
                        <IconEye size={14} />
                        <span>{video.views || "0"} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IconClock size={14} />
                        <span>{video.createdAt || "Published"}</span>
                      </div>
                    </div>

                    <Badge
                      color="blue"
                      className="bg-blue-100 text-blue-700 border border-blue-300"
                    >
                      {video.category}
                    </Badge>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {data?.videos?.length > 0 && (
          <div className="flex justify-center mt-8">
            <Group>
              <Button
                variant="subtle"
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="text-gray-600 hover:text-black"
              >
                Previous
              </Button>
              <Button
                variant="subtle"
                onClick={() => setSkip(skip + limit)}
                disabled={data.videos.length < limit}
                className="text-gray-600 hover:text-black"
              >
                Next
              </Button>
            </Group>
          </div>
        )}
      </Container>
    </div>
  );
}
