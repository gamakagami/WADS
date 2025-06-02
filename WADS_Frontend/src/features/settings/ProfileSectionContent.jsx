import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "../../api/setting";
import { usePfpContext } from "../../contexts/PfpContext";
import ProfilePicture from "./ProfilePicture";
import Button from "../../components/app/Button";
import Input from "./Input";
function ProfileSectionContent() {
  const { user } = useAuthContext();
  const { updatePfp } = usePfpContext();

  const [serverData, setServerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "-",
    timeZone: "-",
    profilePicture: "",
  });

  const [formData, setFormData] = useState({ ...serverData });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field) => (value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(newData) !== JSON.stringify(serverData));
      return newData;
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(user?.accessToken);
        const normalizedData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          department: data.department || "-",
          timeZone: data.timeZone || data.timezone || "-",
          profilePicture: data.profilePicture || "",
        };
        setServerData(normalizedData);
        setFormData(normalizedData);
        updatePfp(normalizedData.profilePicture);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, updatePfp]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile(user?.accessToken, formData);
      setServerData({ ...formData });
      setHasChanges(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...serverData });
    setHasChanges(false);
  };

  if (loading)
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">Error loading profile: {error}</div>
    );

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
          Profile Settings
        </h1>
        {hasChanges && (
          <span className="text-sm text-amber-600">
            You have unsaved changes
          </span>
        )}
      </div>

      <div className="mb-8">
        <ProfilePicture user={user} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input value={formData.firstName} onChange={handleChange("firstName")}>
          First name
        </Input>
        <Input value={formData.lastName} onChange={handleChange("lastName")}>
          Last name
        </Input>
      </div>

      <div className="mb-6">
        <Input value={formData.email} readOnly disabled>
          Email
        </Input>
        <p className="text-sm text-gray-500 mt-1">
          This email will be used for notifications
        </p>
      </div>

      <div className="mb-6">
        <Input
          value={formData.phoneNumber}
          onChange={handleChange("phoneNumber")}
        >
          Phone Number
        </Input>
      </div>

      <div className="mb-6">
        <Input
          type="dropdown"
          value={formData.department}
          options={[
            { value: "-", label: "Select Department" },
            { value: "us", label: "US" },
            { value: "ca", label: "Canada" },
            { value: "uk", label: "UK" },
          ]}
          onChange={handleChange("department")}
        >
          Department
        </Input>
      </div>

      <div className="mb-6">
        <Input
          type="dropdown"
          value={formData.timeZone}
          options={[
            { value: "-", label: "Select Time Zone" },
            { value: "1", label: "UTC-8 (Pacific)" },
            { value: "2", label: "UTC-5 (Eastern)" },
            { value: "3", label: "UTC+0 (London)" },
          ]}
          onChange={handleChange("timeZone")}
        >
          Time zone
        </Input>
      </div>

      <div className="flex justify-end space-x-4 w-full mt-6">
        <div
          onClick={!saving && hasChanges ? handleCancel : undefined}
          className={`${
            !hasChanges || saving ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <Button type="clear">Cancel</Button>
        </div>
        <div
          onClick={!saving && hasChanges ? handleSave : undefined}
          className={`${
            !hasChanges || saving ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <Button type="blue-s">{saving ? "Saving..." : "Save changes"}</Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSectionContent;
