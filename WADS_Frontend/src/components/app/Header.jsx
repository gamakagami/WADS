import PageTitle from "./PageTitle";
import ProfileButton from "./ProfileButton";
import UserName from "./UserName";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

function Header({ openSidebar }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  let pageName = decodeURIComponent(pathSegments[1] || "");
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={openSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <PageTitle title={pageName} />
        <div className="flex justify-center items-center gap-x-4 select-none">
          <UserName user={user} />
          <ProfileButton user={user} />
        </div>
      </div>
    </header>
  );
}

export default Header;
