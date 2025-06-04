// app/(protected)/projects/[id]/apis/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ScalarApiDocs } from "@/components/apis/ScalarApiDocs";
import { toast } from "react-hot-toast";
import {
  fetchApiRoutes,
  selectApiRoutesByProject,
  selectApiRoutesStatus,
  createApiRoute,
  updateApiRoute,
  deleteApiRoute,
  rebuildOpenApiSpec,
  fetchOpenApiSpec,
} from "@/lib/store/apiRoutes";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type {
  ApiRoute,
  ApiRouteCreatePayload,
  ApiRoutePayload,
} from "@/types/entities/apiRoutes";
import { useProjectId } from "@/hooks/useProjectId";
import { Loading } from "@/components/ui/Loading";
import { P } from "@/components/ui/Typography";
import ApiRouteDialog from "@/components/ui/modals/ApiRouteDialogue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash } from "lucide-react";

export default function ApiRoutesPage() {
  const dispatch = useAppDispatch();
  const projectId = useProjectId();

  const apiRoutes = useAppSelector((s) =>
    selectApiRoutesByProject(s, projectId),
  );
  const status = useAppSelector((s) => selectApiRoutesStatus(s, projectId));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<
    ApiRoutePayload | ApiRouteCreatePayload | null
  >(null);

  // Load routes + trigger spec rebuild on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOpenApiSpec({ projectId }));
      dispatch(fetchApiRoutes(projectId));
      dispatch(rebuildOpenApiSpec({ projectId }));
    }
  }, [dispatch, projectId, status]);

  const handleSave = async (
    data: ApiRouteCreatePayload | ApiRoutePayload | null,
  ) => {
    try {
      if (editingRoute?.id) {
        // PATCH existing
        await dispatch(
          updateApiRoute({ ...data, id: editingRoute.id }),
        ).unwrap();
        toast.success("API route updated");
      } else {
        // POST new
        await dispatch(createApiRoute({ projectId, ...data })).unwrap();
        // rebuild spec after create
        await dispatch(rebuildOpenApiSpec({ projectId })).unwrap();
        toast.success("API route created");
      }
      setDialogOpen(false);
      setEditingRoute(null);
      // re‑fetch to pick up changes
      dispatch(fetchApiRoutes(projectId));
    } catch (err: any) {
      toast.error(`Error: ${err.message || err}`);
    }
  };

  const handleDelete = async (id: string) => {
    // console.log("Deleting route", id);
    try {
      await dispatch(deleteApiRoute({ id })).unwrap();
      toast.success("API route deleted");
      dispatch(fetchApiRoutes(projectId));
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <>
      {status === "loading" && <Loading />}
      {status === "failed" && <P>Error loading API routes.</P>}

      <div className="mb-4 flex items-center">
        <h2 className="flex-1 text-2xl font-semibold">API Routes</h2>
        <Button
          variant="secondary"
          size="sm"
          color="success"
          onClick={() => {
            setEditingRoute(null);
            setDialogOpen(true);
          }}
        >
          + New Route
        </Button>
      </div>

      <ul className="mb-6 space-y-2">
        {apiRoutes.map((route) => (
          <li
            key={route.id}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <span className="font-mono text-sm">
              <strong>{route.method}</strong> {route.path}
            </span>
            <span className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingRoute(route);
                  setDialogOpen(true);
                }}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(route.id!)}
              >
                <Trash size={16} />
              </Button>
            </span>
          </li>
        ))}
      </ul>

      <ApiRouteDialog
        open={dialogOpen}
        initialData={editingRoute ?? undefined}
        onSaveAction={handleSave}
        onCloseAction={() => setDialogOpen(false)}
        doRefreshAction={() => dispatch(fetchApiRoutes(projectId))}
      />
      {apiRoutes.length > 0 ? (
        <ScalarApiDocs specUrl={`/api/projects/${projectId}/openapi-spec`} />
      ) : (
        <Skeleton className="mt-10" />
      )}
    </>
  );
}
