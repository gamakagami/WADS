import { queryOptions } from "@tanstack/react-query";
import { getTickets } from "../api/ticket";

function getTicketsQueryOptions(token, currentPage) {
  return queryOptions({
    queryKey: ["tickets", currentPage],
    queryFn: () => getTickets(token, currentPage),
  });
}

export default getTicketsQueryOptions;
