import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter"

/* eslint-disable react/prop-types */
function Summary({ data }) {
  if (data === undefined) return <p>Loading</p>;
  return (
    <div className="text-sm text-gray-700">
      Showing {data.data.length} of {data.totalTickets || data.totalUsers} {capitalizeFirstLetter(data.type)}
    </div>
  );
}

export default Summary;
