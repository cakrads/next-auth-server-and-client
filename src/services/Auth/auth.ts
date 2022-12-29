import { NextPageContext } from "next";

import AuthRepository from "./repository";

import { TAuthGuard, TAuthGuardError } from "@src/containers/AuthGuard";

const getCurrentUser = async (ctx: NextPageContext) => {
  return await AuthRepository.getCurrentUser(ctx);
};

const checkUserAuthentication = async (
  ctx: NextPageContext
): Promise<TAuthGuard> => {
  try {
    const data = await AuthRepository.getCurrentUser(ctx);

    return {
      data: data,
      error: {} as TAuthGuardError,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        status: true,
        message: error.message,
      },
    };
  }
};

const AuthServices = {
  getCurrentUser,
  checkUserAuthentication,
};

export default AuthServices;
