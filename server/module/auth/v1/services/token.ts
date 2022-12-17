import type { NextApiRequest } from "next";
import createHttpError from "http-errors";

import AuthService from "../model";
import { AuthUtils, JWTUtils } from "../utils";
import { TAuth } from "types";

const verifyAccessToken = async (req: NextApiRequest): Promise<TAuth> => {
  const accessToken = AuthUtils.getTokenBearer(req);
  if (!accessToken) throw createHttpError.Unauthorized();

  const payload: any = await JWTUtils.getJWTPayload(accessToken);
  const ID: string = payload.aud;
  if (!ID) throw new createHttpError.Unauthorized();

  const user: TAuth = await AuthService.find(ID);
  if (!user) throw new createHttpError.Unauthorized("User not found");

  const isTokenMatch = accessToken === user?.accessToken;
  if (!isTokenMatch) throw createHttpError.Unauthorized();

  return user;
};

const verifyRefreshToken = async (refreshToken: string): Promise<TAuth> => {
  const payload: any = await JWTUtils.getJWTPayload(refreshToken);
  const ID: string = payload.aud;
  if (!ID) throw new createHttpError.Unauthorized();

  const user: TAuth = await AuthService.find(ID);
  if (!user) throw new createHttpError.Unauthorized("User not found");

  const isTokenMatch = refreshToken === user?.refreshToken;
  if (!isTokenMatch) throw createHttpError.Unauthorized();

  return user;
};

const TokenService = {
  verifyAccessToken,
  verifyRefreshToken,
};

export default TokenService;
