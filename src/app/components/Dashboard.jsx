"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import MessageBoard from "./MessageBoard";
import Card from "./Card";
import { useState, useEffect, useContext } from "react";
import CardContainer from "./CardContainer";
import DocsTable from "./Documents";
import { GiWaterTower } from "react-icons/gi";
import ContactCard from "./ContactCard";
import Example from "./DashComps";
import Cal from "./Calender";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { Button } from "./Button";
import {
  Card2,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Cards";

import { Input } from "./Input";
import { Label } from "./Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Selectors";

export default function Dashboard({
  isAuthenticated,
  setIsAuthenticated,
  currentUser,
  setCurrentUser,
}) {
  // const [currentNavItem, setCurrentNavItem] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("Dashboard");
  // const [showMessageBoard, setShowMessageBoard] = useState(false);
  // const [showListingsBoard, setShowListings] = useState(false);
  const [listings, setListings] = useState([]);
  // const [showDocsTable, setShowDocsTable] = useState(false);
  const [documents, setDocuments] = useState([]);

  const router = useRouter();
  const navigation = [
    { name: "Dashboard", href: "#", component: "Dashboard" },
    { name: "Listings", href: "#", component: "Listings" },
    { name: "Message Board", href: "#", component: "Message Board" },
    { name: "Events", href: "#", component: "Events" },
    { name: "Docs", href: "#", component: "Docs" },
  ];

  const user = {
    name: currentUser.name,
    image: currentUser.image,
    email: currentUser.email,
    unit: currentUser.unit,
  };

  const userNavigation = [
    { name: "Profile", href: "#" },
    { name: "Mail", href: "#" },
    { name: "Sign out", href: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [displayForm, setDisplayForm] = useState(false);

  function displayNewListingForm() {}

  function handleLogOut() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });
  }

  const sortListings = (data) => {
    const sortedListings = [data, ...listings]; // Prepend new listing to the existing listings
    setListings(sortedListings);
  };

  useEffect(() => {
    fetch("/api/listings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => sortListings(data));
  }, [setListings]);

  function handleLogOut(e) {
    e.preventDefault();

    fetch("/api/logout", {
      method: "DELETE",
    });
    router.push("/");
  }

  useEffect(() => {
    fetch("/api/documents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => setDocuments(data));
  }, []);

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex">
                      <p className="h-full text-2xl w=full  text-white">
                        <GiWaterTower />
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.component === currentComponent
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                            onClick={(e) => setCurrentComponent(item.component)}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            {user.image ? (
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.image}
                                alt=""
                              />
                            ) : (
                              <img
                                className="h-8 w-8 rounded-full"
                                src="./5fd0bad5-b765-4596-a4c7-eb5e0b37dddc.jpeg"
                                alt=""
                              />
                            )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={(e) => {
                                      if (item.name === "Sign out") {
                                        handleLogOut(e);

                                        // Perform sign out functionality
                                        // signOut({ callbackUrl: "/" });
                                      }
                                      if (item.name === "Profile") {
                                        // Handle other menu item actions or functionality
                                        router.push("/profile");
                                      }
                                      if (item.name === "Mail") {
                                        // Handle other menu item actions or functionality
                                        router.push("/listings");
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.image}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {currentComponent === "Listings" && (
              <h1
                onClick={(e) => setDisplayForm(!displayForm)}
                className="text-3lg display-block font-bold tracking-tight text-gray-900 cursor hover:text-blue-700"
              >
                Post new listing
              </h1>
            )}
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* <Alert>
              <RocketIcon className="h-4 text-black w-4" />
              <AlertTitle className="text-black">Heads up!</AlertTitle>
              <AlertDescription className="text-black">
                You can add components and dependencies to your app using the
                cli.
              </AlertDescription>
            </Alert> */}
            <div className="text-black flex">
              {/* <Card2 className="w-[350px]">
                <CardHeader>
                  <CardTitle>Create project</CardTitle>
                  <CardDescription>
                    Deploy your new project in one-click.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Framework</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                            <SelectContent position="popper">
                              <SelectItem value="next">Next.js</SelectItem>
                              <SelectItem value="sveltekit">
                                SvelteKit
                              </SelectItem>
                              <SelectItem value="astro">Astro</SelectItem>
                              <SelectItem value="nuxt">Dope Dude</SelectItem>
                            </SelectContent>
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Deploy</Button>
                </CardFooter>
              </Card2> */}
            </div>

            {currentComponent === "Events" && <Cal />}
            {currentComponent === "Dashboard" && (
              <div className=" grid gap-10 grid-cols-2">
                <Example />
              </div>
            )}
            {currentComponent === "Message Board" && <MessageBoard />}
            {currentComponent === "Listings" && (
              <CardContainer
                displayForm={displayForm}
                setDisplayForm={setDisplayForm}
                isAuthenticated={isAuthenticated}
                listings={listings}
                setListings={setListings}
                sortListings={sortListings}
              />
            )}
            {currentComponent === "Docs" && <DocsTable documents={documents} />}
          </div>
        </main>
      </div>
    </>
  );
}
