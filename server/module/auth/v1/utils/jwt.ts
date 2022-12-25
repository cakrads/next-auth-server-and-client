import JWT from "jsonwebtoken";
import createHttpError from "http-errors";

import { AUTH_CONFIG } from "@server/configs";

import { TUser } from "types";

export const signAccessToken = async (user: TUser) => {
  const payload = {
    user: { email: user.email },
  };
  const secret = AUTH_CONFIG.JWT_PRIVATE_KEY;
  const options = {
    expiresIn: AUTH_CONFIG.JWT_ACCESS_TOKEN_EXPIRED,
    audience: `${user.email}`,
  };
  return await JWT.sign(payload, secret, options);
};

export const signRefreshToken = async (user: TUser) => {
  const payload = {
    user: { email: user.email },
  };
  const secret = AUTH_CONFIG.JWT_PRIVATE_KEY;
  const options = {
    expiresIn: AUTH_CONFIG.JWT_REFRESH_TOKEN_EXPIRED,
    audience: `${user.email}`,
  };
  return await JWT.sign(payload, secret, options);
};

export const getJWTPayload = async (refreshToken: string) => {
  const payload: any = await JWT.verify(refreshToken, AUTH_CONFIG.JWT_PRIVATE_KEY);
  if (!payload) {
    throw new createHttpError.Unauthorized();
  }
  return payload;
};
