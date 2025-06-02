/* eslint-disable react/prop-types */
import { parseISO, format} from "date-fns";
import { NavLink } from "react-router-dom";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

const roleColors = {
  admin: "bg-blue-100 text-blue-600",
  agent: "bg-green-100 text-green-600",
  user: "bg-gray-100 text-gray-600",
};

function User({ user }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.firstName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <span
          className={`px-2 w-16 flex justify-center items-center text-xs leading-5 font-semibold rounded-full ${
            roleColors[user.role]
          }`}
        >
          {capitalizeFirstLetter(user.role)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {format(parseISO(user.createdAt), "yyyy-MM-dd")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.department ? user.department : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <NavLink
          to={`/users/${user._id}`}
          className="bg-[#4A81C0] hover:cursor-pointer text-white px-3 py-1 rounded-md font-medium text-xs"
        >
          Details
        </NavLink>
      </td>
    </tr>
  );
}

export default User;
