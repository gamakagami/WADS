/* eslint-disable react/prop-types */
import EmptyPlaceholder from "../tickets/EmptyPlaceholder";
import TableLabel from "../tickets/TableLabel"
import User from "./User";

export default function UserTable({ data }) {
  return (
    <div className="w-full flex-grow rounded-md shadow-sm overflow-auto bg-white border border-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white border-b border-gray-300">
          <tr>
            <TableLabel text="First Name" />
            <TableLabel text="Last Name" />
            <TableLabel text="Email" />
            <TableLabel text="Role" />
            <TableLabel text="Joined Date" />
            <TableLabel text="Department" />
            <TableLabel text="Action" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length !== 0 ? (
            data.map((user, index) => <User key={index} user={user} />)
          ) : (
            <EmptyPlaceholder />
          )}
        </tbody>
      </table>
    </div>
  );
}