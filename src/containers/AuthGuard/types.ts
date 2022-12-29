export type TAuthGuard = {
  data: TAuthData | null;
  isLoading?: Boolean;
  error: TAuthGuardError;
};

export type TAuthData = {
  profile: TProfile;
};

export type TProfile = {
  email: string;
  name: string;
};

export type TAuthGuardError = {
  status: Boolean;
  message: string;
};

export type TAuthGuardProps = {
  data: TAuthData | null;
};
