/* eslint-disable react/prop-types */
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

function ArrowButton({ type = "right", setCurrentPage, currentPage, data }) {
  function handleClick() {
    if (type === "right" && currentPage < data.totalPages) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
    if (type === "left" && currentPage > 1) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  }
  return (
    <button
      className="px-3 py-1 border border-gray-300 bg-white hover:bg-neutral-200 hover:cursor-pointer text-sm font-medium rounded-md text-gray-700"
      onClick={handleClick}
    >
      {type === "left" ? (
        <MdNavigateBefore size={25} />
      ) : (
        <MdNavigateNext size={25} />
      )}
    </button>
  );
}

export default ArrowButton;
