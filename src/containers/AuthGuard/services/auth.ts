import AuthRepository from "./repository";

import { NextPageContext } from "next";
import { TAuthGuard, TAuthGuardError } from "../types";

const getCurrentUser = async (ctx: NextPageContext) => {
  return await AuthRepository.getCurrentUser(ctx);
  // return {
  //   profile: {
  //     email: "email@gmail.com",
  //     name: "Cakra",
  //   },
  // };
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
