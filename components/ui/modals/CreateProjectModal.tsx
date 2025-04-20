"use client";

import { useState } from "react";

interface Props {
  onSaveAction: (proj: { title: string; description: string }) => void;
  onCloseAction: () => void;
}

export default function CreateProjectModal({
  onCloseAction,
  onSaveAction,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    console.log("CreatProjectModal - handleSubmit", { title, description });
    e.preventDefault();
    console.log("CreatProjectModal - handleSubmit", { title, description });
    onSaveAction({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none focus:ring"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none focus:ring"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 rounded border hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              // disabled={loading}
              className="px-4 py-2 ct-btn rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {"Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
