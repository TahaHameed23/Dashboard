
const Settings = () => {
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                Receive email notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyReport"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="weeklyReport" className="ml-2 block text-sm text-gray-900">
                Weekly analytics report
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-red-600 mb-6">Danger Zone</h2>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings