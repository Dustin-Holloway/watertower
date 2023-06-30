"use client";

import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext } from "react";
import { appContext } from "./AppContext";

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [replyField, setReplyField] = useState(false);
  const [clickedMessageId, setClickedMessageId] = useState(null);
  const [reply, setReply] = useState({
    content: "",
  });

  const { user } = useContext(appContext);

  function handleReply() {
    const replyObj = {
      content: reply.content,
      message_id: clickedMessageId,
    };

    console.log(replyObj);

    fetch("api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(replyObj),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedMessages = messages.map((message) => {
          if (message.id === clickedMessageId) {
            return {
              ...message,
              replies: [...message.replies, data],
            };
          }
          return message;
        });
        setMessages(updatedMessages);
        setReply({ content: "" });
      })
      .catch((error) => console.log(error));
    setReplyField(false);
    setClickedMessageId(null);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const sortMessages = (data) => {
    const sortedMessages = data.sort((a, b) => {
      if (a.created_at > b.created_at) {
        return -1; // b should come before a
      } else if (a.created_at < b.created_at) {
        return 1; // a should come after b
      } else {
        return 0; // a and b have the same created_at, maintain their order
      }
    });
    setMessages((prevMessages) => [...prevMessages, ...data]);
  };

  const fetchMessages = () => {
    fetch(`/api/messages?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        sortMessages(data);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.length > 0);
      })
      .catch((error) => console.log(error));
  };

  const [newMessage, setNewMessage] = useState({
    content: "",
  });

  const handlePost = () => {
    fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prevMessages) => [data, ...prevMessages]);
        setNewMessage({ content: "" });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className=" flex  bg-gray-100 justinfy-center py-20 rounded">
      <div className="mx-auto justify-center max-w-5xl px-6 lg:px-8">
        <div className="mx-auto text-center flex-1 max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Towerhill messenger.
          </p>
          <p className="mt-6 text-lg justify-center leading-8 text-gray-600">
            Leave a message for the community.
          </p>

          <div className="flex rounded-md mt-5  ">
            <input
              type="text"
              name="content"
              value={newMessage.content}
              onChange={(e) => {
                setNewMessage({
                  ...newMessage,
                  [e.target.name]: e.target.value,
                });
              }}
              className="justify-center w-200 flex-1 mx-5 border rounded-md bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="When did the trash get picked up?"
            />
            <button
              onClick={handlePost}
              className="justify-center  w-20 rounded-md  border text-white bg-blue-500"
            >
              Post
            </button>
          </div>
        </div>

        <div
          id="scrollableDiv"
          className="flex-1 mx-auto mt-16 overflow-auto max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchMessages}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more messages to load.</p>}
            scrollableTarget="scrollableDiv"
          >
            <dl className="py-10 px-5 bg-white rounded-md grid m-auto max-w-xl grid-cols-1 gap-x-5 gap-y-10 lg:max-w-85 lg:gap-y-10">
              {messages.map((feature) => (
                <div
                  key={feature.id}
                  className="relative border flex-1 p-5 bg-gray-100"
                >
                  <div className="flex  capitalize">
                    <p className="text-sm-b leading-7 font-normal text-gray-500">
                      {feature.user?.name}
                    </p>
                    <p className="text-right flex-1 text-sm-b leading-7 text-sm/5 text-gray-500">
                      {feature.created_at}
                    </p>
                  </div>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg"></div>
                  </dt>
                  <dd
                    onClick={(e) => setClickedMessageId(feature.id)}
                    className="mt-1 text-l/8 bg-gray-200 rounded-lg pl-3 py-2 leading-7 text-gray-600"
                  >
                    {feature.content}
                  </dd>
                  <div className="flex flex-wrap text-sm">
                    <div className="grid-col ml-auto">
                      {feature.replies?.map((item) => (
                        <div key={item.id}>
                          <p className="display-inline-block text-black text-right rounded-lg mt-3">
                            {item.user?.name}
                          </p>
                          <p className="display-inline-block text-black text-right bg-blue-300 rounded-lg pt-1 pb-1 pr-2 pl-2">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {clickedMessageId === feature.id && (
                    <div className="flex mt-5 pt-2  rounded-md">
                      <input
                        onChange={(e) =>
                          setReply({
                            ...reply,
                            [e.target.name]: e.target.value,
                          })
                        }
                        type="text"
                        name="content"
                        value={reply.content}
                        className="flex-1 text-black rounded-md border"
                      ></input>
                      <button
                        className="justify-center ml-3 w-16 rounded-md p-1 border text-white bg-blue-500"
                        onClick={handleReply}
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </dl>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
