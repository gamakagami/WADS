import { TbLogin2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="bg-[#155095] p-4">
      <div className="flex justify-between items-center w-11/12 h-full mx-auto">
        <div className="flex">
          <p className="text-white font-bold text-xl ">
            Semesta Medika Support
          </p>
        </div>
        <div className="flex gap-8 items-center font-semibold ">
          <NavLink to="/login" className="flex items-center gap-x-1 text-white">
            <TbLogin2 size={20} />
            <span className="text-sm ">
              Login
            </span>
          </NavLink>

          <NavLink to="/signup" className="bg-white text-[#0A3E7A] px-4 py-2 rounded-full text-sm  ">
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
