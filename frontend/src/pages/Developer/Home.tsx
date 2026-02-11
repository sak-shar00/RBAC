import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchDeveloperStats } from "../../features/tasksSlice";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import Spinner from "../../components/Spinner";
import { CheckSquare, Clock, Trophy } from "lucide-react";

export default function DeveloperHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchDeveloperStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Developer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          title="Assigned Tasks" 
          value={stats?.assignedTasks?.toString() || "0"} 
          description="Tasks assigned to you" 
          icon={CheckSquare}
          navigateTo="/developer/tasks"
        />
        <Card 
          title="In Progress" 
          value={stats?.inProgress?.toString() || "0"} 
          description="Currently working" 
          icon={Clock}
          navigateTo="/developer/tasks"
        />
        <Card 
          title="Completed" 
          value={stats?.completed?.toString() || "0"} 
          description="Tasks completed" 
          icon={Trophy}
        />
      </div>
    </Layout>
  );
}
