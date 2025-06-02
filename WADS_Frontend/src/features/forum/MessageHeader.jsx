/* eslint-disable react/prop-types */
function MessageHeader({ agentName, onBackClick }) {
  return (
    <div className="p-4 h-20 bg-[#F5F5F5] border-b border-[#D5D5D5] flex justify-between items-center rounded-t-md">
      <div className="flex items-center">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="md:hidden mr-2 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <span className="font-semibold text-[#636363]">{agentName}</span>
      </div>
    </div>
  );
}

export default MessageHeader;
