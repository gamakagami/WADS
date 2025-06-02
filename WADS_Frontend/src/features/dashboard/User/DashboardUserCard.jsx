/* eslint-disable react/prop-types */
import TicketPopup from "../../../tickets/TicketPopup";
import ButtonBlue from "../../../components/app/ButtonBlue";

function DashboardUserCard({
  buttontext,
  description,
  title,
  icon: Icon,
  handleClick,
  showPopup = false,
}) {
  return (
    <div className="w-full h-auto min-h-[250px] py-6 px-4 md:px-8 bg-white shadow-md rounded-sm flex flex-col items-center justify-between">
      {showPopup && <TicketPopup handleCancel={handleClick} />}
      <Icon size={40} className="mt-2" />
      <h1 className="w-full text-center font-bold text-xl text-[#424242] mt-3">
        {title}
      </h1>
      <p className="w-full text-center text-sm text-[#636363] my-3">
        {description}
      </p>
      <ButtonBlue
        Text={buttontext}
        handleClick={handleClick}
        className="mb-2"
      />
    </div>
  );
}

export default DashboardUserCard;
