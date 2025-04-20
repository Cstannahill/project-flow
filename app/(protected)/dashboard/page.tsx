"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProjects, createProject } from "@/lib/store/projects/thunks";
import {
  selectProjects,
  selectProjectsStatus,
  selectProjectsError,
  setCurrentProject,
} from "@/lib/store/projects"; // ← use the selectors file
import { persistSelectedProjectId } from "@/lib/store/users/thunks";
import CreateProjectModal from "@/components/ui/modals/CreateProjectModal";
import { ProjectComponent } from "@/components/ProjectComponent";
import { toast } from "react-hot-toast";
import { P } from "@/components/ui/Typography";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const projects = useAppSelector(selectProjects);
  const status = useAppSelector(selectProjectsStatus);
  const error = useAppSelector(selectProjectsError);

  const [showModal, setShowModal] = useState(false);

  // Load projects once
  useEffect(() => {
    if (status === "idle") dispatch(fetchProjects());
  }, [status, dispatch]);

  // When user clicks a project
  const handleSelect = (projId: string) => {
    const proj = projects.find((p) => p.id === projId) ?? null;
    dispatch(setCurrentProject(proj));
    dispatch(persistSelectedProjectId(projId));
    router.push(`/projects/${projId}`);
  };

  // When user creates a new project
  const handleCreate = async (newProj: {
    title: string;
    description: string;
  }) => {
    // grab the created project from the thunk’s return value
    try {
      const created = await dispatch(createProject(newProj)).unwrap();
      dispatch(setCurrentProject(created));
      dispatch(persistSelectedProjectId(created.id));
      toast.success(`Project "${created.title}" created successfully!`);
      setShowModal(false);
      router.push(`/projects/${created.id}`);
    } catch (error: any) {
      toast.error(`Error creating project: ${error.message}`);
    }
  };

  const mapProject = (project: any) => {
    return (
      <React.Fragment key={project.id}>
        <ProjectComponent
          key={project.id}
          id={project.id}
          createdAt={project.createdAt}
          updatedAt={project.updatedAt}
          title={project.title}
          description={project.description}
          selectProjectHandler={handleSelect}
          techStack={project.techStack}
        />
      </React.Fragment>
    );
  };

  if (status === "loading")
    return <P className="text-center text-sm">Loading projects...</P>;
  if (status === "failed") return <P>Error: {error}</P>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="space-y-2 text-center">
          <P className="text-sm">
            {`It looks like you don't have any projects yet.`}
          </P>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-sm underline hover:text-blue-600"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map(mapProject)}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onCloseAction={() => setShowModal(false)}
          onSaveAction={handleCreate}
        />
      )}
    </main>
  );
}
