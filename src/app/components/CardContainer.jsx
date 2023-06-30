"use cient";

import react from "react";
import Card from "./Card";
import { useState } from "react";
import { Typography, Modal } from "@material-tailwind/react";
import ListingModal from "./ListingModal";
import { useContext } from "react";
import { appContext } from "./AppContext";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { CustomPlaceholder } from "react-placeholder-image";

export default function CardContainer({
  listings,
  isAuthenticated,
  displayForm,
  setDisplayForm,
  setListings,
  sortListings,
}) {
  const { user } = useContext(appContext);
  const [showListing, setShowListing] = useState({
    show: false,
    listing: null,
  });
  const [listingReply, setListingReply] = useState({
    content: "",
  });

  const [favorites, setFavorites] = useState([]);

  const [editFromValues, setEditFormValues] = useState({
    title: "",
    content: "",
    type: "",
    image: "",
    id: "",
  });

  const [editListing, setEditListing] = useState(false);

  function addToFavorites(listing) {
    fetch("/api/add_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        listing_id: listing.id,
      }),
    })
      .then((r) => r.json())
      .then((reply) => console.log(reply));
  }

  function handleClick(selectedListing) {
    setShowListing({
      show: true,
      listing: selectedListing,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the selected image in the component's state
        setEditFormValues({ ...editFromValues, image: file });
      };

      reader.readAsDataURL(file);
    }
  }

  function handleEditListing(listing) {
    setShowListing({
      show: false,
      listing: null,
    });

    setEditFormValues({
      title: listing.title,
      content: listing.content,
      type: listing.type,
      image: listing.image,
      id: listing.id,
    });
    setEditListing(true);
  }
  function handleDelete(id) {
    fetch(`/api/listings/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setListings((listings) =>
          listings.filter((listing) => listing.id !== id)
        );
      }
    });
    setShowListing({
      show: false,
      listing: null,
    });
  }

  function handleSubmitEdit(e) {
    e.preventDefault();

    const { content, title, type, image, id } = editFromValues;

    const formDataToSend = new FormData();
    formDataToSend.append("content", content);
    formDataToSend.append("title", title);
    formDataToSend.append("type", type);
    formDataToSend.append("image", image);

    fetch(`/api/listings/${editFromValues.id}`, {
      method: "PATCH",
      body: formDataToSend,
    })
      .then((r) => r.json())
      .then((updatedListing) => {
        console.log(updatedListing);
        const updatedListings = listings.map((listing) => {
          if (listing.id === updatedListing.id) {
            return updatedListing;
          }
          return listing;
        });
        setListings(updatedListings);
      });

    setEditListing(false);
  }

  function handleOnClick(listing) {
    fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: listingReply.content,
        listing_id: listing.id,
        user_id: user.id,
      }),
    })
      .then((r) => r.json())
      .then((reply) => console.log(reply));
  }

  function handleClick(selectedListing) {
    setShowListing({
      show: true,
      listing: selectedListing,
    });
  }

  return (
    <div className="grid w-3/4 m-auto grid-cols-2 gap-4 justify-items-center">
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
          key={listings.id}
          listings={listings}
          setListings={setListings}
          setDisplayForm={setDisplayForm}
          displayForm={displayForm}
          sortListings={sortListings}
        />
      )}

      {/* edit listing modal */}

      {editListing && (
        <div className="fixed w-full rounded-lg inset-5 z-50 flex items-center justify-center">
          <div className="fixed w-full rouned-lg inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg w-1/2 h-full z-10 p-2">
            <form onSubmit={(e) => handleSubmitEdit(e)} className="h-full">
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
                              setEditFormValues({
                                ...editFromValues,
                                [e.target.name]: e.target.value,
                              })
                            }
                            type="text"
                            name="title"
                            value={editFromValues.title}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Classified title"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <select
                        onChange={(e) =>
                          setEditFormValues({
                            ...editFromValues,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="flex-1 text-sm shadow rounded-md p-1 border-b border-gray-800/5"
                        type="select"
                        name="type"
                        defaultValue={setEditFormValues.type}
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
                            setEditFormValues({
                              ...editFromValues,
                              [e.target.name]: e.target.value,
                            })
                          }
                          value={editFromValues.content}
                          className="pl-3 block w-full resize-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                onChange={handleImageChange}
                              />
                            </label>
                            {/* <p className="pl-1">or drag and drop</p> */}
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn w-full h-25 m-auto rounded-1/2 bg-blue-600 text-white btn-primary"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showListing.show && (
        <div className="fixed w-full rounded-lg inset-5 z-50 flex items-center justify-center">
          <div className="fixed w-full rouned-lg inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg w-1/2 h-full z-10 p-2">
            <div className="flex justify-between w-full items-center mb-2">
              <button
                className=" rounded-md  p-1 bg-blue-500 hover:bg-blue-600 text-white font-"
                onClick={(e) => setShowListing({ show: false, listing: null })}
              >
                Close
              </button>
              <button
                onClick={(e) => addToFavorites(showListing.listing)}
                className="bg-red-400 p-1 ml-2 text-white rounded-md"
              >
                Favorite
              </button>
              {showListing.listing.user_id === user?.id && (
                <div>
                  <button
                    onClick={() => handleEditListing(showListing.listing)}
                    className="p-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font- right"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(showListing.listing.id)}
                    className="bg-red-400 p-1 ml-2 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
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

                {showListing.listing.image ? (
                  <img
                    className="flex center  w-full h-full"
                    src={showListing.listing.image}
                  ></img>
                ) : (
                  <CustomPlaceholder
                    className="flex center  w-full h-full"
                    width={200}
                    height={200}
                  />
                )}
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
                    onClick={(e) => handleOnClick(showListing.listing)}
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
