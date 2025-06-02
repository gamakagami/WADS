import { useState, useEffect } from "react";
import SettingTitle from "./SettingTitle";
import PasswordStrength from "./PasswordStrength";
import TwoFA from "./TwoFA"; // Central logic here
import Button from "../../components/app/Button";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "../../api/setting";

const SecuritySection = () => {
  const { user } = useAuthContext();
  const [passwordLastChanged, setPasswordLastChanged] = useState(null);

  const [securitySettings, setSecuritySettings] = useState({
    loginAlerts: true,
    deviceTracking: true,
  });

  const [serverSettings, setServerSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        const data = await getUserProfile(user?.accessToken);
        setPasswordLastChanged(data.securitySettings?.lastPasswordChange);

        const serverData = {
          loginAlerts: Boolean(data.securitySettings?.loginAlerts),
          deviceTracking: Boolean(data.securitySettings?.deviceTracking),
          lastPasswordChange: data.securitySettings?.lastPasswordChange,
        };


        setSecuritySettings(serverData);
        setServerSettings(JSON.parse(JSON.stringify(serverData)));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.accessToken) fetchSecurity();
    else setLoading(false);
  }, [user]);

  const handleToggle = (key) => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const newHasChanges = JSON.stringify(updated) !== JSON.stringify(serverSettings);
      setHasChanges(newHasChanges);
      return updated;
    });
  };

  if (loading) return <div className="p-6 text-gray-600">Loading security settings...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <SettingTitle title="Security Settings" />
        {hasChanges && <span className="text-sm text-amber-600">You have unsaved changes</span>}
      </div>

      <div className="space-y-6">
        <PasswordStrength lastChanged={passwordLastChanged} />

        {/* TwoFA now manages its own state */}
        <div className="py-4 border-b border-gray-200">
          <TwoFA />
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;