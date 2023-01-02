import React from "react";

import PrivateRoute, { TAuthGuardProps } from "@src/containers/AuthGuard";

type TProtedPage = {
  defaultProps: string;
} & TAuthGuardProps;

function ProtectedPage(props: TProtedPage) {
  return <>Hi, your email is {props.data?.profile.email || "-"}</>;
}

export default PrivateRoute(ProtectedPage);
