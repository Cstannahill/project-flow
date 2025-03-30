"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DiagramEditor from "@/components/diagrams/DiagramEditor";
import DiagramViewer from "@/components/diagrams/DiagramViewer";
import DiagramModal from "@/components/diagrams/DiagramModal";
import { diagramTypes } from "@/lib/mermaidPresets";

type Diagram = {
  id: string;
  title: string;
  type: string;
  content: string;
};

export default function DiagramsTab() {
  const { id: projectId } = useParams();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [fullscreenDiagram, setFullscreenDiagram] = useState<Diagram | null>(
    null
  );

  useEffect(() => {
    const fetchDiagrams = async () => {
      const res = await fetch(`/api/projects/${projectId}/diagrams`);
      const data = await res.json();
      setDiagrams(data);
      setLoading(false);
    };

    if (projectId) fetchDiagrams();
  }, [projectId]);

  const handleSave = async (
    data: { content: string; type: string },
    existingId?: string
  ) => {
    if (!projectId) return;

    if (existingId) {
      const res = await fetch(
        `/api/projects/${projectId}/diagrams/${existingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const updated = await res.json();
      setDiagrams((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    } else {
      const type = data.type;
      const snippet = diagramTypes.find((d) => d.value === type)?.snippet || "";
      const res = await fetch(`/api/projects/${projectId}/diagrams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Diagram",
          type,
          content: snippet,
        }),
      });
      const created = await res.json();
      setDiagrams((prev) => [...prev, created]);
    }

    setSelectedId(null);
    setCreating(false);
  };

  const handleRename = async (id: string, newTitle: string) => {
    const res = await fetch(`/api/projects/${projectId}/diagrams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    const updated = await res.json();
    setDiagrams((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Delete this diagram?");
    if (!confirmed) return;

    await fetch(`/api/projects/${projectId}/diagrams/${id}`, {
      method: "DELETE",
    });

    setDiagrams((prev) => prev.filter((d) => d.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (viewingId === id) setViewingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Diagrams</h2>
        <button
          onClick={() => setCreating(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Diagram
        </button>
      </div>

      {loading ? (
        <p>Loading diagrams...</p>
      ) : diagrams.length === 0 && !creating ? (
        <p className="text-gray-500 italic">
          No diagrams yet for this project.
        </p>
      ) : (
        <div className="space-y-4">
          {diagrams.map((diagram) => {
            const isEditing = selectedId === diagram.id;
            const isViewing = viewingId === diagram.id;

            return (
              <div
                key={diagram.id}
                className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {editingTitleId === diagram.id ? (
                      <input
                        type="text"
                        value={titleDraft}
                        autoFocus
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onBlur={async () => {
                          await handleRename(diagram.id, titleDraft);
                          setEditingTitleId(null);
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            await handleRename(diagram.id, titleDraft);
                            setEditingTitleId(null);
                          }
                        }}
                        className="text-lg font-semibold bg-transparent border-b focus:outline-none"
                      />
                    ) : (
                      <h3
                        className="font-semibold text-lg cursor-pointer hover:underline"
                        onClick={() => {
                          setEditingTitleId(diagram.id);
                          setTitleDraft(diagram.title);
                        }}
                      >
                        {diagram.title || "Untitled Diagram"}
                      </h3>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      Type: {diagram.type}
                    </p>
                  </div>
                  <div className="space-x-3 text-sm">
                    <button
                      onClick={() =>
                        setViewingId((prev) =>
                          prev === diagram.id ? null : diagram.id
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {isViewing ? "Hide" : "View"}
                    </button>
                    <button
                      onClick={() => setFullscreenDiagram(diagram)}
                      className="text-indigo-600 hover:underline"
                    >
                      Fullscreen
                    </button>
                    <button
                      onClick={() =>
                        setSelectedId((prev) =>
                          prev === diagram.id ? null : diagram.id
                        )
                      }
                      className="text-yellow-600 hover:underline"
                    >
                      {isEditing ? "Cancel Edit" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(diagram.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <DiagramEditor
                    initialContent={diagram.content}
                    initialType={diagram.type}
                    onSave={(data) => handleSave(data, diagram.id)}
                  />
                )}

                {isViewing && !isEditing && (
                  <DiagramViewer content={diagram.content} />
                )}
              </div>
            );
          })}

          {creating && (
            <div className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm">
              <DiagramEditor onSave={(data) => handleSave(data)} />
              <div className="pt-2 text-right">
                <button
                  onClick={() => setCreating(false)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {fullscreenDiagram && (
        <DiagramModal
          content={fullscreenDiagram.content}
          title={fullscreenDiagram.title}
          onClose={() => setFullscreenDiagram(null)}
        />
      )}
    </div>
  );
}
