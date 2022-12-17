import { middleware } from "@server/helpers";
import { UserService } from "./services";

import type { NextApiRequest, NextApiResponse } from "next";
import { TokenService } from "@server/module/auth/v1/services";

export const userListHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "GET":
        return UserService.userList(req, res);
      default:
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  [TokenService.verifyAccessToken]
);

export const userMeHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "GET":
        return UserService.me(req, res);
      default:
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  [TokenService.verifyAccessToken]
);
