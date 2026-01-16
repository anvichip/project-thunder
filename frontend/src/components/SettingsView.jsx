const SettingsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">⚙️</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
    </div>

    <div className="space-y-6 mt-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Settings</h3>
        <p className="text-gray-600 text-sm">Update your account information and preferences</p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Settings</h3>
        <p className="text-gray-600 text-sm">Control who can see your profile and data</p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
        <p className="text-gray-600 text-sm">Manage your email and push notifications</p>
      </div>
    </div>
  </div>
);

export default SettingsView;