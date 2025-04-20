import FloatingCard from "./ui/cards/FloatingCard";
import type { ProjectProps } from "@/types/entities/projects";
import { Divider } from "./ui/Divider";
import { techOptions } from "@/lib/staticAssets";
import Image from "next/image";
import { H1, P } from "./ui/Typography";

export const ProjectComponent = (project: ProjectProps) => {
  const {
    id,
    title,
    description,
    techStack,
    schemas,
    apiRoutes,
    selectProjectHandler,
  } = project;
  const handleClick = () => {
    if (id && selectProjectHandler) {
      selectProjectHandler(id);
    }
  };
  const techItems = techStack
    ? Object.entries(techStack)
        .map(([key, tool]) => {
          const options = techOptions[key] || [];
          const detail = options.find((opt) => opt.tool === tool);
          return detail ? { key, tool: detail.tool, icon: detail.icon } : null;
        })
        .filter(Boolean as any)
    : [];
  return (
    <FloatingCard
      className="w-full text-accent h-full cursor-pointer bg-radial-prime  border-slate-200/70 glow border flex flex-col items-center floating-project-card justify-center"
      onClick={handleClick}
    >
      <h1 className="text-2xl font-bold m-3 p-2">{title}</h1>
      <Divider className="w-full" />
      <P className="m-2 p-2">{description}</P>
      <Divider className="w-full" />
      {techItems.length > 0 && (
        <section className="w-full mt-0 mb-3 p-2">
          <H1 className="text-lg font-semibold text-center underline mb-3">
            Tech Stack
          </H1>
          <div className="grid grid-cols-4 gap-4">
            {techItems.map((ti) => (
              <div
                key={ti?.key}
                className="flex flex-col items-center text-center"
              >
                <Image
                  src={ti?.icon || ""}
                  alt={ti?.tool || ""}
                  width={20}
                  height={20}
                  className="w-10 h-10 object-scale mb-1 border border-brand rounded-xl"
                />
                <span className="text-2xs capitalize underline">{`${ti?.key}`}</span>
                <span className="text-xs">{`${ti?.tool}`}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </FloatingCard>
  );
};
