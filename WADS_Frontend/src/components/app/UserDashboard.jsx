import DashboardTicketCard from "../../features/dashboard/DashboardTicketCard";
import DashboardUserCard from "../../features/dashboard/User/DashboardUserCard";
import { getUserRecentOptions } from "../../queryOptionsFolders/getRecentTicketQuery";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { CiCirclePlus } from "react-icons/ci";
import { PiBookOpenText } from "react-icons/pi";
import { MdOutlinePhoneEnabled } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  // Ticket Popup
  const [showPopup, setShowPopup] = useState(false);
  function handlePopup() {
    setShowPopup((showPopup) => !showPopup);
  }

  // Recent ticket data
  const { user } = useAuthContext();
  const { data, isLoading } = useQuery(getUserRecentOptions(user.accessToken));

  // Wait for data to finish loading
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="w-full">
        <DashboardTicketCard data={data} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <DashboardUserCard
          buttontext="Create Ticket"
          title="Create New Ticket"
          description="Report a new equipment issue or support request"
          icon={CiCirclePlus}
          showPopup={showPopup}
          handleClick={handlePopup}
        />
        <DashboardUserCard
          buttontext="Go To Chat"
          title="Support Chat"
          description="Ask our chatbot questions"
          icon={MdOutlinePhoneEnabled}
          handleClick={() => navigate("/chatbot")}
        />
        <DashboardUserCard
          buttontext="View"
          title="Ticket History"
          description="View your ticket history"
          icon={PiBookOpenText}
          handleClick={() => navigate("/tickets")}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
