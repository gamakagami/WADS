/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

function StyledLink({ location, children, icon: Icon }) {
  return (
    <NavLink
      to={location}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#2A517B] transition ${
          isActive ? "bg-[#2A517B]" : ""
        }`
      }
    >
      <Icon size={20}/>
      {children}
    </NavLink>
  );
}

export default StyledLink;
