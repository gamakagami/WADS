import { useState, useEffect } from "react";
import SettingTitle from "./SettingTitle";
import NotificationSubtitle from "./NotificationSubtitle";
import ContentToggle from "./ContentToggle";
import Button from "../../components/app/Button";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "../../api/setting";

const NotificationSection = () => {
  const { user } = useAuthContext();

  // Initialize with default values
  const [preferences, setPreferences] = useState({
    notificationSettings: {
      email: {
        ticketStatusUpdates: true,
        newAgentResponses: true,
        ticketResolution: true,
        marketingUpdates: false
      },
      inApp: {
        desktopNotifications: true,
        soundNotifications: true
      }
    }
  });

  const [serverPreferences, setServerPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
  try {
    const data = await getUserProfile(user?.token);
    console.log("Raw server response:", data);

    if (data.notificationSettings) {
      const normalizedData = {
        notificationSettings: {
          email: {
            ticketStatusUpdates: Boolean(data.notificationSettings.email?.ticketStatusUpdates),
            newAgentResponses: Boolean(data.notificationSettings.email?.newAgentResponses),
            ticketResolution: Boolean(data.notificationSettings.email?.ticketResolution),
            marketingUpdates: Boolean(data.notificationSettings.email?.marketingUpdates)
          },
          inApp: {
            desktopNotifications: Boolean(data.notificationSettings.inApp?.desktopNotifications),
            soundNotifications: Boolean(data.notificationSettings.inApp?.soundNotifications)
          }
        }
      };

      console.log("Normalized data with original values:", normalizedData);

      setPreferences(normalizedData);
      setServerPreferences(JSON.parse(JSON.stringify(normalizedData)));
    } else {
      console.warn("Server response did not contain notificationSettings!");
    }

    setLoading(false);
  } catch (err) {
    console.error("Error fetching preferences:", err);
    setError(err.message);
    setLoading(false);
  }
};


    if (user?.token) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggle = (section, key) => {
    console.log(`Toggling ${section}.${key} from:`, 
      section === 'email' 
        ? preferences.notificationSettings.email[key] 
        : preferences.notificationSettings.inApp[key]
    );
    
    setPreferences((prev) => {
      // Create a deep copy to avoid reference issues
      const updated = JSON.parse(JSON.stringify(prev));
      
      // Update the specific toggle value
      if (section === 'email') {
        updated.notificationSettings.email[key] = !updated.notificationSettings.email[key];
      } else if (section === 'inApp') {
        updated.notificationSettings.inApp[key] = !updated.notificationSettings.inApp[key];
      }
      
      console.log("Updated preferences after toggle:", updated);
      
      // Check for changes by comparing with server preferences
      const hasChanges = JSON.stringify(updated) !== JSON.stringify(serverPreferences);
      setHasChanges(hasChanges);
      
      return updated;
    });
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    console.log("Sending preferences to server:", preferences);

    const data = await updateUserProfile(user?.token, preferences);
    console.log("Save successful, server response:", data);

    setServerPreferences(JSON.parse(JSON.stringify(preferences)));
    setHasChanges(false);
    alert("Notification preferences saved successfully!");
  } catch (err) {
    console.error("Save error:", err);
    alert(`Failed to save preferences: ${err.message}`);
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    console.log("Cancelling changes, reverting to server preferences");
    // Reset to server preferences
    setPreferences(JSON.parse(JSON.stringify(serverPreferences)));
    setHasChanges(false);
  };

  if (loading) return <div className="p-6 text-gray-600">Loading notification preferences...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow w-full">
      <div className="flex justify-between items-center mb-6">
        <SettingTitle title="Notification Settings" />
        {hasChanges && (
          <span className="text-sm text-amber-600">You have unsaved changes</span>
        )}
      </div>

      <div className="mb-6">
        <NotificationSubtitle text="Email Notifications" />
        <div className="space-y-4 mt-4">
          <ContentToggle
            text="Ticket Status Updates"
            desc="Receive updates when ticket status changes"
            checked={preferences.notificationSettings.email.ticketStatusUpdates}
            onChange={() => handleToggle("email", "ticketStatusUpdates")}
          />
          <ContentToggle
            text="New Agent Responses"
            desc="Get notified when agents reply to your tickets"
            checked={preferences.notificationSettings.email.newAgentResponses}
            onChange={() => handleToggle("email", "newAgentResponses")}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <div
          onClick={!saving && hasChanges ? handleCancel : undefined}
          className={`${!hasChanges || saving ? "pointer-events-none opacity-50" : ""}`}
        >
          <Button type="clear">Cancel</Button>
        </div>
        <div
          onClick={!saving && hasChanges ? handleSave : undefined}
          className={`${!hasChanges || saving ? "pointer-events-none opacity-50" : ""}`}
        >
          <Button type="blue">{saving ? "Saving..." : "Save Preferences"}</Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;