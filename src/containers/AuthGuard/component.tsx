/* eslint-disable react/display-name */
import React from "react";
import Router from "next/router";
import { NextPage } from "next";

import { AuthModule } from "@src/services";

import { TAuthGuard, TAuthGuardProps } from "./types";

const REDIRECT_PAGE: string = "/login?redirected=true";

const AuthGuardContainer = (WrappedComponent: any) => {
  const component: NextPage = ({ ...props }) => <WrappedComponent {...props} />;

  component.getInitialProps = async (ctx): Promise<TAuthGuardProps> => {
    const result: TAuthGuard =
      await AuthModule.AuthService.checkUserAuthentication(ctx);

    // Are you an authorized user or not?
    if (!result.data || result.error) {
      const errorMessage = result.error?.status
        ? `&error-message=${result.error.message}`
        : "";
      const redirectPage = `${REDIRECT_PAGE}${errorMessage}`;

      // Handle server-side and client-side rendering.
      if (ctx.res) {
        ctx.res?.writeHead(302, {
          Location: redirectPage,
        });
        ctx.res?.end();
      } else {
        Router.replace(redirectPage);
      }
    }

    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...ctx,
        data: result.data,
      });
      return { ...wrappedProps, data: result.data };
    }

    return { data: result.data };
  };

  return component;
};

export default AuthGuardContainer;
