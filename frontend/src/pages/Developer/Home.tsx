import Layout from "../../components/Layout";
import Card from "../../components/Card";

export default function DeveloperHome() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Developer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Assigned Tasks" value="8" description="Tasks assigned to you" icon="✅" />
        <Card title="In Progress" value="3" description="Currently working" icon="🔄" />
        <Card title="Completed" value="15" description="Tasks completed" icon="🎉" />
      </div>
    </Layout>
  );
}
