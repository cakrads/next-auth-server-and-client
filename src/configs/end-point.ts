const AUTH = (version: string) => {
  const _module = "auth";

  const genertePath = (path: string) => (
    `/${_module}/${version}/${path}`
  );

  return {
    LOGIN: genertePath("/login"),
    LOGOUT: genertePath("/logout"),
    REFRESH_TOKEN: genertePath("/refresh-token"),
    REGISTER: genertePath("/register"),
  };
};

const USER = (version: string) => {
  const _module = "user";

  const genertePath = (path: string) => (
    `/${_module}/${version}/${path}`
  );

  return {
    ME: genertePath("/me"),
    LIST: genertePath("/list"),
  };
};

export const END_POINT = {
  AUTH: AUTH("v1"),
  USER: USER("v1"),
};