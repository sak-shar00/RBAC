import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchTasks, deleteTask } from "../../features/tasksSlice";
import Spinner from "../../components/Spinner";
import { Trash2, CheckCircle, Clock, Folder, User, UserCog } from "lucide-react";
import { Button } from "../../components/ui/button";

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
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="w-7 h-7" />
          Task Management (All Tasks)
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-left dark:text-white">Title</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Description</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Status</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Project</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Assigned To</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Created By</th>
                <th className="px-4 py-2 border-b text-left dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border-b font-medium dark:text-white">{task.title}</td>
                  <td className="px-4 py-2 border-b max-w-xs truncate dark:text-gray-300">{task.description || "-"}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 w-fit ${getStatusColor(task.status)}`}>
                      {task.status === "completed" && <CheckCircle className="w-3 h-3" />}
                      {task.status === "in-progress" && <Clock className="w-3 h-3" />}
                      {task.status === "pending" && <Clock className="w-3 h-3" />}
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b dark:text-gray-300">
                    {task.project ? (
                      <span className="flex items-center gap-1">
                        <Folder className="w-4 h-4 text-blue-500" />
                        {task.project.name}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 border-b dark:text-gray-300">
                    {task.assignedTo ? (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4 text-green-500" />
                        {task.assignedTo.name}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 border-b dark:text-gray-300">
                    {task.createdBy?.name ? (
                      <span className="flex items-center gap-1">
                        <UserCog className="w-4 h-4 text-purple-500" />
                        {task.createdBy.name}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tasks.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tasks found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
