import { useState } from "react";
import { usePfpContext } from "../../contexts/PfpContext";
import { uploadPfp } from "../../api/setting";
import ProfileImage from "./ProfileImage";
import FileUploadButton from "./FileUploadButton";

const ProfilePicture = ({ user }) => {
  const [uploading, setUploading] = useState(false);
  const { profilePicture, updatePfp } = usePfpContext();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
      if (file) {
    // ✅ Limit file size to 3MB
    const maxSizeInMB = 3;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`);
      return;
    }}

    try {
      setUploading(true);
      const response = await uploadPfp(user.accessToken, file);
      updatePfp(response.profilePicture);  // ✅ Update PfpContext with new URL
      alert("Profile picture updated!");
    } catch (err) {
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ProfileImage src={profilePicture || user?.profilePicture} />
      <div className="flex flex-col">
        <div className="mb-4">
          <FileUploadButton
            type="clear"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            maxSize="3MB"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </FileUploadButton>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
