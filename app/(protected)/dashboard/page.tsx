// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateProjectModal from "@/components/ui/modals/CreateProjectModal";

type Project = {
  id: string;
  title: string;
  description: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleNewProject = () => {
    setShowModal(true);
  };

  const handleSaveProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setShowModal(false);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button
          onClick={handleNewProject}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <p className="text-center text-sm">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="text-center space-y-2">
          <p className="text-sm">
            {`It looks like you don't have any projects yet.`}
          </p>
          <button
            onClick={handleNewProject}
            className="mt-2 text-sm underline hover:text-blue-600"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="border rounded-lg p-5 shadow hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="mt-2 text-sm opacity-80">{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveProject}
        />
      )}
    </main>
  );
}
