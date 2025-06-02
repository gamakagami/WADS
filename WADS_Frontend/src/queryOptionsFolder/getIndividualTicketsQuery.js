import { queryOptions } from "@tanstack/react-query";
import { getTicketsByID } from "../api/ticket";

function getIndividualTicketsQueryOptions(token, ID) {
  return queryOptions({
    queryKey: ["tickets", ID],
    queryFn: () => getTicketsByID(token, ID),
  });
}

export default getIndividualTicketsQueryOptions;
