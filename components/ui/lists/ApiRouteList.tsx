"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApiRouteDialog from "@/components/ui/modals/ApiRouteDialogue";
import type { ApiRoute } from "@/types/entities/apiRoutes";
import safeStringify from "fast-safe-stringify";

interface Props {
  routes: ApiRoute[];
  doRefreshAction: () => Promise<void>;
}

export default function ApiRouteList({ routes, doRefreshAction }: Props) {
  const [editing, setEditing] = useState<ApiRoute | null>(null);

  return (
    <>
      {editing && (
        <ApiRouteDialog
          open={!!editing}
          onCloseAction={() => setEditing(null)}
          initialData={editing}
          doRefreshAction={doRefreshAction}
        />
      )}

      <div className="space-y-4">
        {routes.map((r) => (
          <Card key={r.id} className="group">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <CardHeader className="flex cursor-pointer flex-row items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="min-w-[60px] justify-center font-mono text-xs"
                    >
                      {r.method}
                    </Badge>
                    <div className="font-mono text-sm">{r.path}</div>
                  </div>

                  <ChevronDownIcon className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {r.description && (
                    <CardDescription>{r.description}</CardDescription>
                  )}

                  <pre className="bg-muted/40 overflow-auto rounded-md p-4 text-xs">
                    {safeStringify(r, null, 2)}
                  </pre>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditing(r)}
                    >
                      <PencilIcon className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("Delete this route?")) return;
                        await fetch(
                          `/api/projects/${r.projectId}/apis/${r.id}`,
                          { method: "DELETE" },
                        );
                        doRefreshAction();
                      }}
                    >
                      <TrashIcon className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </>
  );
}
