import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import PropTypes from "prop-types";
import { FaDownload } from "react-icons/fa6";

function TicketDetails({ data }) {
  return (
    <div className="col-span-2 space-y-5">
      <div className="bg-white p-5 rounded-md shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Ticket Details
        </h3>
        <div className="space-y-1 text-sm">
          <p>
            <strong className="text-base">Category:</strong> {data.category}
          </p>
          <p>
            <strong className="text-base">Department:</strong> {data.department}
          </p>
          <p>
            <strong className="text-base">Equipment:</strong>{" "}
            {data.equipment?.name || "N/A"}
          </p>
          <p>
            <strong className="text-base">Priority:</strong>{" "}
            <span
              className={`font-medium ${
                data.priority === "high"
                  ? "text-red-600"
                  : data.priority === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {capitalizeFirstLetter(data.priority)}
            </span>
          </p>
          <p>
            <strong className="text-base">Description:</strong>{" "}
            {data.description}
          </p>
          <p>
            <strong className="text-base">Assigned To:</strong>{" "}
            {data.assignedTo.firstName} {data.assignedTo.lastName}
          </p>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white p-5 rounded-md shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Attachments
        </h3>
        {data.attachments && data.attachments.length > 0 ? (
          <div className="space-y-2">
            {data.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-[#DDDDDD] rounded-md p-2"
              >
                <div className="flex items-center">
                  <span className="mr-3">📎</span>
                  <span className="text-sm">{attachment.fileName}</span>
                </div>
                <a
                  href={`data:application/octet-stream;base64,${attachment.fileUrl}`}
                  download={attachment.fileName}
                  className="text-sm font-medium"
                >
                  <FaDownload />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No attachments</div>
        )}
      </div>
    </div>
  );
}

TicketDetails.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    equipment: PropTypes.shape({
      name: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string.isRequired,
        fileUrl: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default TicketDetails;
