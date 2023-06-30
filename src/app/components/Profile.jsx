"use client";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { appContext } from "./AppContext";
import { useRouter, useEffect } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useContext(appContext);
  const { isAuthenticated } = useContext(appContext);

  return (
    <div className="w-full border mx-auto flex-row">
      <div className="border flex-1 bg-gray-100 text-right px-25">
        <h3 className="p-5 bg-gray-800">
          <button
            className="text-white p-1"
            onClick={(e) => router.push("/dashboard")}
          >
            Return
          </button>
        </h3>
      </div>
      <div className="justify-center w-3/4 mx-20 py-10">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            User profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user.name}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Unit
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user.unit}
              </dd>
            </div>

            <dt className="text-sm font-medium leading-6 text-gray-900"></dt>
          </dl>
        </div>
      </div>
    </div>
  );
}
