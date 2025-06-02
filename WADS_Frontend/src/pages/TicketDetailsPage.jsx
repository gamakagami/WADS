import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TicketDetails from "../features/tickets/TicketDetails";
import getIndividualTicketsQueryOptions from "../queryoptions/getIndividualTicketsQuery";
import { useAuthContext } from "../contexts/AuthContext";
import CommunicationLog from "../features/tickets/CommunicationLog";
import DetailHeader from "../features/tickets/DetailHeader";

function TicketDetailsPage() {
  const ticketID = useParams();
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery(
    getIndividualTicketsQueryOptions(user.accessToken, ticketID.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">
          Error loading ticket: {error.message}
        </p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">No ticket data found</p>
      </div>
    );
  }

  const ticketData = data.data;

  return (
    <>
      <div className="flex flex-grow">
        <div className="flex-grow ">
          <DetailHeader ticketData={ticketData} />

          <div className="grid grid-cols-7 gap-5">
            <CommunicationLog
              ticketId={ticketData._id}
              messages={ticketData.messages || []}
              currentStatus={ticketData.status}
            />
            <TicketDetails data={ticketData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketDetailsPage;
