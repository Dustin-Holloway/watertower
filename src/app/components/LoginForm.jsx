"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { appContext } from "./AppContext";

const schema = yup.object({
  email: yup.string().min(2).max(30).required("required"),
  password: yup.string().min(5).max(20),
});

export default function LoginForm() {
  const { setUser } = useContext(appContext);

  const [loginError, setLoginError] = useState(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitData = async (form) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const userData = await response.json();
      console.log(userData);
      setUser(userData);

      router.push("/dashboard");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container py-5 rounded justify-center m-auto flex center w-1/4 bg-slate-100">
        <form
          onSubmit={handleSubmit(submitData)}
          className="bg-blue  flex-1 text-center w-1/3 px-3 py-4 text-black mx-auto rounded"
        >
          <input
            name="email"
            type="text"
            {...register("email", { required: true })}
            placeholder="email"
            className="block w-full mx-auto text-sm py-2 px-3  bg-white rounded"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>
          )}
          {loginError && (
            <p className="text-red-600 text-xs mt-2">{loginError}</p>
          )}

          <input
            type="password"
            name="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />
          {errors.password && (
            <p className="text-red-600 text-xs mb-2 ">
              {errors.password.message}
            </p>
          )}
          {/* {loginError && (
            <p className="text-red-600 text-xs mt-2">{loginError}</p>
          )} */}

          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded border block mx-auto w-full">
            Login
          </button>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/registration"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
