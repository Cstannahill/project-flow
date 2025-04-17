import type { ProjectProps } from "@/types/base";

export const ProjectComponent = (project: ProjectProps) => {
  const sentences = project?.description?.split(".") || [];
  const bullets = project?.description?.split("-") || [];
  const remarks = [...sentences, ...bullets];
  const { id, selectProjectHandler } = project;
  const handleClick = () => {
    if (id && selectProjectHandler) {
      selectProjectHandler(id);
    }
  };
  return (
    <div
      key={project.id}
      id={project.id}
      onClick={handleClick}
      className="border rounded-lg p-5 shadow hover:shadow-md transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold">{project.title}</h2>
      {remarks?.length > 0
        ? remarks.map((comment, index) => (
            <p key={`comment${comment}` + 1111 + "-" + index}>{comment}</p>
          ))
        : null}
    </div>
  );
};
