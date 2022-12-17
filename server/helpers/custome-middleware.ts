import type { NextApiRequest, NextApiResponse } from "next";

// will run all middleware
export const runAllCustomeMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  customeMiddleware?: any
) => {
  if (!customeMiddleware) return;

  const tmp: any = [];
  customeMiddleware.map((middleware: any) => {
    tmp.push(middleware(req, res));
  });
  const allSettled = await Promise.allSettled(tmp);
  const anyRejected: any = allSettled.find(
    (item) => item.status === "rejected"
  );
  if (anyRejected) {
    throw anyRejected?.reason;
  }
};
