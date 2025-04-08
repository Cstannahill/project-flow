import { useState } from "react";
import { ApiRoute } from "@/types/base";
import ApiRouteForm from "@/components/ui/forms/ApiRouteForm";

type Props = {
  routes: ApiRoute[];
  updateRouteUI: () => Promise<void>;
};

export default function ApiRouteList({ routes, updateRouteUI }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateRoute = async (updatedRoute: any) => {
    const apiPath = `/api/projects/${updatedRoute.projectId}/apis/${updatedRoute.id}`;
    console.log(
      `API PATH In Handle Update API ROUTE LIST BEFORE FETCH ${apiPath}`
    );
    // try {
    //   await fetch(
    //     `/api/projects/${updatedRoute.projectId}/apis/${updatedRoute.id}`,
    //     {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(updatedRoute),
    //     }
    //   );
    // } catch (err) {}
  };
  const handleDelete = async (route: ApiRoute) => {
    const confirmed = confirm("Delete this API route?");
    if (!confirmed) return;
    console.log("Incoming Route - Delete");
    console.table(route);
    const res = await fetch(
      `/api/projects/${route.projectId}/apis/${route.id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      handleUpdateRoute(routes.filter((r) => r.id !== route.id));
    }
  };

  return (
    <div className="space-y-4">
      {" "}
      {routes.map((route) => {
        const isExpanded = expanded[route.id] ?? false;
        const isEditing = editingId === route.id;

        return (
          <div
            key={route.id}
            className="border rounded-lg bg-white dark:bg-neutral-900 shadow-sm"
          >
            {isEditing ? (
              <div className="p-4">
                <ApiRouteForm
                  initialData={route}
                  updateRouteUI={updateRouteUI}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div>
                <div
                  onClick={() => toggleExpand(route.id)}
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
                      {route.id}
                      {route.method}
                    </span>{" "}
                    <span className="font-mono">{route.path}</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {route.summary}
                    </div>
                  </div>
                  <div className="flex gap-3 items-center text-sm">
                    <button
                      onClick={() => setEditingId(route.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t text-sm space-y-2 bg-gray-50 dark:bg-neutral-800">
                    {route.description && (
                      <p>
                        <strong>Description:</strong> {route.description}
                      </p>
                    )}

                    <details open>
                      <summary className="cursor-pointer font-medium">
                        Params
                      </summary>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(route.params || {}, null, 2)}
                      </pre>
                    </details>

                    <details>
                      <summary className="cursor-pointer font-medium">
                        Query
                      </summary>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(route.query || {}, null, 2)}
                      </pre>
                    </details>

                    <details>
                      <summary className="cursor-pointer font-medium">
                        Body
                      </summary>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(route.body || {}, null, 2)}
                      </pre>
                    </details>

                    <details>
                      <summary className="cursor-pointer font-medium">
                        Responses
                      </summary>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(route.responses || {}, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
