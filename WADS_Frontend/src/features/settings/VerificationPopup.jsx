import { useState } from 'react';

export default function VerificationPopup({ secretKey, handleCancel, handleVerify, verificationCode, setVerificationCode}){

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <div className="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4 flex flex-col p-4">
            <div className="bg-white text-black py-3 rounded-t-lg mb-4">
                <h2 className="text-xl font-semibold">2FA Verification</h2>
            </div>
            {/* Secret Key Section */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Your Secret Key:</h3>
                    <div className="bg-gray-100 p-3 rounded-sm border">
                        <code className="text-sm font-mono text-gray-800 break-all">{secretKey}</code>
                    </div>
                </div>
                
                {/* Warning Message */}
                <div className="bg-red-50 border border-red-200 p-3 rounded-sm mb-4">
                    <p className="text-red-700 text-sm">
                        <strong>⚠️ Important:</strong> Keep this secret key secure and do not share it with anyone. 
                        Save it in a safe place as you'll need it to set up your authenticator app.
                    </p>
                </div>
                
                {/* Verification Code Input */}
                <div className="mb-4">
                    <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit verification code from your authenticator app:
                    </label>
                    {verificationCode.length > 6 && <p className="text-sm text-red-400 mb-2">Max 6 digits allowed</p>}
                    <input 
                        id="verification-code"
                        type="number" 
                        maxLength="6"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)} 
                        className="w-full text-gray-600 border border-gray-400 py-2 px-4 rounded-sm text-center text-lg font-mono tracking-widest"
                    />
                </div>
            <div className="flex gap-4">
                <button className="flex-grow text-center text-white bg-[#4AC180] p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handleVerify}>Verify</button>
                <button className="flex-grow text-center text-gray-600 border border-gray-300 p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handleCancel}>Cancel</button>
            </div>
            
        </div>
        </div>
    )
}