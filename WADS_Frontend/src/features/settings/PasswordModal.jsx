import { useState, useEffect } from 'react';
import { updateUserProfile } from '../../api/setting';
import { calculatePasswordStrength } from './PasswordStrength';

export const PasswordModal = ({ isOpen, onClose, userId, token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'weak' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset form when modal is opened
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Update password strength when password changes
  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
    setPasswordStrength(calculatePasswordStrength(newValue));
  };

  const handleSave = async () => {
    setError(null);
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // Only allow medium or strong passwords
    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setIsSubmitting(true);
    
    try {

      await updateUserProfile(token, {
        currentPassword: currentPassword,
        password: newPassword,
        securitySettings: {
          passwordStrength: passwordStrength.label
        }
      });

      alert("Password updated successfully.");
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>

          <div className="password-strength mb-6">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-2 ${passwordStrength.color} rounded-full transition-all duration-300`} 
                style={{ width: passwordStrength.width }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Password strength: <span className="font-medium">{passwordStrength.label}</span>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? "Processing..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};