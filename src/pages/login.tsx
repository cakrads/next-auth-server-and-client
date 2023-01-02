import React, { useState } from "react";
import Link from "next/link";

import { AuthModule } from "@src/services";
import Field from "@components/field";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    try {
      console.log(email, password);
      const result = await AuthModule.AuthService.login({ email, password });
      if (result.accessToken) {
        console.log("Login Success");
        router.replace("/protected");
      }
    } catch (error: any) {
      console.log({ error });
      setErrorMsg(error.message);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {errorMsg && <p>{errorMsg}</p>}
        <Field
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email"
        />
        <Field
          name="password"
          type="password"
          autoComplete="password"
          required
          label="Password"
        />
        <button type="submit">Submit</button> or{" "}
        <Link href="/register">Register</Link>
      </form>
    </>
  );
}

export default Login;
