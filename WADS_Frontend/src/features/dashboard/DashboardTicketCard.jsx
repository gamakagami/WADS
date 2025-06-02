/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import CardTitle from "./CardTitle";
import DashboardTicketContent from "./DashboardTicketContent";
import EmptyPlaceholder from "../tickets/EmptyPlaceholder";

function DashboardTicketCard({ data }) {
  return (
    <div className="bg-white w-full rounded-sm shadow-md border border-neutral-200">
      <CardTitle title="Recent Tickets">
        <NavLink className="text-[#3278C9]" to="/tickets">
          View All
        </NavLink>
      </CardTitle>
      {data.recentTickets.length > 0 ? (
        <DashboardTicketContent data={data} />
      ) : (
        <div className="w-full flex justify-center mt-4">
          <EmptyPlaceholder />
        </div>
      )}
    </div>
  );
}

export default DashboardTicketCard;
