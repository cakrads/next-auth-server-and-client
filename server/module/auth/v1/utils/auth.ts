import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { CookieSerializeOptions } from "cookie";

import { AUTH_CONFIG } from "@server/configs";

import type { NextApiRequest, NextApiResponse } from "next";
import { TAuthToken } from "types/*";

export const getTokenBearer = (req: NextApiRequest) => {
  if (!req.headers["authorization"]) return false;
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  return bearerToken[1];
};

export function getTokenFromCookies(req: NextApiRequest, res: NextApiResponse): TAuthToken {
  const accessToken = <string>getCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN.NAME, { req, res });
  const refreshToken = <string>getCookie(AUTH_CONFIG.COOKIE_REFRESH_TOKEN.NAME, { req, res });

  return { accessToken, refreshToken };
}

interface ISetAccessToken {
  req: NextApiRequest;
  res: NextApiResponse;
  accessToken: string;
};
export const setAccessTokenToCookie = ({ req, res, accessToken }: ISetAccessToken) => {
  setTokenCookie({
    req,
    res,
    token: accessToken,
    tokenName: AUTH_CONFIG.COOKIE_ACCESS_TOKEN.NAME,
    maxAge: AUTH_CONFIG.COOKIE_ACCESS_TOKEN.MAX_AGE,
  });
};

interface ISetRefreshToken {
  req: NextApiRequest;
  res: NextApiResponse;
  refreshToken: string;
}
export const setRefreshTokenToCookie = ({ req, res, refreshToken }: ISetRefreshToken) => {
  setTokenCookie({
    req,
    res,
    token: refreshToken,
    tokenName: AUTH_CONFIG.COOKIE_REFRESH_TOKEN.NAME,
    maxAge: AUTH_CONFIG.COOKIE_REFRESH_TOKEN.MAX_AGE,
  });
};


interface ISetCookie {
  req: NextApiRequest;
  res: NextApiResponse;
  token: string,
  tokenName: string,
  maxAge: number,
}
function setTokenCookie(params: ISetCookie) {
  const {
    req, res, tokenName, maxAge, token,
  } = params;

  const cookieOptions: CookieSerializeOptions = {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: false, // false cause browser need to access it
    secure: process.env.NODE_ENV === "production",
    path: AUTH_CONFIG.COOKIE_PATH,
    sameSite: "lax"
  };

  const options = {
    req,
    res,
    ...cookieOptions,
  };

  setCookie(tokenName, token, options);
}

export function removeTokenCookie(req: NextApiRequest, res: NextApiResponse) {
  /**
   * IMPORTANT! When deleting a cookie and you're not 
   * relying on the default attributes, you must pass 
   * the exact same path and domain attributes 
   * that were used to set the cookie
   * more: https://www.npmjs.com/package/cookies-next
   */
  const options = {
    req,
    res,
    maxAge: -1,
    path: AUTH_CONFIG.COOKIE_PATH,
  };
  deleteCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN.NAME, options);
  deleteCookie(AUTH_CONFIG.COOKIE_REFRESH_TOKEN.NAME, options);
}


