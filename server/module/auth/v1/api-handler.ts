import { middleware } from "@server/helpers";
import { AuthService } from "./services";

import type { NextApiRequest, NextApiResponse } from "next";

export const authLoginHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "POST":
        return AuthService.login(req, res);
      default:
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
);

export const authRegisterHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "POST":
        return AuthService.register(req, res);
      default:
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
);

export const authRefreshTokenHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "POST":
        return AuthService.refreshToken(req, res);
      default:
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
);

export const authLogoutHandler = middleware(
  (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "DELETE":
        return AuthService.logout(req, res);
      default:
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
);
