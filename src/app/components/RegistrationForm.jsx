"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  function handleLogin(e) {
    const userObject = {
      name: newUser.name,
      email: newUser.email,
      unit: newUser.unit,
      password: newUser.password,
    };

    e.preventDefault();
    fetch("/api/new_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((date) => console.log(date));

    setNewUser(defaultValues);
    router.push("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div class="container py-5 rounded justify-center m-auto flex center w-1/4 bg-slate-200">
        <form
          onSubmit={handleLogin}
          class="bg-blue  flex-1 text-center w-1/3 px-5 py-4 text-black mx-auto rounded"
        >
          <input
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="name"
            type="text"
            placeholder="name"
            class="block w-full mx-auto text-sm py-2 px-3 rounded my-3 "
          />
          <input
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="email"
            type="text"
            placeholder="email"
            class="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />
          <input
            value={newUser.unit}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="unit"
            type="integer"
            placeholder="unit #"
            class="block w-full mx-auto text-sm py-2 px-3 rounded my-3 "
          />
          <input
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            name="password"
            type="password"
            placeholder="password"
            class="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />

          <input
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            class="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
          />
          <button class="bg-blue text-white font-bold py-2 px-4 rounded border block mx-auto w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
