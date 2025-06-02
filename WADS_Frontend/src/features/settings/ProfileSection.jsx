import { useAuthContext } from "../../contexts/AuthContext";

import { PfpProvider } from "../../contexts/PfpContext";
import ProfileSectionContent from "./ProfileSectionContent";

const ProfileSection = () => {
  const { user } = useAuthContext();

  return (
    <PfpProvider>
      <ProfileSectionContent user={user} />
    </PfpProvider>
  );
};

export default ProfileSection;
