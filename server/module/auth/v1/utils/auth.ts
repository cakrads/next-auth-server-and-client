import { serialize, parse } from "cookie";

import { AUTH_CONFIG } from "@server/configs";

import type { NextApiRequest, NextApiResponse } from "next";

export const getTokenBearer = (req: NextApiRequest) => {
  if (!req.headers["authorization"]) return false;
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  return bearerToken[1];
};

export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = serialize(AUTH_CONFIG.COOKIE_TOKEN_NAME, token, {
    maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
    expires: new Date(Date.now() + AUTH_CONFIG.COOKIE_MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie(res: NextApiResponse) {
  const cookie = serialize(AUTH_CONFIG.COOKIE_TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || "");
}

export function getTokenCookie(req: NextApiRequest) {
  const cookies = parseCookies(req);
  return cookies[AUTH_CONFIG.COOKIE_TOKEN_NAME];
}
