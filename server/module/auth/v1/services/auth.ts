import createHttpError from "http-errors";

import * as helpers from "@server/helpers";
import TokenService from "./token";
import { AuthUtils, JWTUtils, PasswordUtils } from "../utils";
import * as DTO from "../dto";
import AuthModel from "../model";

import type { NextApiRequest, NextApiResponse } from "next";
import { TAuth, TRegister, TLogin, TRefreshToken } from "types";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const registerPayload: DTO.TRegisterDto = await DTO.registerSchema.validate(
    req.body
  );

  const isExist = await AuthModel.isExist(registerPayload.email);
  if (isExist.status) {
    throw new createHttpError.Conflict(isExist.message);
  }

  const { hash, salt } = await PasswordUtils.generatePassword(
    registerPayload.password
  );
  const result: TAuth = await AuthModel.register({
    email: registerPayload.email,
    hash,
    salt,
    accessToken: "",
    refreshToken: "",
  });
  const response: TRegister = {
    email: result.email,
  };
  helpers.response.success(res, response);
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const loginPayload: DTO.TLoginDto = await DTO.loginSchema.validate(req.body);

  const { email, password } = loginPayload;
  const user: TAuth = await AuthModel.find(email);
  if (!user) throw new createHttpError.Unauthorized("User not found");

  const isMatch = await PasswordUtils.checkHashPassword(user, password);
  if (!isMatch)
    throw new createHttpError.Unauthorized("Username/password not valid");

  const accessToken = await JWTUtils.signAccessToken(user);
  const refreshToken = await JWTUtils.signRefreshToken(user);

  await AuthModel.updateToken(user.email, {
    accessToken,
    refreshToken,
  });

  AuthUtils.setAccessTokenToCookie({ req, res, accessToken });
  AuthUtils.setRefreshTokenToCookie({ req, res, refreshToken });

  const result: TLogin = {
    profile: {
      email: user.email,
    },
    accessToken,
    refreshToken,
  };

  helpers.response.success(res, result);
};

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshTokenPayload: DTO.TRefreshTokenDto =
    await DTO.refreshTokenSchema.validate(req.body);
  const { refreshToken } = refreshTokenPayload;
  if (!refreshToken) {
    throw new createHttpError.BadRequest();
  }

  const user: TAuth = await TokenService.verifyRefreshToken(refreshToken);

  const newAccessToken = await JWTUtils.signAccessToken(user);
  const newRefreshToken = await JWTUtils.signRefreshToken(user);

  await AuthModel.updateToken(user.email, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  AuthUtils.setAccessTokenToCookie({ req, res, accessToken: newAccessToken });
  AuthUtils.setRefreshTokenToCookie({ req, res, refreshToken: newRefreshToken });

  const result: TRefreshToken = {
    profile: { email: user.email },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

  helpers.response.success(res, result);
};

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await TokenService.verifyAccessToken(req);
  if (!user) throw new createHttpError.Unauthorized("User not found");

  AuthModel.updateToken(user.email, { accessToken: "", refreshToken: "" });

  AuthUtils.removeTokenCookie(req, res);

  helpers.response.success(res, {});
};

const AuthService = {
  register,
  login,
  refreshToken,
  logout,
};

export default AuthService;
