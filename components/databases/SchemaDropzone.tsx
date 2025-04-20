import { P } from "../ui/Typography";

interface Props {
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  dropError: string | null;
  schemas: Array<{ id: string; title: string }>;
  selectedSchemaId: string | null;
  onLoadSchema: (id: string) => void;
}

export default function SchemaDropzone({
  onFileDrop,
  dropError,
  schemas,
  selectedSchemaId,
  onLoadSchema,
}: Props) {
  return (
    <>
      <div
        className="flex justify-between items-center flex-wrap gap-4 border-2 border-dashed border-blue-300 rounded p-5 w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onFileDrop}
      >
        <h2 className="text-lg font-semibold">Database Schema</h2>
        <small className="text-gray-500">
          Drag a file to upload (.sql, .prisma, .dbml, .json)
        </small>

        <select
          value={selectedSchemaId || ""}
          onChange={(e) => onLoadSchema(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">— Load Schema —</option>
          {schemas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      {dropError && <P className="text-red-600">{dropError}</P>}
    </>
  );
}
