import React from "react";

import PrivateRoute, { TAuthGuardProps } from "@src/containers/AuthGuard";

type TProtedPage = {
  defaultProps: string;
} & TAuthGuardProps;

function ProtectedPage(props: TProtedPage) {
  return <>Hi {props.data?.profile.name || "-"}</>;
}

export default PrivateRoute(ProtectedPage);
