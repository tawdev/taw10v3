module.exports = {
  apps: [
    {
      name: "taw10",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3015,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "taw10-ma",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3016, 
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "logs/taw10-ma-err.log",
      out_file: "logs/taw10-ma-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
