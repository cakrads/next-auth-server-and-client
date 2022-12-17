import type { NextApiResponse } from "next";

function success(res: NextApiResponse, data: any) {
  const result = {
    success: true,
    code: 200,
    message: "Ok",
    data,
  };

  res.setHeader("content-type", "application/json");
  res.status(200).send(result);
}

function error(res: NextApiResponse, error: any) {
  const result = {
    success: false,
    code: 500, // default to 500 server error
    message: error.message,
    data: null,
  };

  if (typeof error === "string") {
    // custom application error
    result.code = 400;
    result.message = error;
  }

  if (["UnauthorizedError", "JsonWebTokenError"].includes(error.name)) {
    // jwt authentication error
    result.code = 401;
    result.message = error.message || "Invalid Token";
  }

  if (error.name === "TokenExpiredError") {
    result.message = "Token is Expired";
  }

  res.setHeader("content-type", "application/json");
  return res.status(result.code).send(result);
}

export { success, error };
