"use client";

import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { P } from "../Typography";

interface DeleteConfirmationDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <P className="text-sm text-gray-500">{description}</P>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-200 text-brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        onConfirm();
                      }}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
