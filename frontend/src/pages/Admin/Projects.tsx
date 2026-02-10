import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchProjects, createProject, assignProject } from "../../features/projectsSlice";
import { fetchUsers } from "../../features/usersSlice";
import Spinner from "../../components/Spinner";
import { Plus, FolderPlus, UserCog, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function AdminProjects() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { users } = useSelector((state: RootState) => state.users);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [assignData, setAssignData] = useState({ projectId: "", managerId: "" });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createProject(formData));
    setFormData({ name: "", description: "" });
    setShowForm(false);
  };

  const handleAssignManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignData.projectId && assignData.managerId) {
      dispatch(assignProject(assignData));
      setAssignData({ projectId: "", managerId: "" });
    }
  };

  const managers = users.filter(u => u.role === "manager");

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FolderPlus className="w-7 h-7" />
            Project Management
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            {showForm ? (
              <>
                <Edit className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Project
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Create Project Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Project
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>
              <Button type="submit" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </form>
          </div>
        )}

        {/* Assign Manager Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Assign Manager to Project
          </h3>
          <form onSubmit={handleAssignManager} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
              <select
                value={assignData.projectId}
                onChange={(e) => setAssignData({ ...assignData, projectId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager</label>
              <select
                value={assignData.managerId}
                onChange={(e) => setAssignData({ ...assignData, managerId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Manager</option>
                {managers.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              Assign
            </Button>
          </form>
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-left dark:text-white">Project Name</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Description</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Manager</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border-b font-medium dark:text-white">{project.name}</td>
                  <td className="px-4 py-2 border-b dark:text-gray-300">{project.description || "-"}</td>
                  <td className="px-4 py-2 border-b">
                    {project.manager ? (
                      <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <UserCog className="w-4 h-4" />
                        {project.manager.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {projects.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No projects found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
