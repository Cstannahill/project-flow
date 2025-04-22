import React, { Fragment, ReactNode, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import TextInput from "../forms/inputs/TextInput";
export interface CreateSchemaDialogProps {
  open: boolean;
  /** Called with the final name when the user clicks “Create” */
  onConfirm: (name: string) => void;
  /** Called when the dialog should close without saving */
  onCancel: () => void;
}

export const CreateSchemaDialog = ({
  open,
  onConfirm,
  onCancel,
}: CreateSchemaDialogProps) => {
  const [nameDraft, setNameDraft] = useState("");
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onCancel}
      >
        <Dialog.Panel className=" dialog-confirm-schema w-full max-w-sm rounded p-6">
          <Dialog.Title className="text-lg font-medium">
            Name your schema
          </Dialog.Title>
          <div className="mt-4">
            <TextInput
              label="Schema Name"
              inputClassName="border-slate-300"
              name="schemaName"
              value={nameDraft}
              valueChangeHandler={(_, v) => setNameDraft(v)}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button className="rounded border px-4 py-2" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => {
                if (nameDraft.trim()) {
                  onConfirm(nameDraft.trim());
                  setNameDraft(""); // reset for next time
                }
              }}
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};
