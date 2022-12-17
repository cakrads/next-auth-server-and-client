/**
 * this middleware only use for route /api/.*
 */
import { runAllCustomeMiddleware } from "./custome-middleware";
import * as helpers from "./index";

import type { NextApiRequest, NextApiResponse } from "next";

function middleware(handler: any, customeMiddleware?: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // run all custome middleware
      await runAllCustomeMiddleware(req, res, customeMiddleware);

      // route handler
      await handler(req, res);
    } catch (err) {
      // global error handler
      helpers.response.error(res, err);
    }
  };
}

export { middleware };
