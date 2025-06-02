/* eslint-disable react/prop-types */
function ReplyBox() {
  return (
    <div className="border-t pt-4 border-[#DDDDDD]">
      <textarea
        className="w-full p-3 border border-[#DDDDDD] rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your reply..."
      />
      <div className="flex justify-between mt-3">
        <button className="bg-gray-100 border border-[#DDDDDD] px-4 py-2 rounded-md hover:bg-gray-200">
          Attach Files
        </button>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md disabled:opacity-50">
          Send Reply
        </button>
      </div>
    </div>
  );
}

export default ReplyBox;
