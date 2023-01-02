import { TAuthData } from "types/*";

export type TAuthGuard = {
  data: TAuthData | null;
  isLoading?: Boolean;
  error: TAuthGuardError | null;
};

export type TAuthGuardError = {
  status: Boolean;
  message: string;
};

export type TAuthGuardProps = {
  data: TAuthData | null;
};
