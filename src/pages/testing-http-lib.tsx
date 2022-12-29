import { useEffect, useState } from "react";

import { HttpClient, HttpResult } from "@src/libs/httpclient";

export type TTest = {
  data: TData;
  isLoading: Boolean;
  error: TError;
  repository: any;
};

export type TDataResult = {
  data: TData;
  method: string;
};

export type TData = {
  profile: TProfile;
};

export type TProfile = {
  name: string;
  email: string;
};

export type TError = {
  status: Boolean;
  message: string;
};

const useRepository = () => {
  const httpClient = new HttpClient("http://localhost:3000");

  const getData = async () => {
    const result: HttpResult<TDataResult> = await httpClient.get<TDataResult>(
      "api/testing-http-lib"
    );
    console.log("Method", result.getValueOrThrow().method);
    console.log("result.response", result.response);
    return result.getValueOrThrow().data;
  };

  const postData = async () => {
    const result: HttpResult<TDataResult> = await httpClient.post<TDataResult>(
      "api/test"
    );
    console.log("Method", result.getValueOrThrow().method);
    console.log("result.response", result.response);
    return result.getValueOrThrow().data;
  };

  const putData = async () => {
    const result: HttpResult<TDataResult> = await httpClient.put<TDataResult>(
      "api/test"
    );
    console.log("Method", result.getValueOrThrow().method);
    console.log("result.response", result.response);
    return result.getValueOrThrow().data;
  };

  const deleteData = async () => {
    const result: HttpResult<TDataResult> =
      await httpClient.delete<TDataResult>("api/test");
    console.log("Method", result.getValueOrThrow().method);
    console.log("result.response", result.response);
    return result.getValueOrThrow().data;
  };

  const cancelRequest = async () => {
    httpClient.cancel();
  };

  return {
    getData,
    postData,
    putData,
    deleteData,
    cancelRequest,
  };
};

const useAction = (): TTest => {
  const repository = useRepository();

  const [data, setData] = useState<TData>({} as TData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<TError>({} as TError);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await repository.getData();
        setData(result);
      } catch (error: any) {
        setError({ status: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    getData();

    return () => {
      console.log("un mount");
      repository.cancelRequest();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    error,
    repository,
  };
};

const TestingHttpLibComponent = () => {
  const { data, isLoading, error, repository }: TTest = useAction();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error.status) {
    return <div>Data: {error.message}</div>;
  }

  return (
    <>
      Data: {JSON.stringify(data)}
      <br />
      <button onClick={repository.getData}>GET</button>
      <br />
      <br />
      <button onClick={repository.postData}>POST</button>
      <br />
      <br />
      <button onClick={repository.putData}>PUT</button>
      <br />
      <br />
      <button onClick={repository.deleteData}>DELETE</button>
    </>
  );
};

const TestingHttpLibPage = () => {
  const [hide, setHide] = useState(false);

  const _handleMount = () => {
    setHide((val) => !val);
  };

  return (
    <>
      {!hide && <TestingHttpLibComponent />}
      <br />
      <br />
      <br />
      <button onClick={_handleMount}>
        {!hide ? "Unmount Component" : "Mount Component"}
      </button>
    </>
  );
};

export default TestingHttpLibPage;
