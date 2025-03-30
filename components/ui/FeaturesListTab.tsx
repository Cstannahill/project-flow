"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableFeatureCard from "@/components/ui/cards/SortableFeatureCard";

const typeOptions = [
  "Frontend",
  "Backend",
  "API",
  "Database",
  "Auth",
  "DevOps",
  "Testing",
  "Docs",
  "Design",
  "Third-Party Integration",
  "Infrastructure",
  "Deployment",
];

const statusOptions = ["Planned", "In Progress", "Complete"];

export default function FeatureListTab() {
  const { id: projectId } = useParams();
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [creatingFeature, setCreatingFeature] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(typeOptions.map((t) => [t, true]))
  );
  const [groupByType, setGroupByType] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await fetch(`/api/projects/${projectId}/features`);
      const data = await res.json();
      setFeatures(data);
      setLoading(false);
    };
    if (projectId) fetchFeatures();
  }, [projectId]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = features.findIndex((f) => f.id === active.id);
      const newIndex = features.findIndex((f) => f.id === over.id);
      const newOrder = arrayMove(features, oldIndex, newIndex);
      setFeatures(newOrder);

      setSavingOrder(true);
      await fetch(`/api/projects/${projectId}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newOrder.map((f) => f.id) }),
      });
      setSavingOrder(false);
    }
  };

  const handleDelete = async (featureId: string) => {
    const confirmed = confirm("Are you sure you want to delete this feature?");
    if (!confirmed) return;

    await fetch(`/api/projects/${projectId}/features`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featureId }),
    });

    setFeatures((prev) => prev.filter((f) => f.id !== featureId));
  };

  const handleEdit = (updated: any) => {
    setFeatures((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleCreate = (created: any) => {
    setFeatures((prev) => [created, ...prev]);
    setCreatingFeature(false);
  };

  const toggleGroup = (type: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const filtered = features.filter((f) =>
    statusFilter ? f.status === statusFilter : true
  );

  const grouped = typeOptions.reduce((acc, type) => {
    acc[type] = filtered.filter((f) => f.type === type);
    return acc;
  }, {} as Record<string, any[]>);
  const knownTypes = new Set(typeOptions);
  grouped["Other"] = filtered.filter((f) => !knownTypes.has(f.type));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Features</h2>
          {savingOrder && (
            <p className="text-sm italic text-blue-500">Saving order...</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="border p-2 rounded text-sm bg-transparent"
          >
            <option value="">Filter: All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setGroupByType((prev) => !prev)}
            className="text-sm underline hover:text-blue-600"
          >
            {groupByType ? "Switch to Flat View" : "Group by Type"}
          </button>

          {!creatingFeature && (
            <button
              onClick={() => setCreatingFeature(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              + Add Feature
            </button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {groupByType ? (
          <>
            {Object.entries(grouped).map(([type, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={type} className="border rounded shadow-sm">
                  <div
                    onClick={() => toggleGroup(type)}
                    className="cursor-pointer px-4 py-2 font-medium bg-neutral-100 dark:bg-neutral-800 border-b"
                  >
                    {type} {expandedGroups[type] !== false ? "▾" : "▸"}
                  </div>

                  {expandedGroups[type] !== false && (
                    <SortableContext
                      items={items.map((f) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="p-4 space-y-3">
                        {items.map((feature) => (
                          <SortableFeatureCard
                            key={feature.id}
                            feature={feature}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            projectId={projectId as string}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <SortableContext
            items={filtered.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filtered.map((feature) => (
                <SortableFeatureCard
                  key={feature.id}
                  feature={feature}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  projectId={projectId as string}
                />
              ))}
            </div>
          </SortableContext>
        )}

        {creatingFeature && (
          <div className="mt-4">
            <SortableFeatureCard
              feature={{
                id: "new",
                title: "",
                type: "Frontend",
                tags: [],
                status: "Planned",
              }}
              isNew
              onDelete={() => setCreatingFeature(false)}
              onEdit={handleCreate}
              projectId={projectId as string}
            />
          </div>
        )}
      </DndContext>
    </div>
  );
}
