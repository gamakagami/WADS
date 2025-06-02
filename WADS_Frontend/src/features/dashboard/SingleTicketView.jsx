import { parseISO, format, formatDistanceToNow } from "date-fns";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import PropTypes from "prop-types";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-600",
  resolved: "bg-green-100 text-green-600",
  in_progress: "bg-blue-100 text-blue-600",
};

function SingleTicketView({ ticket }) {
  return (
    <div className="h-72 w-full p-4 overflow-y-auto">
      <div className="w-full h-full flex-grow overflow-auto bg-white">
        <table className="min-w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2 font-medium text-gray-700">
                Assigned To
              </th>
              <th className="px-4 py-2 font-medium text-gray-700">Category</th>
              <th className="px-4 py-2 font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 font-medium text-gray-700">
                Date Created
              </th>
              <th className="px-4 py-2 font-medium text-gray-700">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">
                {ticket.assignedTo.firstName} {ticket.assignedTo.lastName[0]}.
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {ticket.category}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[ticket.status.toLowerCase()]
                  }`}
                >
                  {capitalizeFirstLetter(ticket.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {format(parseISO(ticket.createdAt), "yyyy-MM-dd")}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {capitalizeFirstLetter(formatDistanceToNow(ticket.updatedAt))}{" "}
                ago
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

SingleTicketView.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default SingleTicketView;
