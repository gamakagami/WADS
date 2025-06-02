import ProfileSection from "../features/settings/ProfileSection";
import NotificationSection from "../features/settings/NotificationSection";
import SecuritySection from "../features/settings/SecuritySection";

function Setting() {
  return (
    <div className="h-[500px] flex flex-col gap-y-5">
      <ProfileSection />
      <NotificationSection />
      <SecuritySection />
    </div>
  );
}

export default Setting;
