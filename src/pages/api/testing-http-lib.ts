import { NextApiRequest, NextApiResponse } from "next";

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      // const response = getSimple(req);
      const response = await getUsePromise(req);
      return res.status(200).json(response);
    case "POST":
      return res.status(200).json(responseSuccess(req));
    case "PUT":
      return res.status(200).json(responseSuccess(req));
    case "DELETE":
      return res.status(200).json(responseSuccess(req));
    default:
      // res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default test;

// const getSimple = (req: NextApiRequest) => {
//   return responseSuccess(req);
// };

const getUsePromise = async (req: NextApiRequest) => {
  console.log("==== START getUsePromise ====");
  const start = Date.now();
  console.log("fetch-1 access", start);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const end = Date.now();
  const delay = end - start;
  console.log("fetch-1 end", Date.now());
  console.log("time", delay);
  console.log("==== END getUsePromise ====");

  return responseSuccess(req);
};

const responseSuccess = (req: NextApiRequest) => {
  return {
    status: "OK",
    code: 200,
    data: { name: "Test", email: "test@gamil.com" },
    error: false,
    message: "",
    meta: {
      param: req.query,
      body: req.body,
    },
    method: req.method,
  };
};
