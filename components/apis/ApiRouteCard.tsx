import { Edit, Trash } from "lucide-react";
import { HelperTooltip } from "@/components/ui/tooltips/HelperTooltip";
import { deleteApiRoute } from "@/lib/store/apiRoutes/thunks";
import { useAppDispatch } from "@/lib/store/hooks";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import { useState } from "react";
import type { ApiRoute } from "@/types/entities/apiRoutes";
import { P } from "../ui/Typography";
import { Button } from "../ui/button";

export interface ApiRouteCardProps {
  api: ApiRoute;
  onEdit: (api: ApiRoute) => void;
  onDelete?: (id: string) => void;
}

export default function ApiRouteCard(props: ApiRouteCardProps) {
  const { api, onEdit } = props;
  // const [isDeleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    props.onDelete?.(api.id);
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow transition-all hover:shadow-xl dark:bg-neutral-900">
      <div>
        <h3 className="text-lg font-semibold">
          <span className="font-bold text-blue-500">{api?.method}</span>{" "}
          {api?.path}
        </h3>
        <P className="text-brand text-sm">{api?.description}</P>
      </div>

      <div className="flex gap-2">
        {" "}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-500/10"
          onClick={() => onEdit(api)}
        >
          <Edit size={20} />
        </Button>
        <DeleteConfirmationDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-red-500/10"
            >
              <Trash size={20} />
            </Button>
          }
          title="Delete API?"
          description={`Are you sure you want to delete the ${api?.method} ${api?.path} API?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
