import { ReactNode } from "react";
import ProjectTabs from "@/components/navigation/tabs/ProjectTabs";
import ProjectProvider from "@/components/wrappers/ProjectContextProvider";
import "@/app/globals.css"; // global styles for the project layout

interface Props {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}

export default async function ProjectLayout({ children, params }: Props) {
  const { projectId } = await params;

  return (
    <ProjectProvider projectId={projectId}>
      {/* any server‑only header/nav you still want can go here */}
      <div className="mx-auto grid max-w-6xl px-4 py-5">
        <h1 className="mb-4 text-center text-2xl font-bold">
          {/* Project / {projectId} */}
        </h1>
        <ProjectTabs projectId={projectId} />
        <div className="mt-6">{children}</div>
      </div>
    </ProjectProvider>
  );
}
