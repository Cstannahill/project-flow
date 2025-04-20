"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProjects,
  setCurrentProject,
  selectProjects,
  selectProjectsStatus,
  selectCurrentProject,
  deleteProject,
  updateProject,
} from "@/lib/store/projects";
import ProjectTechStack from "@/components/ProjectTechStack";
import { toast } from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import type { ProjectSummary } from "@/types/entities/projects";
import { persistSelectedProjectId } from "@/lib/store/users";
import { P } from "@/components/ui/Typography";

export default function ProjectOverviewPage() {
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const router = useRouter();
  // grab full list & status
  const projects = useAppSelector(selectProjects);
  const status = useAppSelector(selectProjectsStatus);
  // grab the one we’re editing
  const project = useAppSelector(selectCurrentProject);

  // 1) on mount, load the list if not already
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  // 2) whenever list is ready or projectId changes, pick the right one
  useEffect(() => {
    if (status === "succeeded" && projectId) {
      const match = projects.find((p) => p.id === projectId) || null;
      dispatch(setCurrentProject(match));
    }
  }, [status, projectId, projects, dispatch]);
  if (status === "loading") return <Loading />;
  if (!project) return <P>Project not found.</P>;
  const handleDelete = async () => {
    console.log("andleDelete fired");
    try {
      await dispatch(deleteProject(project.id)).unwrap();
      toast.success(`Deleted project “${project.title}.”`);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(`Error deleting project: ${err}`);
    }
  };
  // Save handler now dispatches a PATCH + updates store
  const handleSave = async (payload: {
    title: string;
    description?: string;
    techStack: Record<string, string>;
  }) => {
    try {
      const updated = await dispatch(
        updateProject({ ...project, ...payload }),
      ).unwrap();
      dispatch(persistSelectedProjectId(updated.id));
      toast.success("Project updated successfully!");
      // optionally re‑navigate or refresh
    } catch (err: any) {
      toast.error("Failed to update project: " + err);
    }
  };
  return (
    <main className="fade-in animate-in zoom-in mx-auto max-w-4xl px-4 py-8 duration-1000">
      <DeleteConfirmationDialog
        trigger={
          <Trash2
            className="float-right cursor-pointer text-red-500"
            size={20}
          />
        }
        title={`Delete "${project.title}"?`}
        onConfirm={handleDelete}
      />
      <section>
        <ProjectTechStack
          initialData={project?.techStack || {}}
          projectInfo={{
            projectId: project?.id,
            title: project?.title || "",
            description: project?.description,
            createdAt: project?.createdAt?.toString() as string,
            updatedAt: project?.updatedAt?.toString() as string,
          }}
          onSave={handleSave}
        />
      </section>
    </main>
  );
  // return (
  //   <div>
  //     <ProjectTechStack
  //       initialData={project?.techStack || {}}
  //       projectInfo={{
  //         title: project?.title,
  //         description: project?.description,
  //       }}
  //     />
  //   </div>
  // );
}
