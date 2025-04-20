import axios from 'axios';
import * as videosApi from './videosApi';
import config from '@config/config';

// Mock axios
jest.mock('axios');

describe('Videos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadVideoChunk', () => {
    it('should upload a video chunk', async () => {
      // Mock data
      const chunk = new Blob(['test chunk data']);
      const fileName = 'test.mp4';
      const chunkIndex = 0;
      const totalChunks = 10;
      const mockResponse = { data: { file: { fileId: '123' }, url: 'http://example.com/video.mp4' } };
      
      // Mock axios post
      axios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await videosApi.uploadVideoChunk(chunk, fileName, chunkIndex, totalChunks);
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        config.endpoints.upload,
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('uploadThumbnail', () => {
    it('should upload a thumbnail image', async () => {
      // Mock data
      const thumbnail = new Blob(['test image data']);
      const fileName = 'thumb.jpg';
      const mockResponse = { data: { thumbUrl: { file: { fileId: '456' }, url: 'http://example.com/thumb.jpg' } } };
      
      // Mock axios post
      axios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await videosApi.uploadThumbnail(thumbnail, fileName);
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        config.endpoints.upload,
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('checkUploadProgress', () => {
    it('should check the upload progress', async () => {
      // Mock data
      const fileName = 'test.mp4';
      const mockResponse = { data: { uploadedChunks: [0, 1, 2] } };
      
      // Mock axios get
      axios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await videosApi.checkUploadProgress(fileName);
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith(
        config.endpoints.uploadProgress,
        { params: { fileName } }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('saveVideoMetadata', () => {
    it('should save video metadata', async () => {
      // Mock data
      const metadata = {
        title: 'Test Video',
        description: 'Test Description',
        category: 'Test Category',
        mediaFileId: '123',
        thumbnailId: '456',
      };
      const mockResponse = { data: { id: '789', ...metadata } };
      
      // Mock axios post
      axios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await videosApi.saveVideoMetadata(metadata);
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        config.endpoints.metadata,
        metadata
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('fetchVideos', () => {
    it('should fetch videos with filters', async () => {
      // Mock data
      const options = { page: 2, limit: 20, search: 'test', category: 'education' };
      const mockResponse = { data: { videos: [], total: 0, totalPages: 0 } };
      
      // Mock axios post
      axios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await videosApi.fetchVideos(options);
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        config.endpoints.mediaMetadata,
        { params: { page: 2, limit: 20, search: 'test', category: 'education' } }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 