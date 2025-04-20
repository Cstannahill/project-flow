import { Save, Grid2x2Plus, ChartNetwork } from "lucide-react";
import { HelperTooltip } from "@/components/ui/tooltips/HelperTooltip";
import { CreateSchemaDialog } from "@/components/ui/dialogs/CreateSchemaDialog";
import { P } from "../ui/Typography";

interface Props {
  onSaveSchema: () => void;
  onAddTable: () => void;
  onGenerateDiagram: () => void;
  isNamingOpen: boolean;
  setIsNamingOpen: (open: boolean) => void;
  onSaveNewSchema: (name: string) => void;
}

export default function DatabaseToolbar({
  onSaveSchema,
  onAddTable,
  onGenerateDiagram,
  isNamingOpen,
  setIsNamingOpen,
  onSaveNewSchema,
}: Props) {
  return (
    <>
      <div className="float-end inline-flex flex-wrap gap-2 p-2">
        <CreateSchemaDialog
          open={isNamingOpen}
          onCancel={() => setIsNamingOpen(false)}
          onConfirm={(name) => {
            setIsNamingOpen(false);
            onSaveNewSchema(name);
          }}
        />

        <div onClick={onGenerateDiagram} className="icon-button">
          <ChartNetwork size={20} className="database-icon-button" />
          <P>Gen ER</P>
        </div>

        <div onClick={onAddTable} className="icon-button">
          <Grid2x2Plus className="database-icon-button" size={20} />
          <P>Add Table</P>
        </div>
        <div onClick={onSaveSchema} className="icon-button ">
          <Save size={20} className="database-icon-button" />
          <P>Save</P>
        </div>
      </div>
    </>
  );
}
