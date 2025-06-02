import TicketFilters from "../features/tickets/TicketFilters";
import TicketsTable from "../features/tickets/TicketsTable";
import TicketPagination from "../features/tickets/TicketPagination";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import getTicketsQueryOptions from "../queryoptions/getTicketsQuery";
import { useState } from "react";

export default function Tickets() {
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuthContext();
  const { data, isLoading } = useQuery(
    getTicketsQueryOptions(user.accessToken, currentPage)
  );

  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(null);

  function handleApplyFilter() {
    const filtered = data.data.filter((ticket) => {
      if (filter === "all") return true;
      else return ticket.status === filter;
    });

    if (keyword) {
      const filteredWithKeyword = filtered.filter((ticket) => {
        return (
          ticket.title.toLowerCase().includes(keyword.toLowerCase()) ||
          ticket.description.toLowerCase().includes(keyword.toLowerCase()) ||
          ticket.category.toLowerCase().includes(keyword.toLowerCase()) ||
          ticket.department.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setFilteredTickets(filteredWithKeyword);
    } else {
      setFilteredTickets(filtered);
    }
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <TicketFilters
        setFilter={setFilter}
        keyword={keyword}
        setKeyword={setKeyword}
        applyFilter={handleApplyFilter}
      />
      <TicketsTable data={filteredTickets ? filteredTickets : data.data} />
      <TicketPagination
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
