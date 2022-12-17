import { NextApiRequest, NextApiResponse } from "next";

import * as helpers from "@server/helpers";
import { TokenService } from "@server/module/auth/v1/services";
import UserModel from "../model";
import { TAuth, TUserList } from "types";

const me = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email }: TAuth =
    await TokenService.verifyAccessToken(req);

  const user: TAuth = await UserModel.find(email);

  const result = {
    email: user.email,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
  helpers.response.success(res, result);
};

const userList = async (req: NextApiRequest, res: NextApiResponse) => {
  await TokenService.verifyAccessToken(req);

  const users: TAuth[] = await UserModel.list();
  const result: TUserList = users.map((user) => ({
    email: user.email,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  }));

  helpers.response.success(res, result);
};

const UserService = {
  me,
  userList,
};

export default UserService;
