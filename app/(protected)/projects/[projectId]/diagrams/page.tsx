"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DiagramEditor from "@/components/diagrams/DiagramEditor";
import DiagramViewer from "@/components/diagrams/DiagramViewer";
import DiagramModal from "@/components/diagrams/DiagramModal";
import { diagramTypes } from "@/lib/mermaidPresets";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  updateDiagram,
  fetchDiagrams,
  deleteDiagram,
  createDiagram,
  selectDiagramsByProject,
  selectDiagramStatusByProject,
  selectDiagramById,
} from "@/lib/store/diagrams";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import { P } from "@/components/ui/Typography";

type Diagram = {
  id: string;
  title: string;
  type: string;
  content: string;
};

export default function DiagramsTab() {
  const dispatch = useAppDispatch();
  const { projectId } = useParams() as { projectId: string };
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [fullScreenId, setFullScreenId] = useState<string | null>(null);
  const diagrams = useAppSelector((s) => selectDiagramsByProject(s, projectId));
  const status = useAppSelector((s) =>
    selectDiagramStatusByProject(s, projectId)
  );
  const fullscreenDiagram = useAppSelector((s) =>
    fullScreenId ? selectDiagramById(s, fullScreenId) : null
  );
  useEffect(() => {
    if (status === "idle" && projectId) {
      dispatch(fetchDiagrams(projectId));
    }
  }, [status, dispatch, projectId]);

  const handleSave = async (data: {
    id?: string;
    title: string;
    type: string;
    content: string;
  }) => {
    try {
      console.log(data);
      if (data?.id) {
        const { id } = data;
        // UPDATE
        console.log("updating");
        await dispatch(updateDiagram({ id, ...data })).unwrap();
        toast.success("Diagram updated");
      } else {
        // CREATE
        console.log("creating");
        if (data?.title === "") {
          data.title = `Untitled ${data?.type} Diagram`;
        }
        await dispatch(createDiagram({ projectId, ...data })).unwrap();
        toast.success("Diagram created");
      }
      setCreating(false);
      setSelectedId(null);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    try {
      const res = await dispatch(
        updateDiagram({ id, title: newTitle })
      ).unwrap();
      toast.success(`Diagram "${res.title}" updated`);
    } catch (error) {
      toast.error("Failed to update diagram title");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await dispatch(deleteDiagram({ id })).unwrap();
      toast.success(`Deleted diagram "${title}"`);
      if (selectedId === id) setSelectedId(null);
      if (viewingId === id) setViewingId(null);
    } catch (err: any) {
      toast.error(err);
    }
  };
  if (status === "loading") return <Loading />;
  if (status === "failed") return <P>Error loading diagrams.</P>;
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

      {diagrams.length === 0 && !creating ? (
        <P className="text-gray-500 italic">
          No diagrams yet for this project.
        </P>
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
                    <P className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      Type: {diagram.type}
                    </P>
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
                      onClick={() => setFullScreenId(diagram.id)}
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
                    <DeleteConfirmationDialog
                      trigger={
                        <button className="text-red-500 inline-flex align-text-bottom justify-center cursor-pointer items-center mr-3">
                          <Trash2 size={17} />
                        </button>
                      }
                      title={`Delete "${diagram.title}"?`}
                      onConfirm={() => handleDelete(diagram.id, diagram.title)}
                    />
                  </div>
                </div>

                {isEditing && (
                  <DiagramEditor
                    initialContent={diagram.content}
                    initialType={diagram.type}
                    onSaveAction={(data) =>
                      handleSave({ id: diagram.id, ...data, title: titleDraft })
                    }
                  />
                )}

                {isViewing && !isEditing && (
                  <DiagramViewer content={diagram.content || ""} />
                )}
              </div>
            );
          })}

          {creating && (
            <div className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm">
              <DiagramEditor
                onSaveAction={(data) =>
                  handleSave({ ...data, title: titleDraft })
                }
              />
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
          content={fullscreenDiagram.content || ""}
          title={fullscreenDiagram.title}
          onCloseAction={() => setFullScreenId(null)}
        />
      )}
    </div>
  );
}
