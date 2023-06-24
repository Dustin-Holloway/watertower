"use client";
import React from "react";
import { useContext } from "react";
import { appContext } from "./AppContext";

export default function Card({
  listing,
  setShowListing,
  showListing,
  handleClick,
}) {
  const { user } = useContext(appContext);
  console.log(listing);

  return (
    <div
      className="max-w-sm w-full rounded overflow-hidden shadow-lg"
      onClick={() => handleClick(listing)}
    >
      <img
        className="w-full h-32 object-cover"
        src={listing.image}
        alt={listing.title}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{listing.title}</div>
        <p className="text-gray-700 text-base">{listing.content}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <p>{listing.type}</p>
          {listing.user && listing.user.name}
        </span>
      </div>
    </div>
  );
}
