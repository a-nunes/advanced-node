export const env = {
  facebookApi: {
    testUserToken: process.env.FB_TEST_USER_TOKEN ?? '',
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '',
};
