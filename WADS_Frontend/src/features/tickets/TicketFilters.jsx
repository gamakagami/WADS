/* eslint-disable react/prop-types */
export default function TicketFilters({
  setFilter,
  keyword,
  setKeyword,
  applyFilter,
}) {
  return (
    <div className="flex w-full gap-4 bg-white p-5 rounded-md shadow-md border border-gray-300">
      <div>
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A81C0] font-['Poppins'] hover:cursor-pointer"
        >
          <option value="all">All Tickets</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="relative flex-grow">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full h-10 py-2 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A81C0] font-['Poppins']"
          placeholder="Search Tickets"
        />
      </div>

      <button
        type="button"
        className="h-10 px-4 py-2 text-sm text-white bg-[#4A81C0] rounded-md hover:bg-[#3a6da3] focus:outline-none font-['Poppins'] hover:cursor-pointer"
        onClick={applyFilter}
      >
        Apply Filter
      </button>
    </div>
  );
}
