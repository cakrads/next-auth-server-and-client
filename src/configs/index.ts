import { END_POINT } from "./end-point";

export const URL_API =
  process.env.NODE_ENV === "development"
    ? <string>process.env.NEXT_PUBLIC_URL_API_DEV
    : <string>process.env.NEXT_PUBLIC_URL_API_PROD;

export const AUTH_CONFIG = {
  COOKIE_ACCESS_TOKEN_NAME: <string>(
    process.env.NEXT_PUBLIC_COOKIE_ACCESS_TOKEN_NAME
  ),
  COOKIE_REFRESH_TOKEN_NAME: <string>(
    process.env.NEXT_PUBLIC_COOKIE_REFRESH_TOKEN_NAME
  ),
  URL_API_TOKEN_REQUEST: <string>(
    `${URL_API}${process.env.NEXT_PUBLIC_URL_PATH_TOKEN_REQUEST}`
  ),
};

export { END_POINT };
