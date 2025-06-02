/* eslint-disable react/prop-types */
function Text({ sender, text, time }) {
  const isCurrentUser = sender.isCurrentUser;

  return (
    <div className="flex flex-col mb-4">
      <div className="text-xs text-gray-500 self-center mb-1">{time}</div>
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {!isCurrentUser && (
          <div className="text-sm font-medium text-gray-700 mb-1">
            {sender.firstName} {sender.lastName}
          </div>
        )}
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isCurrentUser
              ? "bg-[#1D3B5C] text-white rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default Text;
