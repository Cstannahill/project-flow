import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "../ui/dialogs/DeleteConfirmationDialog";

export interface DatabaseActionProps {
  exportFormat: string;
  setExportFormat: (format: any) => void;
  exportDiagramType: string;
  setExportDiagramType: (type: any) => void;
  handleExport: () => void;
  handleExportDiagram: () => void;
  handleCollapseAll: () => void;
  handleDeleteSchema: () => void;
}

export default function DatabaseActions({
  exportFormat,
  setExportFormat,
  exportDiagramType,
  setExportDiagramType,
  handleExport,
  handleExportDiagram,
  handleCollapseAll,
  handleDeleteSchema,
}: DatabaseActionProps) {
  return (
    <div className="my-2 inline-flex  gap-4 flex-row shrink-1">
      <DeleteConfirmationDialog
        onConfirm={handleDeleteSchema}
        trigger={
          <button className="rounded-xl shadow-2xl flex shrink-1 p-2 cursor-pointer z-10 bg-red-400/90 hover:bg-red-700 transition-all duration-200 ease-in-out">
            <Trash2 className="text-white mx-auto my-auto" size={20} />
          </button>
        }
      />

      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value as any)}
        className="border px-2 py-1 rounded"
      >
        <option value="sql">SQL</option>
        <option value="prisma">Prisma</option>
        <option value="dbml">DBML</option>
        <option value="json">JSON</option>
      </select>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Export Schema
      </button>

      <select
        value={exportDiagramType}
        onChange={(e) => setExportDiagramType(e.target.value as any)}
        className="border px-2 py-1 rounded"
      >
        <option value="svg">SVG</option>
        <option value="png">PNG</option>
      </select>
      <button
        onClick={handleExportDiagram}
        className="bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Export Diagram
      </button>

      <button className="ct-btn bg-gray-400" onClick={handleCollapseAll}>
        Collapse/Expand All
      </button>
    </div>
  );
}
