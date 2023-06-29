"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { appContext } from "./AppContext";

export default function RegistrationForm() {
  const router = useRouter();

  const defaultValues = {
    name: "",
    email: "",
    unit: "",
    password: "",
    confirmPassword: "",
  };

  const [newUser, setNewUser] = useState(defaultValues);
  const { setUser } = useContext(appContext);
  const [loginError, setLoginError] = useState(null);

  // const handleLogin = async (e) => {
  //   const userObject = {
  //     name: newUser.name,
  //     email: newUser.email,
  //     unit: newUser.unit,
  //     password: newUser.password,
  //   };

  const handleLogin = async (e) => {
    const userObject = {
      name: newUser.name,
      email: newUser.email,
      unit: newUser.unit,
      password: newUser.password,
    };
    e.preventDefault();

    try {
      const response = await fetch("/api/new_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
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

  //   e.preventDefault();

  //   try {
  //     fetch("/api/new_user", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newUser),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error);
  //     }

  //     const userData = await response.json();
  //     console.log(userData);
  //     setUser(userData);

  //     router.push("/dashboard");
  //   } catch (error) {
  //     setLoginError(error.message);
  //   }
  // };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container py-5 rounded justify-center m-auto flex center w-1/4 bg-slate-200">
        <form
          onSubmit={handleLogin}
          className="bg-blue  flex-1 text-center w-1/3 px-5 py-4 text-black mx-auto rounded"
        >
          <input
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="name"
            type="text"
            placeholder="name"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 "
          />
          <input
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="email"
            type="text"
            placeholder="email"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />
          <input
            value={newUser.unit}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="unit"
            type="integer"
            placeholder="unit #"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 "
          />
          <input
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="password"
            type="password"
            placeholder="password"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />

          <input
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />
          <button className="bg-blue text-white font-bold py-2 px-4 rounded border block mx-auto w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
