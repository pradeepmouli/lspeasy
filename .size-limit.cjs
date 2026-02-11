module.exports = [
  {
    name: '@lspeasy/core',
    path: 'packages/core/dist/index.js',
    limit: '100 KB',
    gzip: true,
    modifyEsbuildConfig(config) {
      config.platform = 'node';
      return config;
    }
  },
  {
    name: '@lspeasy/server',
    path: 'packages/server/dist/index.js',
    limit: '100 KB',
    gzip: true,
    modifyEsbuildConfig(config) {
      config.platform = 'node';
      return config;
    }
  },
  {
    name: '@lspeasy/client',
    path: 'packages/client/dist/index.js',
    limit: '100 KB',
    gzip: true,
    modifyEsbuildConfig(config) {
      config.platform = 'node';
      return config;
    }
  }
];
