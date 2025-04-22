"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OpenApiSpecPage() {
  const { projectId } = useParams();
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}/openapi-spec`)
      .then((res) => res.json())
      .then((data) => setSpec(data.spec));
  }, [projectId]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-xl font-semibold">OpenAPI Spec JSON</h1>
      <pre className="overflow-auto rounded bg-neutral-100 p-4 text-sm dark:bg-neutral-800">
        {spec ? JSON.stringify(spec) : "Loading..."}
      </pre>
    </div>
  );
}
