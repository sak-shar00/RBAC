import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchUsers, createUser, toggleUser, clearError } from "../../features/usersSlice";
import Spinner from "../../components/Spinner";
import { Plus, Users, UserPlus, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import Modal from "../../components/Modal";
import { useNotification } from "../../context/NotificationContext";

export default function AdminUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const { showToast, showConfirmation } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer"
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleUser = (id: string, userName: string, action: "activate" | "deactivate") => {
    const actionText = action === "activate" ? "activate" : "deactivate";
    showConfirmation({
      title: `${actionText === "activate" ? "Activate" : "Deactivate"} User`,
      message: `Are you sure you want to ${actionText} user "${userName}"?`,
      confirmText: actionText === "activate" ? "Activate" : "Deactivate",
      variant: actionText === "activate" ? "info" : "danger",
      onConfirm: () => {
        dispatch(toggleUser(id))
          .unwrap()
          .then(() => {
            showToast(`User ${userName} has been ${actionText}ed successfully!`, "success");
          })
          .catch((err: string) => {
            showToast(err || `Failed to ${actionText} user`, "error");
          });
      },
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createUser(formData))
      .unwrap()
      .then(() => {
        showToast("User created successfully!", "success");
        setFormData({ name: "", email: "", password: "", role: "developer" });
        setShowForm(false);
      })
      .catch((err: string) => {
        // Error is already set in Redux state, show toast with the error message
        showToast(error || err || "Failed to create user", "error");
      });
  };

  const openModal = () => {
    dispatch(clearError());
    setShowForm(true);
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7" />
            User Management
          </h2>
          <Button
            onClick={openModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create User
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Create User Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Create New User"
          size="lg"
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create User
              </Button>
            </div>
          </form>
        </Modal>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-left dark:text-white">Name</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Email</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Role</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Status</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border-b dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    {user.name}
                  </td>
                  <td className="px-4 py-2 border-b dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-2 border-b dark:text-white capitalize flex items-center gap-2">
                    {user.role === "admin" && <Users className="w-4 h-4 text-purple-500" />}
                    {user.role === "manager" && <Users className="w-4 h-4 text-blue-500" />}
                    {user.role === "developer" && <Users className="w-4 h-4 text-green-500" />}
                    {user.role}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 w-fit ${
                      user.isActive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {user.isActive ? (
                        <>
                          <Check className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <Button
                      variant={user.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleUser(user._id, user.name, user.isActive ? "deactivate" : "activate")}
                      className="flex items-center gap-1"
                    >
                      {user.isActive ? (
                        <>
                          <X className="w-4 h-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No users found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

