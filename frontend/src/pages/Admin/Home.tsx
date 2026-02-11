import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { fetchDashboardStatsAPI } from "../../api/admin";
import { useState } from "react";
import { Users, Folder, CheckSquare } from "lucide-react";
import Spinner from "../../components/Spinner";

interface DashboardStats {
  users: number;
  projects: number;
  tasks: number;
  activeUsers: number;
  pendingTasks: number;
  completedTasks: number;
}

export default function AdminHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchDashboardStatsAPI();
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
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          title="Users" 
          value={stats?.users?.toString() || "0"} 
          description={`${stats?.activeUsers || 0} active users`}
          icon={Users}
          navigateTo="/admin/users"
        />
        <Card 
          title="Projects" 
          value={stats?.projects?.toString() || "0"} 
          description="Total projects"
          icon={Folder}
          navigateTo="/admin/projects"
        />
        <Card 
          title="Tasks" 
          value={stats?.tasks?.toString() || "0"} 
          description={`${stats?.completedTasks || 0} completed, ${stats?.pendingTasks || 0} pending`}
          icon={CheckSquare}
          navigateTo="/admin/tasks"
        />
      </div>
    </Layout>
  );
}
