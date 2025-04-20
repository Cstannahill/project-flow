"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "@/lib/store/features";
import {
  selectFeaturesByProject,
  selectFeatureStatusByProject,
  selectFeatureErrorByProject,
} from "@/lib/store/features";

import FeatureCard from "@/components/ui/cards/FeatureCard";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import { typeOptions, statusOptions } from "@/lib/staticAssets";
import { Loading } from "./Loading";
import { P } from "./Typography";

export default function FeatureListTab() {
  const dispatch = useAppDispatch();
  const { projectId } = useParams() as { projectId: string };

  // Pull in normalized state
  const features = useAppSelector((state) =>
    selectFeaturesByProject(state, projectId),
  );
  const status = useAppSelector((state) =>
    selectFeatureStatusByProject(state, projectId),
  ); // 'idle'|'loading'|'succeeded'|'failed'
  const error = useAppSelector((state) =>
    selectFeatureErrorByProject(state, projectId),
  );

  // UI state
  const [groupByType, setGroupByType] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(typeOptions.map((t) => [t, true])),
  );
  const [creating, setCreating] = useState(false);

  // 1) Fetch on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFeatures(projectId));
    }
  }, [status, dispatch, projectId]);

  // 2) Handlers

  const handleCreate = async (data: {
    title: string;
    type: string;
    status: string;
    tags: string[];
    description: string;
  }) => {
    try {
      const f = await dispatch(createFeature({ projectId, ...data })).unwrap();
      toast.success(`Feature "${f.title}" created`);
      setCreating(false);
    } catch (err: any) {
      toast.error(`Error creating feature: ${err}`);
    }
  };

  const handleEdit = async (updated: any) => {
    try {
      const f = await dispatch(updateFeature(updated)).unwrap();
      toast.success(`Feature "${f.title}" updated`);
    } catch (err: any) {
      toast.error(`Error updating feature: ${err}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await dispatch(deleteFeature({ featureId: id })).unwrap();
      toast.success(`Feature "${title}" deleted`);
    } catch (err: any) {
      toast.error(`Error deleting feature: ${err}`);
    }
  };

  // 3) Filtering & grouping
  const filtered = features.filter((f) =>
    statusFilter ? f.status === statusFilter : true,
  );

  const grouped = typeOptions.reduce(
    (acc, t) => {
      acc[t] = filtered.filter((f) => f.type === t);
      return acc;
    },
    {} as Record<string, typeof filtered>,
  );
  grouped["Other"] = filtered.filter((f) => !typeOptions.includes(f.type));

  // 4) Render

  if (status === "loading") return <Loading />;
  if (status === "failed")
    return <P className="text-red-500">Error: {error}</P>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="text-xl font-semibold">Features</h2>
        <div className="flex items-center gap-4">
          <div className="select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border p-2 text-sm"
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setGroupByType((g) => !g)}
            className="text-sm underline hover:text-blue-600"
          >
            {groupByType ? "Flat View" : "Group by Type"}
          </button>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              + Add Feature
            </button>
          )}
        </div>
      </div>

      {/* Create form */}
      {creating && (
        <FeatureCard
          feature={{
            id: "new",
            title: "",
            type: typeOptions[0],
            status: statusOptions[0],
            tags: [],
            description: "",
            projectId: projectId,
          }}
          projectId={projectId}
          isNew
          onEditAction={handleCreate}
          onDelete={() => setCreating(false)}
        />
      )}

      {/* List */}
      {groupByType ? (
        Object.entries(grouped).map(([type, items]) => {
          if (!items.length) return null;
          return (
            <div key={type} className="rounded border shadow-sm">
              <div
                onClick={() =>
                  setExpandedGroups((e) => ({ ...e, [type]: !e[type] }))
                }
                className="flex cursor-pointer justify-between px-4 py-2"
              >
                <span>{type}</span>
                <span>{expandedGroups[type] ? "▾" : "▸"}</span>
              </div>
              {expandedGroups[type] && (
                <div className="space-y-3 p-4">
                  {items.map((f) => (
                    <FeatureCard
                      key={f.id}
                      feature={f}
                      onEditAction={handleEdit}
                      projectId={projectId}
                    >
                      <DeleteConfirmationDialog
                        trigger={<button className="text-red-500">🗑️</button>}
                        title={`Delete "${f.title}"?`}
                        onConfirm={() => handleDelete(f.id, f.title)}
                      />
                    </FeatureCard>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-brand space-y-3">
          {filtered.map((f) => (
            <FeatureCard
              key={f.id}
              feature={f}
              onEditAction={handleEdit}
              projectId={projectId}
            >
              <DeleteConfirmationDialog
                trigger={<button className="text-red-500">🗑️</button>}
                title={`Delete "${f.title}"?`}
                onConfirm={() => handleDelete(f.id, f.title)}
              />
            </FeatureCard>
          ))}
        </div>
      )}
    </div>
  );
}
