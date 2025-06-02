/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { parseISO, format, formatDistanceToNow } from "date-fns";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-600",
  resolved: "bg-green-100 text-green-600",
  in_progress: "bg-blue-100 text-blue-600",
};

function Ticket({ ticket }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {ticket.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 w-16 flex justify-center items-center inline-flex text-xs leading-5 font-semibold rounded-full ${
            statusColors[ticket.status]
          }`}
        >
          {capitalizeFirstLetter(ticket.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {format(parseISO(ticket.createdAt), "yyyy-MM-dd")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {capitalizeFirstLetter(formatDistanceToNow(ticket.updatedAt))} ago
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <NavLink
          to={`/tickets/${ticket._id}`}
          className="bg-[#4A81C0] hover:cursor-pointer text-white px-3 py-1 rounded-md font-medium text-xs"
        >
          View
        </NavLink>
      </td>
    </tr>
  );
}

export default Ticket;
