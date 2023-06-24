"use cient";

import react from "react";
import Card from "./Card";
import { useState } from "react";
import { Typography, Modal } from "@material-tailwind/react";
import ListingModal from "./ListingModal";
import { useContext } from "react";
import { appContext } from "./AppContext";
// import { DialogDemo } from "./Button";

export default function CardContainer({
  listings,
  isAuthenticated,
  displayForm,
  setDisplayForm,
}) {
  const { user } = useContext(appContext);
  const [showListing, setShowListing] = useState({
    show: false,
    listing: null,
  });
  const [listingReply, setListingReply] = useState({
    content: "",
  });

  function handleOnClick(event) {
    event.preventDefault();
    console.log(listingReply.content);
    setListingReply({ content: "" });
    setShowListing({
      show: false,
      listing: null,
    });
  }
  function handleClick(selectedListing) {
    setShowListing({
      show: true,
      listing: selectedListing,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center">
      {listings.map((listing) => (
        <Card
          className="flex "
          showListing={showListing}
          setShowListing={setShowListing}
          listing={listing}
          key={listing.id}
          handleClick={handleClick}
        />
      ))}
      {displayForm && (
        <ListingModal
          setDisplayForm={setDisplayForm}
          displayForm={displayForm}
        />
      )}

      {showListing.show && (
        <div className="fixed w-full rounded-lg inset-0 z-50 flex items-center justify-center">
          <div className="fixed w-full rouned-lg inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg w-1/2 h-full z-10 p-2">
            <div className="flex justify-between w-full items-center mb-4">
              <button
                className="btn rounded-md bg-blue-500 hover:bg-blue-600 text-white font-"
                onClick={(e) => setShowListing({ show: false, listing: null })}
              >
                Close
              </button>
              {showListing.listing.user_id === user?.id && (
                <button className="btn rounded-md bg-blue-500 hover:bg-blue-600 text-white font- right">
                  Edit
                </button>
              )}
            </div>
            <div className=" flex-col h-1/2 w-full p-5 overflow-hidden">
              <div className="text-left ">
                <div className="flex pb-3">
                  <Typography type="heading-4" className="font-bold text-left">
                    {showListing.listing.title}
                  </Typography>
                  <Typography type="heading-5" className="ml-auto">
                    {showListing.listing.created_at}
                  </Typography>
                </div>

                <img
                  className="flex center  w-full h-full"
                  src={showListing.listing.image}
                ></img>
              </div>
            </div>
            <div className=" w-full display-block m-auto text-center p-5">
              <p>{showListing.listing.content}</p>
              <div className="bg-black border my-3"></div>
              <div className="flex-col">
                <textarea
                  value={listingReply.content}
                  name="content"
                  rows={6}
                  onChange={(e) =>
                    setListingReply({
                      ...listingReply,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="flex-1 w-full resize-none border"
                ></textarea>
                <div className="flex-1">
                  <button
                    onClick={handleOnClick}
                    className="btn w-full bg-blue-200 p-1 rounded-lg "
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
