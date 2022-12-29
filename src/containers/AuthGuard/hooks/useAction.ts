/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { TAuthData, TAuthGuard, TAuthGuardError } from "../types";
import useRepository from "./useRepository";

const useAction = (): TAuthGuard => {
  const repository = useRepository();

  const [data, setData] = useState<TAuthData>({} as TAuthData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<TAuthGuardError>({} as TAuthGuardError);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const data = await repository.getCurrentUser();
        setData(data);
      } catch (error: any) {
        setError({ status: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();

    return () => {
      repository.cancelRequest();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

export default useAction;
