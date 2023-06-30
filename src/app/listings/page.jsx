"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../components/AppContext";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

export default function Example() {
  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return formattedDate;
  };

  const router = useRouter();
  const [userListings, setUserListings] = useState([]);
  const { user, setUser } = useContext(appContext);

  useEffect(() => {
    fetch("/api/listings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const usersListings = data.filter(
          (listing) => listing.user_id === user.id
        );
        console.log(usersListings);
        setUserListings(usersListings);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, [user.id]);

  return (
    <div>
      <div className="border mb-25 flex-1 bg-gray-100 text-right px-25">
        <h3 className="p-5 bg-gray-800">
          <button
            className="text-white p-1"
            onClick={(e) => router.push("/dashboard")}
          >
            Return
          </button>
        </h3>
      </div>
      <div className="my-5 mx-auto py-5 w-full">
        <ul role="list" className="divide-y m-auto w-1/2 divide-gray-100">
          {userListings.map((listing) => (
            <li key={listing.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {listing.title}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {formatDate(listing.created_at)}
                  </p>
                </div>
              </div>
              <div className="hidden w-1/2 sm:flex sm:flex-col sm:items-end text-right">
                <ul className=" p-4 rounded-md">
                  {listing.comments.map((comment) => (
                    <div className="collapse w-full bg-base-200">
                      <input type="checkbox" />
                      <div className="collapse-title text-xl font-medium">
                        <p className="text-sm">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      <div className="collapse-content">
                        <li className="text-sm flex-col mb-4">
                          <p>{comment.content}</p>
                        </li>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
