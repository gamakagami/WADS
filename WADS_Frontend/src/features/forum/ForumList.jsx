/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserRoomsQueryOptions } from "../../queryOptionsFolders/getForumQuery";
import ChatHeader from "./ChatHeader";
import Message from "./Message";

function ForumList({ onRoomSelect, selectedRoomId }) {
  const { user } = useAuthContext();
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery(getUserRoomsQueryOptions(user.accessToken));

  if (isLoading)
    return (
      <div className="bg-white border border-[#D5D5D5] h-full rounded-md p-4 md:w-80 w-full">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-[#D5D5D5] h-full rounded-md p-4 md:w-80 w-full">
        <div className="text-red-500 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Error loading rooms: {error.message}
        </div>
      </div>
    );

  return (
    <div className="bg-white border border-[#D5D5D5] h-full rounded-md md:w-80 w-full flex flex-col">
      <ChatHeader />

      <div className="divide-y overflow-y-auto flex-grow">
        {rooms && rooms.length > 0 ? (
          rooms.map((room) => (
            <Message
              key={room._id}
              active={room._id === selectedRoomId}
              title={room.name || `Chat ${room._id}`}
              unreadCount={room.unreadCount || 0}
              onClick={() => onRoomSelect(room._id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No rooms available
          </div>
        )}
      </div>
    </div>
  );
}

export default ForumList;
