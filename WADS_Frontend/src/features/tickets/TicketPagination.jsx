/* eslint-disable react/prop-types */
import PaginationButton from "./PaginationButton";
import ArrowButton from "./ArrowButton";
import Summary from "./Summary";

export default function TicketPagination({
  currentPage,
  setCurrentPage,
  data,
}) {

  const pageNumbers = [...Array(data.totalPages).keys()].map(i => i + 1)

  return (
    <div className="flex rounded-md shadow-sm items-center justify-between p-6 bg-white border border-gray-300">
      <Summary data={data} />
      <div className="flex gap-3">
        <ArrowButton
          type="left"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={data}
        />
        {pageNumbers.map((page) => 
          <PaginationButton
            value={page}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <ArrowButton
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={data}
        />
      </div>
    </div>
  );
}
