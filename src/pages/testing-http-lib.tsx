import { useEffect, useRef, useState } from "react";

import { URL_API } from "@src/configs";
import {
  HttpClient,
  HttpResult,
  IHttpClientOptions,
} from "@src/libs/httpclient";

export type IUseAction = {
  data: TData;
  isLoading: Boolean;
  error: TError;
  repository: IUseRepository;
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

interface IUseRepository {
  getData(args1?: IHttpClientOptions): Promise<TData>;
  postData(args1?: IHttpClientOptions): Promise<TData>;
  putData(args1?: IHttpClientOptions): Promise<TData>;
  deleteData(args1?: IHttpClientOptions): Promise<TData>;
}

const useRepository = (): IUseRepository => {
  const getData = async (options?: IHttpClientOptions) => {
    const httpClient = new HttpClient(URL_API, options);
    const result: HttpResult<TDataResult> = await httpClient.get<TDataResult>(
      "/testing-http-lib"
    );
    return result.getValueOrThrow().data;
  };

  const postData = async (options?: IHttpClientOptions) => {
    const httpClient = new HttpClient(URL_API, options);
    const result: HttpResult<TDataResult> = await httpClient.post<TDataResult>(
      "api/test"
    );
    return result.getValueOrThrow().data;
  };

  const putData = async (options?: IHttpClientOptions) => {
    const httpClient = new HttpClient(URL_API, options);
    const result: HttpResult<TDataResult> = await httpClient.put<TDataResult>(
      "api/test"
    );
    return result.getValueOrThrow().data;
  };

  const deleteData = async (options?: IHttpClientOptions) => {
    const httpClient = new HttpClient(URL_API, options);
    const result: HttpResult<TDataResult> =
      await httpClient.delete<TDataResult>("api/test");
    return result.getValueOrThrow().data;
  };

  return {
    getData,
    postData,
    putData,
    deleteData,
  };
};

const useAction = (): IUseAction => {
  const repository = useRepository();

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const [data, setData] = useState<TData>({} as TData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<TError>({} as TError);

  useEffect(() => {
    const abortController = abortControllerRef.current;
    const signal = abortController.signal;
    const getData = async () => {
      try {
        const result = await repository.getData({ signal });
        setData(result);
      } catch (error: any) {
        if (error.name === "CanceledError") {
          console.log("successfully aborted");
        } else {
          setError({ status: true, message: error.message });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getData();

    return () => {
      // cancel the request before component unmounts
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // example use axios
  // useEffect(() => {
  //   const controller = new AbortController();
  //   axios
  //     .get("http://localhost:3000/api/testing-http-lib", {
  //       signal: controller.signal,
  //     })
  //     .then((response: any) => {
  //       console.log(response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   return () => {
  //     // cancel the request before component unmounts
  //     controller.abort();
  //   };
  // }, []);

  // example use fetch
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   console.log({ controller });

  //   fetch("http://localhost:3000/api/testing-http-lib", {
  //     signal: signal,
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       // handle success
  //       console.log(response);
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //       if (err.name === "AbortError") {
  //         console.log("successfully aborted");
  //       } else {
  //         // handle error
  //       }
  //     });
  //   return () => {
  //     // cancel the request before component unmounts
  //     controller.abort();
  //   };
  // }, []);

  return {
    data,
    isLoading,
    error,
    repository,
  };
};

const TestingHttpLibComponent = () => {
  const { data, isLoading, error, repository }: IUseAction = useAction();
  const abortControllerRef = useRef<AbortController>(new AbortController());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error.status) {
    return <div>Data: {error.message}</div>;
  }

  const _handleTestDoubleFetch = () => {
    console.log("first fetch");
    const first = repository.getData();

    console.log("second fetch");
    const signal = abortControllerRef.current.signal;
    const second = repository.getData({ signal });

    first
      .then((res: any) => {
        console.log("first success", res);
      })
      .catch((err: any) => {
        console.log("first error", err);
      });

    second
      .then((res: any) => {
        console.log("second success", res);
      })
      .catch((err: any) => {
        if (err.name === "CanceledError") {
          console.log("second fetch abort");
          console.log("err", err);
        }
      });
  };

  const cancelSecondFetch = () => {
    const abortController = abortControllerRef.current;
    abortController.abort();

    // Reset new AbortController, so the 2nd fetch can re-fetch
    abortControllerRef.current = new AbortController();
  };

  return (
    <>
      Data: {JSON.stringify(data)}
      <br />
      <button onClick={() => repository.getData()}>GET</button>
      <br />
      <br />
      <button onClick={() => repository.postData()}>POST</button>
      <br />
      <br />
      <button onClick={() => repository.putData()}>PUT</button>
      <br />
      <br />
      <button onClick={() => repository.deleteData()}>DELETE</button>
      <br />
      <br />
      <br />
      <br />
      <button onClick={_handleTestDoubleFetch}>Do 2 Fetch</button> |
      <button onClick={cancelSecondFetch}>Cancel 2nd Fetch</button>
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
