import React from "react";

import PrivateRoute, { TAuthGuardProps } from "@src/containers/AuthGuard";
import { AuthModule } from "@src/services";
import Router from "next/router";

type TProtedPage = {
  defaultProps: string;
} & TAuthGuardProps;

function ProtectedPage(props: TProtedPage) {
  const logout = async () => {
    try {
      await AuthModule.AuthService.logout();
      Router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      Hi, your email is {props.data?.profile.email || "-"}
      <br />
      <br />
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default PrivateRoute(ProtectedPage);
