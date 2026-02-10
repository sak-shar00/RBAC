import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchManagerProjects } from "../../features/projectsSlice";
import Spinner from "../../components/Spinner";
import { Folder, Users, Mail } from "lucide-react";

export default function ManagerProjects() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchManagerProjects());
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Folder className="w-7 h-7" />
          My Projects
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2 flex items-center justify-center gap-2">
              <Folder className="w-5 h-5" />
              No projects assigned to you yet.
            </p>
            <p>Contact admin to assign projects.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500 dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-2 dark:text-white flex items-center gap-2">
                  <Folder className="w-6 h-6 text-green-500" />
                  {project.name}
                </h3>
                <p className="text-gray-600 mb-4 dark:text-gray-300">{project.description || "No description provided"}</p>
                <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Manager:</span>
                    <span>{project.manager?.name || "You"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email:</span>
                    <span>{project.manager?.email || "-"}</span>
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

