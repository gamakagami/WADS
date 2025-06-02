import { useState } from "react";
import ForumList from "../features/forum/ForumList";
import ForumMessages from "../features/forum/ForumMessages";

function ForumPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showMobileList, setShowMobileList] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-full space-x-0 md:space-x-4">
      <div className="md:hidden flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setShowMobileList(true)}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              showMobileList
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setShowMobileList(false)}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              !showMobileList
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Messages
          </button>
        </div>
      </div>

      <div
        className={`${
          showMobileList ? "block" : "hidden"
        } md:block mb-4 md:mb-0`}
      >
        <ForumList
          onRoomSelect={(roomId) => {
            setSelectedRoomId(roomId);
            setShowMobileList(false);
          }}
          selectedRoomId={selectedRoomId}
        />
      </div>

      <div
        className={`${!showMobileList ? "block" : "hidden"} md:block flex-1`}
      >
        <ForumMessages
          selectedRoomId={selectedRoomId}
          onBackClick={() => setShowMobileList(true)} // For mobile back button
        />
      </div>
    </div>
  );
}

export default ForumPage;
