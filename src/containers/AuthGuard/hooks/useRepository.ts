import { HttpClient, HttpResult } from "@src/libs/httpclient";

import { TAuthData } from "../types";

const useRepository = () => {
  const httpClient = new HttpClient("BASE_URL");

  const getCurrentUser = async () => {
    const result: HttpResult<TAuthData> = await httpClient.get<TAuthData>(
      "users/123"
    );
    return result.getValueOrThrow();
  };

  const cancelRequest = async () => {
    httpClient.cancel();
  };

  return {
    getCurrentUser,
    cancelRequest,
  };
};

export default useRepository;
