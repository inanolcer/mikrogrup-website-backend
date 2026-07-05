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
        'lead.samplr.local',
        'localhost',
        '127.0.0.1'
      ],
    },
  };
}; 