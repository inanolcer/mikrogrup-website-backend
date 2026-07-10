export default (config: any) => {
  // Important: always return the modified config
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': '/src',
      },
    },
    server: {
      ...config.server,
      allowedHosts: [
        'website-api.teamsystem.local',
        'localhost',
        '127.0.0.1'
      ],
    },
  };
}; 