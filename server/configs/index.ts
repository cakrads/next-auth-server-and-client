export const AUTH_CONFIG = {
  JWT_PRIVATE_KEY: <string>process.env.JWT_PRIVATE_KEY,
  JWT_ACCESS_TOKEN_EXPIRED: <number>(
    Number(process.env.JWT_ACCESS_TOKEN_EXPIRED)
  ),
  JWT_REFRESH_TOKEN_EXPIRED: <number>(
    Number(process.env.JWT_REFRESH_TOKEN_EXPIRED)
  ),
  COOKIE_PATH: <string>process.env.COOKIE_PATH,
  COOKIE_ACCESS_TOKEN: {
    NAME: <string>process.env.COOKIE_ACCESS_TOKEN_NAME,
    MAX_AGE: <number>Number(process.env.JWT_ACCESS_TOKEN_EXPIRED),
  },
  COOKIE_REFRESH_TOKEN: {
    NAME: <string>process.env.COOKIE_REFRESH_TOKEN_NAME,
    MAX_AGE: <number>Number(process.env.JWT_REFRESH_TOKEN_EXPIRED),
  },
};
