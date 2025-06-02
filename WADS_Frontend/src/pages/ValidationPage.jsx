import { useAuthContext } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ValidationPage() {
    const navigate = useNavigate();
    const { tempUid, validate, validateLoading, validateError } = useAuthContext();
    const [verificationCode, setVerificationCode] = useState("");

    // Redirect to login if no tempUid (user didn't come from login)
    useEffect(() => {
        console.log("tempUid:", tempUid);
        if (!tempUid) {
            navigate("/login");
        }
    }, [tempUid, navigate]);

    // Handle validation errors
    useEffect(() => {
        if (validateError) {
            toast.error(validateError.message || "Validation failed. Please try again.");
        }
    }, [validateError]);

    function handleSubmit(e) {
        e.preventDefault();
        
        if (verificationCode.length !== 6) {
            toast.error("Please enter a 6-digit verification code");
            return;
        }

        const validationData = {
            "userId": tempUid,
            "token": verificationCode
        };

        validate(validationData);
    }

    function handleCodeChange(e) {
        const value = e.target.value;
        // Only allow numbers and limit to 6 digits
        if (/^\d*$/.test(value) && value.length <= 6) {
            setVerificationCode(value);
        }
    }

    if (!tempUid) {
        useEffect(() => navigate("/login"), []);
        return null;
    }
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Two-Factor Authentication</h1>
                <p className="text-sm text-gray-600 text-center mb-4">
                    Please enter the 6-digit code from your authenticator app
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input 
                            id="verification-code"
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            value={verificationCode}
                            onChange={handleCodeChange}
                            className="w-full text-gray-600 border border-gray-400 py-2 px-4 rounded-sm text-center text-lg font-mono tracking-widest"
                            disabled={validateLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={validateLoading || verificationCode.length !== 6}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {validateLoading ? "Validating..." : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    );
}