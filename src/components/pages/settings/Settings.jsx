import { useState, useEffect } from "react";

import { User, Lock, Key, Shield, Globe, Eye, Save } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@agroplatform.com",
    phone: "+91 0000000000",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
  });

  const [apiKeys, setApiKeys] = useState({
    payment: "",
    sms: "",
    firebase: "",
    maps: "",
  });

  const [permissions, setPermissions] = useState({
    superAdmin: {
      "All Permissions": true,
      "User Management": true,
      "Product Management": true,
      "Order Management": true,
      "Financial Access": true,
      "System Settings": true,
    },
    contentManager: {
      "Website CMS": true,
      Notifications: true,
      Banners: true,
      "Blog Posts": true,
    },
    supportManager: {
      "View Tickets": true,
      "Reply to Tickets": true,
      "Close Tickets": true,
      "View User Details": true,
    },
  });

  const [seo, setSeo] = useState({
    title: "AgroConnect - Connecting Farmers with Markets",
    description:
      "Best platform for farmers to connect with markets and sell their produce directly.",
    keywords: "agriculture, farming, organic produce, market, farmers",
    analyticsId: "",
  });

  const [privacy, setPrivacy] = useState({
    policy: "",
    terms: "",
    refund: "",
  });

  const handleProfileSave = () => {
    alert("Profile Saved Successfully");
    console.log(profile);
  };

  const handlePasswordUpdate = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("Password not matching");
      return;
    }
    alert("Password Updated (Static)");
  };

  const handleApiSave = () => {
    alert("API Keys Saved");
    console.log(apiKeys);
  };

  const handleSeoSave = () => {
    alert("SEO Saved");
    console.log(seo);
  };

  const handlePrivacySave = () => {
    alert("Policies Saved");
    console.log(privacy);
  };

  const handlePermissionsSave = () => {
    alert("Permissions Saved");
    console.log(permissions);
  };

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "api", label: "API Keys", icon: Key },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "seo", label: "SEO Settings", icon: Globe },
    { id: "privacy", label: "Privacy Policy", icon: Eye },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-gray-600">
            Manage admin settings and configurations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[green] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Admin Profile</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <input
                        type="file"
                        accept="image/*"
                        id="profilePhoto"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProfilePhoto(URL.createObjectURL(file));
                          }
                        }}
                      />

                      <label
                        htmlFor="profilePhoto"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-2 cursor-pointer"
                      >
                        Change Photo
                      </label>

                      <p className="text-sm text-gray-600">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value="Super Admin"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Update Password
                </button>

                {/* Two-Factor */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium mb-4">
                    Two-Factor Authentication
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p>Enable 2FA</p>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={() =>
                          setSecurity({
                            ...security,
                            twoFactor: !security.twoFactor,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[green]"></div>
                    </label>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p>Current Session</p>
                        <p className="text-sm text-gray-600">
                          Mumbai, India • Chrome on Windows
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  API Keys & Integrations
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Payment Gateway Key", key: "payment" },
                    { label: "SMS Gateway API Key", key: "sms" },
                    { label: "Firebase Server Key", key: "firebase" },
                    { label: "Google Maps API Key", key: "maps" },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm text-gray-700 mb-2">
                        {item.label}
                      </label>
                      <input
                        type="password"
                        value={apiKeys[item.key]}
                        onChange={(e) =>
                          setApiKeys({ ...apiKeys, [item.key]: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleApiSave}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save API Keys
                </button>
              </div>
            )}

            {/* Permissions Tab */}
            {/* Permissions Tab */}
            {activeTab === "permissions" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Role Permissions</h3>
                <div className="space-y-4">
                  {(() => {
                    const roles = [
                      {
                        role: "Super Admin",
                        roleKey: "superAdmin",
                        perms: [
                          "All Permissions",
                          "User Management",
                          "Product Management",
                          "Order Management",
                          "Financial Access",
                          "System Settings",
                        ],
                      },
                      {
                        role: "Content Manager",
                        roleKey: "contentManager",
                        perms: [
                          "Website CMS",
                          "Notifications",
                          "Banners",
                          "Blog Posts",
                        ],
                      },
                      {
                        role: "Support Manager",
                        roleKey: "supportManager",
                        perms: [
                          "View Tickets",
                          "Reply to Tickets",
                          "Close Tickets",
                          "View User Details",
                        ],
                      },
                    ];

                    return roles.map((r) => (
                      <div
                        key={r.role}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="mb-3 font-medium">{r.role}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {r.perms.map((perm) => (
                            <label
                              key={perm}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={permissions[r.roleKey][perm]}
                                onChange={() =>
                                  setPermissions({
                                    ...permissions,
                                    [r.roleKey]: {
                                      ...permissions[r.roleKey],
                                      [perm]: !permissions[r.roleKey][perm],
                                    },
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{perm}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <button
                  onClick={handlePermissionsSave}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Permissions
                </button>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={seo.title}
                      onChange={(e) =>
                        setSeo({ ...seo, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seo.description}
                      onChange={(e) =>
                        setSeo({ ...seo, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={seo.keywords}
                      onChange={(e) =>
                        setSeo({ ...seo, keywords: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={seo.analyticsId}
                      onChange={(e) =>
                        setSeo({ ...seo, analyticsId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSeoSave}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save SEO Settings
                </button>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Privacy Policy & Terms
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Privacy Policy", key: "policy", rows: 8 },
                    { label: "Terms & Conditions", key: "terms", rows: 8 },
                    { label: "Refund Policy", key: "refund", rows: 5 },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm text-gray-700 mb-2">
                        {item.label}
                      </label>
                      <textarea
                        rows={item.rows}
                        value={privacy[item.key]}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, [item.key]: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handlePrivacySave}
                  className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Policies
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
