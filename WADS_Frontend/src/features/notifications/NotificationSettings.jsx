function NotificationSettings() {
  return (
    <div className="col-span-4">
      <div className="bg-white p-5 rounded shadow-sm">
        <h3 className="text-xl text-gray-800 mt-0 mb-5 font-semibold">
          Notification Settings
        </h3>
        {/* Email Notifications */}
        <div className="mt-5">
          <h4 className=" text-gray-800 mb-2 font-semibold">
            Email Notifications
          </h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-700 mr-2"
                defaultChecked
              />
              <span>Ticket Updates</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-700 mr-2"
                defaultChecked
              />
              <span>Status Changes</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-700 mr-2"
                defaultChecked
              />
              <span>Resolution Notifications</span>
            </label>
          </div>
        </div>
        {/* Save Button */}
        <button className="w-full bg-blue-800 text-white py-2 px-4 rounded mt-5 border-none">
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;
