import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchTasks, deleteTask } from "../../features/tasksSlice";
import Spinner from "../../components/Spinner";

export default function AdminTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Task Management (All Tasks)</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">Title</th>
                <th className="px-4 py-2 border-b text-left">Description</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Project</th>
                <th className="px-4 py-2 border-b text-left">Assigned To</th>
                <th className="px-4 py-2 border-b text-left">Created By</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b font-medium">{task.title}</td>
                  <td className="px-4 py-2 border-b max-w-xs truncate">{task.description || "-"}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {task.project ? task.project.name : "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {task.assignedTo ? task.assignedTo.name : "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {task.createdBy?.name || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tasks.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
