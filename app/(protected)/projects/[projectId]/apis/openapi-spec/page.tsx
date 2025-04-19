// app/(protected)/projects/[id]/openapi-spec/page.tsx
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">OpenAPI Spec JSON</h1>
      <pre className="bg-neutral-100 dark:bg-neutral-800 text-sm p-4 rounded overflow-auto">
        {spec ? JSON.stringify(spec, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}
