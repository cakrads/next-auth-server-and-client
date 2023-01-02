import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Field from "@components/field";
import { AuthModule } from "@src/services";

function Register() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    try {
      await AuthModule.AuthService.register({ email, password });
      router.push("/login");
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  }

  return (
    <>
      <h1>Register</h1>
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
        <Link href="/login">Login</Link>
      </form>
    </>
  );
}

export default Register;
