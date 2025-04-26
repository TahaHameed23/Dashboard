import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { account } from "../../../services/appwrite.config";
import { get, post } from "../../../lib/fetch";
import { RiFileCopyLine } from "@remixicon/react";
import toast, { Toaster } from "react-hot-toast";
import { useApiKeys } from "../context/DashboardContext"; // <-- Import from DashboardContext

export default function Account() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const { apiKeys, setApiKeys } = useApiKeys(); // <-- Use global context

  const [billing] = useState({
    plan: "Pro",
    cost: "$0/month",
    nextBilling: "2025-04-20",
    status: "Active",
  });

  const getApiKey = async () => {
    if (apiKeys.length > 0) {
      return; // Avoid fetching if API keys are already cached
    }
    try {
      const response = await get("/auth/key/get", { client_id: user.$id });
      const apiKeysArray = Array.isArray(response.data) ? response.data : [response.data];
      setApiKeys(apiKeysArray);
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    }
  };

  const generateApiKey = async () => {
    try {
      // Pass the first API key if available, otherwise undefined
      const response = await post("/client/key/create", {}, {}, apiKeys[0]?.key);
      setApiKeys((prev) => [...prev, response.data]);
      toast.success("API key generated successfully!");
    } catch (error) {
      console.error("Failed to generate API key:", error);
      toast.error("Failed to generate API key.");
    }
  };

  const copyKeytoClipboard = (key) => {
    navigator.clipboard.writeText(key).then(() => {
      toast.success("Copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy.");
    });
  };

  useEffect(() => {
    if (activeTab === "api") {
      getApiKey();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      await account.updateEmail(email, user.password);
      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Email update failed:", error);
      toast.error("Email update failed.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await account.updatePassword(newPassword, currentPassword);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error("Password update failed.");
    }
  };

  // Fix the snippet to use the first API key if available
  const getSnippetApiKey = () => {
    return apiKeys.length > 0 ? apiKeys[0].key : "YOUR_API_KEY";
  };

  const dfSnippet = `(()=>{"use strict";var a="analytics",t=window[a]=window[a]||[];t.load=function(a){var t="http://localhost:3000/analytics/v1/"+a+"/analytics.min.js",n=document.createElement("script");n.type="text/javascript",n.async=!0,n.setAttribute("data-global-df-analytics-key",a),n.src=t,n.onload=()=>{window._analytics?window.analytics=_analytics.init({plugins:[analyticsEventPlugin(a)]}):console.error("Analytics script failed to load."),analytics.page()};var i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(n,i)},t.SNIPPET_VERSION="1.0.0",t._key="${getSnippetApiKey()}",
  t.load("${getSnippetApiKey()}")})();`;

  return (
    <div className="p-6 w-full max-w-full overflow-x-hidden">
      <Toaster />
      <h3 className="text-2xl font-bold text-gray-900">Account</h3>
      <p className="mt-2 text-base leading-6 text-gray-600">
        Manage your personal details, workspace governance, and notifications.
      </p>

      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 border-b-2 transition-colors ${
                activeTab === "account"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 border-b-2 transition-colors ${
                activeTab === "api"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 border-b-2 transition-colors ${
                activeTab === "billing"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              Billing
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "account" && (
            <div className="space-y-8">
              <form onSubmit={handleEmailUpdate}>
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="mt-1 text-base text-gray-600">
                  Update your email address associated with this workspace.
                </p>
                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-base font-medium text-gray-900"
                  >
                    Update email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    disabled
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="mt-2 w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled
                  className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  Update email
                </button>
              </form>
              <hr className="border-gray-200" />
              <form onSubmit={handlePasswordUpdate}>
                <h4 className="text-lg font-semibold text-gray-900">Password</h4>
                <p className="mt-1 text-base text-gray-600">
                  Update your password associated with this workspace.
                </p>
                <div className="mt-6">
                  <label
                    htmlFor="current-password"
                    className="block text-base font-medium text-gray-900"
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    name="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-2 w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="new-password"
                    className="block text-base font-medium text-gray-900"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update password
                </button>
              </form>
              <button
                onClick={handleLogout}
                className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          )}

          {activeTab === "api" && (
            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900">API Keys</h4>
              <p className="mt-1 text-base text-gray-600">
                Manage your API keys for integrating with @datafloww/analytics.
              </p>
              <div className="overflow-x-auto">
                <table className="mt-4 w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-sm font-semibold text-gray-900">
                        Key id    
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-900">
                        Value
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-900">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {key.key.split("-")[0]}-*****
                          <RiFileCopyLine
                            className="inline-flex mx-2 active:bg-slate-300 rounded-2xl py-1 cursor-pointer hover:bg-slate-100 transition-all"
                            size={28}
                            onClick={() => copyKeytoClipboard(key.key)}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {new Date(key.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={generateApiKey}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate New API Key
              </button>

              {/* Segment Snippet Section */}
              <div className="mt-8">
                <h5 className="text-base font-semibold text-gray-900">
                  Install the Datafloww Snippet
                </h5>
                <p className="mt-1 text-sm text-gray-600">
                  Copy the Datafloww snippet and paste it high in the {"<head>"} of your website.{" "}
                  <a
                    href="https://segment.com/docs/connections/sources/catalog/libraries/website/analytics.js/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Learn more about setting up in the Analytics.js guide.
                  </a>
                </p>
                <div className="mt-4 bg-gray-200 p-4 rounded-md relative">
                  <div className="max-w-2xl">
                    <pre className="text-sm text-gray-800 max-h-40 pb-2 whitespace-pre overflow-x-scroll">
                      {`<script>
  ${dfSnippet}
</script>`}
                    </pre>
                  </div>
                </div>
                <button
                  onClick={() => copyKeytoClipboard(`<script>\n  ${dfSnippet}\n</script>`)}
                  className="p-2 my-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Copy Snippet<RiFileCopyLine size={20} className="inline-flex mx-2" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Billing Information
              </h4>
              <p className="mt-1 text-base text-gray-600">
                View and manage your subscription details.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-base text-gray-900">
                  <strong>Plan:</strong> {billing.plan}
                </p>
                <p className="text-base text-gray-900">
                  <strong>Cost:</strong> {billing.cost}
                </p>
                <p className="text-base text-gray-900">
                  <strong>Next Billing Date:</strong> {billing.nextBilling}
                </p>
                <p className="text-base text-gray-900">
                  <strong>Status:</strong> {billing.status}
                </p>
              </div>
              <button
                disabled
                onClick={() => toast("Upgrade plan not implemented yet.")}
                className="cursor-not-allowed mt-4 px-4 py-2 bg-slate-200 text-slate-300 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}