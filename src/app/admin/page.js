"use client";

// import React from "react";
// import RegistrationForm from "../components/RegistrationForm";

// export default function AdminSignUp() {
//   return <RegistrationForm />;
// }

import React, { useState } from "react";
import RegistrationForm from "../components/RegistrationForm";
import { useRouter } from "next/navigation";

export default function AdminSignUp() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const router = useRouter();

  const defaultValues = {
    name: "",
    email: "",
    unit: "",
    password: "",
    confirmPassword: "",
    is_admin: true,
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
    fetch("/api/new_admin", {
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

  // Function to handle the form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if the password is correct
    if (password === "your-password") {
      setAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // Render the page content based on authentication status
  if (authenticated) {
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
  } else {
    return (
      <div>
        <h1>Admin Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
