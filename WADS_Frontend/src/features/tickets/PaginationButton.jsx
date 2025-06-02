/* eslint-disable react/prop-types */
function PaginationButton({ value, currentPage, setCurrentPage }) {
  return (
    <button
      className={`px-3 py-1 border border-gray-300 ${
        value === currentPage
          ? "bg-[#4A81C0] text-white"
          : "bg-white text-black"
      } hover:cursor-pointer text-sm font-medium rounded-md `}
      onClick={() => setCurrentPage(value)}
    >
      {value}
    </button>
  );
}

export default PaginationButton;
