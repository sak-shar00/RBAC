import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchDeveloperTasks, updateTaskStatus } from "../../features/tasksSlice";
import Spinner from "../../components/Spinner";
import { Button } from "../../components/ui/button";

export default function DeveloperTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchDeveloperTasks());
  }, [dispatch]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
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
        <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No tasks assigned to you yet.</p>
            <p>Check back later for new tasks.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                    <p className="text-gray-600">{task.description || "No description provided"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">Project:</span> {task.project?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Assigned by:</span> {task.createdBy?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-gray-700 py-2">Update Status:</span>
                    <Button 
                      variant={task.status === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(task._id, "pending")}
                      disabled={task.status === "pending"}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={task.status === "in-progress" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(task._id, "in-progress")}
                      disabled={task.status === "in-progress"}
                    >
                      In Progress
                    </Button>
                    <Button 
                      variant={task.status === "completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(task._id, "completed")}
                      disabled={task.status === "completed"}
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
