// Mock for react-native-fs
export default {
  // 文档目录路径
  DocumentDirectoryPath: '/mock/documents',
  ExternalDirectoryPath: '/mock/external',
  ExternalStorageDirectoryPath: '/mock/external-storage',
  TemporaryDirectoryPath: '/mock/temp',
  LibraryDirectoryPath: '/mock/library',
  CachesDirectoryPath: '/mock/caches',
  
  // 文件操作
  writeFile: jest.fn(() => Promise.resolve()),
  readFile: jest.fn(() => Promise.resolve('mock file content')),
  readdir: jest.fn(() => Promise.resolve(['file1.txt', 'file2.txt'])),
  exists: jest.fn(() => Promise.resolve(true)),
  mkdir: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
  stat: jest.fn(() => Promise.resolve({
    size: 1024,
    isFile: () => true,
    isDirectory: () => false,
    mtime: new Date(),
    ctime: new Date(),
  })),
  
  // 移动和复制
  moveFile: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  
  // 下载
  downloadFile: jest.fn(() => ({
    jobId: 1,
    promise: Promise.resolve({ statusCode: 200 }),
  })),
  
  // 上传
  uploadFiles: jest.fn(() => ({
    jobId: 1,
    promise: Promise.resolve({ statusCode: 200 }),
  })),
  
  // 停止任务
  stopDownload: jest.fn(),
  stopUpload: jest.fn(),
}; 