import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchManagerTasks, createTask, updateManagerTask, deleteTask, assignTask } from "../../features/tasksSlice";
import { fetchManagerProjects } from "../../features/projectsSlice";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import type { Task } from "../../features/tasks";
import Spinner from "../../components/Spinner";
import { getDevelopers } from "../../api/manager";
import { Plus, Trash2, Edit, UserPlus, CheckCircle, Clock, Folder, Users, Calendar } from "lucide-react";

interface Developer {
  _id: string;
  name: string;
  email: string;
}

export default function ManagerTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", project: "", assignedTo: "" });
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchManagerProjects());
  }, [dispatch]);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchManagerTasks());
  }, [dispatch]);

  // Fetch developers when modal opens
  useEffect(() => {
    if (showModal || assignModal) {
      const loadDevelopers = async () => {
        try {
          const data = await getDevelopers();
          setDevelopers(data);
        } catch (err) {
          console.error("Failed to fetch developers:", err);
        }
      };
      loadDevelopers();
    }
  }, [showModal, assignModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { 
      title: formData.title, 
      description: formData.description, 
      project: formData.project || undefined, 
      assignedTo: formData.assignedTo || undefined 
    };
    
    if (editingTask) {
      await dispatch(updateManagerTask({ taskId: editingTask._id, data }));
    } else {
      await dispatch(createTask(data));
    }
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: "", description: "", project: "", assignedTo: "" });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      project: task.project?._id || "",
      assignedTo: task.assignedTo?._id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(taskId));
    }
  };

  const handleAssign = async (taskId: string, developerId: string) => {
    await dispatch(assignTask({ taskId, userId: developerId }));
    setAssignModal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-7 h-7" />
          Task Management
        </h1>
        <Button 
          onClick={() => { setEditingTask(null); setFormData({ title: "", description: "", project: "", assignedTo: "" }); setShowModal(true); }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
            <CheckCircle className="w-12 h-12 text-gray-300" />
            <p className="text-lg">No tasks found.</p>
          <p>Create your first task!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex gap-4 flex-wrap">
                    <span className={`px-2 py-1 rounded flex items-center gap-1 ${getStatusColor(task.status)}`}>
                      {task.status === "completed" && <CheckCircle className="w-3 h-3" />}
                      {task.status === "in-progress" && <Clock className="w-3 h-3" />}
                      {task.status === "pending" && <Clock className="w-3 h-3" />}
                      {task.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Folder className="w-4 h-4 text-blue-500" />
                      Project: {task.project?.name || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-500" />
                      Assigned to: {task.assignedTo?.name || "Unassigned"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setAssignModal(task._id)} className="flex items-center gap-1">
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(task)} className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(task._id)} className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
              {editingTask ? (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Task
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Task
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  placeholder="Task description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Developer</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Developer</option>
                  {developers.map((d) => (
                    <option key={d._id} value={d._id}>{d.name} ({d.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {editingTask ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
              <UserPlus className="w-5 h-5" />
              Assign Task
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Select a developer to assign this task:</p>
            {developers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No developers available</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {developers.map((dev) => (
                  <Button key={dev._id} variant="outline" onClick={() => handleAssign(assignModal, dev._id)} className="flex items-center gap-2 justify-start">
                    <Users className="w-4 h-4" />
                    {dev.name} ({dev.email})
                  </Button>
                ))}
              </div>
            )}
            <Button type="button" variant="ghost" className="mt-4 flex items-center gap-1" onClick={() => setAssignModal(null)}>
              <Trash2 className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}

