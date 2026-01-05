import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield, Eye, X } from "lucide-react";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../../api/adminService";
import { getRoles, updateRolePermissions } from "../../../api/roleService";

export default function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showRoleEditModal, setShowRoleEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchAdmins();
    fetchRoles();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      console.log("Admins fetched:", data);
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      console.log("Roles fetched:", data);
      setRolesData(data); // Keep full objects with id, name, permissions
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const stats = [
    { title: "Total Admins", value: admins.length.toString() },
    {
      title: "Active Today",
      value: admins.filter((a) => a.status === "ACTIVE").length.toString(),
      color: "text-green-600",
    },
    { title: "Total Roles", value: rolesData.length.toString() },
    {
      title: "Inactive",
      value: admins.filter((a) => a.status === "INACTIVE").length.toString(),
    },
  ];

  const handleAddAdmin = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.roleId
    ) {
      alert("All fields are required!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format!");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: parseInt(formData.roleId), // Convert to number
      };
      console.log("Creating admin:", payload);
      await createAdmin(payload);
      fetchAdmins();
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", roleId: "" });
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Failed to add admin: " + (error.response?.data || error.message));
    }
  };

  const handleEditAdmin = async () => {
    if (!formData.name || !formData.email || !formData.roleId) {
      alert("Name, Email, and Role are required!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format!");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: parseInt(formData.roleId),
      };
      console.log("Updating admin:", payload);
      await updateAdmin(editingAdminId, payload);
      fetchAdmins();
      setIsEditMode(false);
      setEditingAdminId(null);
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", roleId: "" });
    } catch (error) {
      console.error("Error updating admin:", error);
      alert(
        "Failed to update admin: " + (error.response?.data || error.message)
      );
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(id);
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin.");
      }
    }
  };

  const handleEditRole = async () => {
    try {
      await updateRolePermissions(editingRole.name, selectedPermissions);
      fetchRoles();
      setShowRoleEditModal(false);
      setEditingRole(null);
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Error updating role permissions:", error);
      alert("Failed to update permissions.");
    }
  };

  const getAdminPermissions = (roleName) => {
    const role = rolesData.find((r) => r.name === roleName);
    return role && role.permissions ? role.permissions.join(", ") : "None";
  };

  const getRoleIdByName = (roleName) => {
    const role = rolesData.find((r) => r.name === roleName);
    return role ? role.id : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Admin Management</h2>
          <p className="text-gray-600 text-sm">
            Manage sub-admins and role permissions (RBAC)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[green] text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Sub-Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <p className="text-gray-600 text-sm">{item.title}</p>
            <p className={`mt-1 font-semibold ${item.color || ""}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Admin Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Permissions",
                  "Last Login",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-gray-600">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    {admin.name}
                  </td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getAdminPermissions(admin.role)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {admin.lastLogin || "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        admin.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setEditingAdminId(admin.id);
                        setFormData({
                          name: admin.name,
                          email: admin.email,
                          password: "",
                          roleId: getRoleIdByName(admin.role),
                        });
                        setShowAddModal(true);
                      }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {admin.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{admin.name}</h3>
              <div className="flex gap-2">
                <Eye
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                  onClick={() => setSelectedAdmin(admin)}
                />
                <Edit
                  className="w-4 h-4 text-green-500 cursor-pointer"
                  onClick={() => {
                    setIsEditMode(true);
                    setEditingAdminId(admin.id);
                    setFormData({
                      name: admin.name,
                      email: admin.email,
                      password: "",
                      roleId: getRoleIdByName(admin.role),
                    });
                    setShowAddModal(true);
                  }}
                />
                {admin.role !== "SUPER_ADMIN" && (
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => handleDeleteAdmin(admin.id)}
                  />
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{admin.email}</p>
            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 inline-block rounded">
              {admin.role}
            </p>
            <p className="text-gray-700 text-sm">
              {getAdminPermissions(admin.role)}
            </p>
            <p className="text-gray-500 text-xs">
              {admin.lastLogin || "Never"}
            </p>
            <p
              className={`text-xs inline-block px-2 py-1 rounded ${
                admin.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {admin.status}
            </p>
          </div>
        ))}
      </div>

      {/* Roles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Roles & Permissions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesData.map((role, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{role.name}</h4>
                <button
                  onClick={() => {
                    setEditingRole(role);
                    setSelectedPermissions([...role.permissions]);
                    setShowRoleEditModal(true);
                  }}
                  className="text-[green] text-sm"
                >
                  Edit
                </button>
              </div>
              {role.permissions &&
                role.permissions.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center text-gray-700 text-sm"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {p}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between mb-5">
              <h3 className="font-semibold">
                {isEditMode ? "Edit Admin" : "Add Sub-Admin"}
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select...</option>
                  {rolesData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 border py-2 rounded"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      roleId: "",
                    });
                    setIsEditMode(false);
                    setEditingAdminId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-[green] text-white py-2 rounded hover:bg-green-600"
                  onClick={isEditMode ? handleEditAdmin : handleAddAdmin}
                >
                  {isEditMode ? "Update Admin" : "Add Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Admin Details</h3>
              <X
                className="w-6 h-6 text-gray-500 cursor-pointer"
                onClick={() => setSelectedAdmin(null)}
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p>{selectedAdmin.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p>{selectedAdmin.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p>{selectedAdmin.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Permissions</p>
                <p>{getAdminPermissions(selectedAdmin.role)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p>{selectedAdmin.lastLogin || "Never"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {showRoleEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between mb-5">
              <h3 className="font-semibold">Edit Role: {editingRole?.name}</h3>
              <button onClick={() => setShowRoleEditModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                "ADMIN_CREATE",
                "ADMIN_READ",
                "ADMIN_UPDATE",
                "ADMIN_DELETE",
                "ROLE_CREATE",
                "ROLE_READ",
                "ROLE_UPDATE",
                "ROLE_DELETE",
                "PRODUCT_CREATE",
                "PRODUCT_READ",
                "PRODUCT_UPDATE",
                "PRODUCT_DELETE",
              ].map((perm) => (
                <label key={perm} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, perm]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter((p) => p !== perm)
                        );
                      }
                    }}
                  />
                  {perm}
                </label>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 border py-2 rounded"
                  onClick={() => {
                    setShowRoleEditModal(false);
                    setSelectedPermissions([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-[green] text-white py-2 rounded hover:bg-green-600"
                  onClick={handleEditRole}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
