import { fetchProjects, selectProjects } from "@/lib/store/projects";
import { useAppSelector } from "@/lib/store/hooks";
import { Project } from "@/types/entities/projects";

// export const useGetProjectById = (id: string): Project[] => {
//   const project = useAppSelector(selectProjects).filter(
//     (project) => project.id === id,
//   );
//   return project;
// };
// async function getProjects(): Promise<Project[] | void> {
//   try {
//     const res = await fetch("/api/projects");
//     if (!res.ok) throw new Error("Failed to fetch projects");
//     const data = (await res.json()) as Project[];
//     return data;
//   } catch (err) {
//     return console.error((err as Error).message);
//   }
// }

// export async function getProjectById(
//   id: string | undefined,
// ): Promise<Project | void> {
//   if (!id) return undefined;
//   const projects = await getProjects();
//   try {
//     if (!projects || projects.length < 1) throw new Error("No projects found");
//     const project = projects.find((project: Project) => project.id === id);

//     return project;
//   } catch (err) {
//     return console.error((err as Error).message);
//   }
// }
