"use client";

import React from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { appContext } from "./AppContext";

export default function ListingModal({ displayForm, setDisplayForm }) {
  const { user } = useContext(appContext);

  function handleSubmitForm(e) {
    e.preventDefault();
    fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, user_id: user.id }),
    });
    setDisplayForm(!displayForm);
  }

  const [formData, setFormData] = useState({
    content: "",
    title: "",
    type: "",
    image: "",
  });

  return (
    <div className="fixed w-full rounded-lg inset-3 z-50 flex items-center justify-center">
      <div className="fixed w-full rouned-lg inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg w-1/2 h-full z-10 p-2">
        <form onSubmit={handleSubmitForm} className="h-full">
          <div className=" p-3">
            <div className="border-b border-gray-900/10 pb-5">
              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-4 ">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        type="text"
                        name="title"
                        value={formData.title}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Classified title"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="flex-1 text-sm shadow rounded-md p-1 border-b border-gray-800/5"
                    type="select"
                    name="type"
                  >
                    <option value="">Category</option>
                    <option value="For Sale">Sale</option>
                    <option value="Free">Free</option>
                    <option value="Wanted">Wanted</option>
                  </select>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2 ">
                    <textarea
                      name="content"
                      rows={6}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      value={formData.content}
                      className="pl-3 block w-full resize-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                      placeholder="Write a few sentences about your listing."
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Image
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn w-full flex rounded-lg mt-2 p-2 bg-blue-600 text-white btn-primary"
                    onClick={handleSubmitForm}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
