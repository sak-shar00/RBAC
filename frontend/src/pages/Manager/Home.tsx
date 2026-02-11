import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { getManagerStats } from "../../api/manager";
import { Folder, CheckSquare, Users } from "lucide-react";
import Spinner from "../../components/Spinner";

interface ManagerStats {
  projects: number;
  tasks: number;
  developers: number;
  pendingTasks: number;
  completedTasks: number;
}

export default function ManagerHome() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getManagerStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          title="My Projects" 
          value={stats?.projects?.toString() || "0"} 
          description="Active projects"
          icon={Folder}
          navigateTo="/manager/projects"
        />
        <Card 
          title="My Tasks" 
          value={stats?.tasks?.toString() || "0"} 
          description={`${stats?.completedTasks || 0} completed, ${stats?.pendingTasks || 0} pending`}
          icon={CheckSquare}
          navigateTo="/manager/tasks"
        />
        <Card 
          title="Developers" 
          value={stats?.developers?.toString() || "0"} 
          description="Team members"
          icon={Users}
        />
      </div>
    </Layout>
  );
}

