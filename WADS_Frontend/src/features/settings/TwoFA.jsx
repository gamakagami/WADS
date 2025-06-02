// TwoFA.jsx
import ContentToggle from "./ContentToggle";
import Button from "../../components/app/Button";
import VerificationPopup from "./VerificationPopup";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "../../api/setting";
import {
  useEnable2FA,
  useVerify2FA,
  useDisable2FA,
} from "../../queryOptionsFolder/twoFAQuery";

const TwoFA = () => {
  const { user } = useAuthContext();

  // Initialize with default values
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: { enabled: false, method: "authenticator" },
  });
  const [serverSettings, setServerSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 2FA useStates
  const [verifyShow, setVerifyShow] = useState(false);
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // 2FA UseMutation
  const { mutate: enable2FA, isLoading: updatingEnable } = useEnable2FA(
    user.accessToken
  );
  const { mutate: disable2FA, isLoading: updatingDisable } = useDisable2FA(
    user.accessToken
  );
  const { mutate: verify2FA, isLoading: updatingVerify } = useVerify2FA(
    user.accessToken
  );

  // Fetching security settings
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const data = await getUserProfile(user?.accessToken);
        console.log("Raw security settings response:", data);

        if (data.securitySettings?.twoFactorEnabled !== undefined) {
          const normalizedData = {
            twoFactorAuth: {
              enabled: Boolean(data.securitySettings.twoFactorEnabled),
              method: data.securitySettings.twoFactorMethod || "authenticator",
            },
          };

          console.log("Normalized 2FA settings:", normalizedData);

          setSecuritySettings(normalizedData);
          setServerSettings(JSON.parse(JSON.stringify(normalizedData)));
        } else {
          console.warn(
            "Server response did not contain twoFactorAuth settings!"
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching security settings:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchSecuritySettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggle = () => {
    console.log(`Toggling 2FA from:`, securitySettings.twoFactorAuth.enabled);

    setSecuritySettings((prev) => {
      // Create a deep copy to avoid reference issues
      const updated = JSON.parse(JSON.stringify(prev));

      // Toggle the 2FA enabled state
      updated.twoFactorAuth.enabled = !updated.twoFactorAuth.enabled;

      console.log("Updated security settings after toggle:", updated);

      // Check for changes by comparing with server settings
      const hasChanges =
        JSON.stringify(updated) !== JSON.stringify(serverSettings);
      setHasChanges(hasChanges);

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Sending security settings to server:", securitySettings);

      // Make sure we're sending the method value even when 2FA is disabled
      // This ensures the method is always updated in the database

      if (securitySettings.twoFactorAuth.enabled) {
        enable2FA(
          {},
          {
            onSuccess: (data) => {
              setSecret(data.secret);
              toast.success("2FA is Enabled!", {
                duration: 4000,
                position: "top-right",
                style: {
                  background: "#4CAF50",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
              toast.error(error || "Failed to Enable 2FA!", {
                duration: 4000,
                position: "top-right",
                style: {
                  background: "#F44336",
                  color: "#fff",
                },
              });
            },
          }
        );
        setVerifyShow(true);
      } else {
        disable2FA(
          {},
          {
            onSuccess: () => {
              setServerSettings(JSON.parse(JSON.stringify(securitySettings)));
              setSecret("");
              setVerifyShow(false);
              toast.success("Successfully Disabled 2FA!", {
                duration: 4000,
                position: "top-right",
                style: {
                  background: "#4CAF50",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
              toast.error("Failed to Cancel Operation!", {
                duration: 4000,
                position: "top-right",
                style: {
                  background: "#F44336",
                  color: "#fff",
                },
              });
            },
          }
        );
      }
      setHasChanges(false);

      // toast here
    } catch (err) {
      console.error("Save error:", err);
      // toast here
    } finally {
      setSaving(false);
    }
  };

  function handleVerify() {
    verify2FA(
      {
        token: verificationCode,
      },
      {
        onSuccess: (data) => {
          setSecret("");
          setVerificationCode("");
          setServerSettings(JSON.parse(JSON.stringify(securitySettings)));
          setVerifyShow(false);
          toast.success("2FA is Verified!", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          });
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to verify 2FA";

          toast.error(message, {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#F44336",
              color: "#fff",
            },
          });
        },
      }
    );
  }

  function handleCancelPopup() {
    disable2FA(
      {},
      {
        onSuccess: () => {
          setSecret("");
          setVerificationCode("");
          securitySettings.twoFactorAuth.enabled = false;
          setVerifyShow(false);
          toast.success("Successfully Cancelled Operation!", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          });
        },
        onError: (error) => {
          toast.error("Failed to Cancel Operation!", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#F44336",
              color: "#fff",
            },
          });
        },
      }
    );
  }

  const handleCancel = () => {
    console.log("Cancelling changes, reverting to server settings");
    // Reset to server settings
    setSecuritySettings(JSON.parse(JSON.stringify(serverSettings)));
    setHasChanges(false);
  };

  if (loading)
    return (
      <div className="p-6 text-gray-600">Loading security settings...</div>
    );
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <>
      {verifyShow && (
        <VerificationPopup
          secretKey={secret}
          handleCancel={handleCancelPopup}
          handleVerify={handleVerify}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
        />
      )}
      <div>
        <ContentToggle
          text="Two-Factor Authentication"
          desc="Add an extra layer of security to your account"
          checked={securitySettings.twoFactorAuth.enabled}
          onChange={handleToggle}
        />

        {securitySettings.twoFactorAuth.enabled && <></>}

        {hasChanges && (
          <div className="flex justify-end space-x-4 mt-6">
            <div
              onClick={!saving ? handleCancel : undefined}
              className={`${saving ? "pointer-events-none opacity-50" : ""}`}
            >
              <Button type="clear">Cancel</Button>
            </div>
            <div
              onClick={!saving ? handleSave : undefined}
              className={`${saving ? "pointer-events-none opacity-50" : ""}`}
            >
              <Button type="blue">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TwoFA;
