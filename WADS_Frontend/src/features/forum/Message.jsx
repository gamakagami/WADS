/* eslint-disable react/prop-types */
function Message({ active, unreadCount, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center cursor-pointer border-b border-[#D5D5D5] ${
        active ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#424242]">
            {title === "agents-room" ? "Public Chat" : title}
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
