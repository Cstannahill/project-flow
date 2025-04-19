"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { store } from "@/lib/store/store";
import { fetchProjects } from "@/lib/store/projectThunks";
import { setSelectedProjectId } from "@/lib/store/userSlice";
// import { setUserProject } from "@/lib/store/userThunks";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import CreateProjectModal from "@/components/ui/modals/CreateProjectModal";
import { ProjectComponent } from "@/components/ProjectComponent";

type Project = {
  id: string;
  title: string;
  description: string;
};

export default function DashboardPage() {
  const [localPrState, setLocalPState] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.project);
  // const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    // For example, only fetch if we have 0 projects
    if (!projects.length && !loading) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects, loading]);
  const handleSelectProject = (id: string) => {
    dispatch(setSelectedProjectId(id));
    // dispatch();
    router.push(`/projects/${id}`);
  };
  const handleNewProject = () => {
    setShowModal(true);
  };

  const handleSaveProject = (newProject: Project) => {
    setShowModal(false);
  };

  const mapProject = (project: any) => {
    return (
      <React.Fragment key={project.id}>
        <ProjectComponent
          key={project.id}
          id={project.id}
          name={project.name}
          createdAt={project.createdAt}
          updatedAt={project.updatedAt}
          title={project.title}
          description={project.description}
          selectProjectHandler={handleSelectProject}
        />
      </React.Fragment>
    );
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
          {projects.map(mapProject)}
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
