const defaultJwtSecret = 'change-this-to-a-long-random-production-secret';

export const configuration = () => {
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === defaultJwtSecret) {
    throw new Error('JWT_SECRET must be changed before running in production.');
  }

  return {
    port: Number(process.env.PORT ?? 4000),
    jwt: {
      secret: process.env.JWT_SECRET ?? defaultJwtSecret,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    },
    databaseUrl: process.env.DATABASE_URL,
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  };
};
