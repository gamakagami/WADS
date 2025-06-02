import SettingDesc from "./SettingDesc";
import Label from "./Label";
import { PasswordModal } from "./PasswordModal";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

// Password strength calculation function
export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'weak', width: '0%', color: 'bg-red-500' };
  
  // Simple password strength algorithm
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
  
  // Calculate final score (0-5)
  const normalizedScore = Math.min(5, score);
  
  // Map score to label and width
  const strengthMap = {
    0: { label: 'weak', color: 'bg-red-500', width: '20%' },
    1: { label: 'weak', color: 'bg-red-400', width: '20%' },
    2: { label: 'medium', color: 'bg-yellow-500', width: '40%' },
    3: { label: 'medium', color: 'bg-yellow-400', width: '60%' },
    4: { label: 'strong', color: 'bg-green-400', width: '80%' },
    5: { label: 'strong', color: 'bg-green-500', width: '100%' }
  };
  
  return { 
    score: normalizedScore, 
    ...strengthMap[normalizedScore]
  };
};

const PasswordStrength = ({ lastChanged }) => {
  const { user } = useAuthContext();
  const [isModalOpen, setModalOpen] = useState(false);

  if (!user) return null;

  const timeAgo = lastChanged
    ? formatDistanceToNow(new Date(lastChanged), { addSuffix: true })
    : "Unknown";

  // Get stored password strength from user's security settings
  const storedPasswordStrength = user.securitySettings?.passwordStrength || 'medium';
  
  // Convert stored strength to display format
  const getStrengthDisplay = (strengthLabel) => {
    const strengthMap = {
      'weak': { color: 'bg-red-500', width: '20%', description: 'weak' },
      'medium': { color: 'bg-yellow-500', width: '60%', description: 'good' },
      'strong': { color: 'bg-green-500', width: '100%', description: 'strong' }
    };
    return strengthMap[strengthLabel] || strengthMap['medium'];
  };

  const currentStrength = getStrengthDisplay(storedPasswordStrength);

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex justify-between items-center mb-1">
        <Label children="Password" />
        <button
          onClick={() => setModalOpen(true)}
          className="text-[#0A3E74] hover:text-[#1F61AF] font-medium"
        >
          Change
        </button>
      </div>

      <div className="mb-4">
        <SettingDesc desc={`Last changed ${timeAgo}`} />
      </div>

      <div className="relative h-2 w-full bg-gray-300 rounded-full mb-2">
        <div 
          className={`absolute top-0 left-0 h-2 ${currentStrength.color} rounded-full transition-all duration-300`}
          style={{ width: currentStrength.width }}
        ></div>
      </div>

      <SettingDesc desc={`Your password strength is ${currentStrength.description}`} />

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userId={user._id}
        token={user.accessToken}
      />
    </div>
  );
};

export default PasswordStrength;