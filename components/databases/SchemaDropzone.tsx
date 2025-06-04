import { P } from "../ui/Typography";

interface Props {
  onFileDrop: (file: File) => void;
  dropError: string | null;
  schemas: Array<{ id: string; title: string }>;
  selectedSchemaId: string | null;
  onLoadSchema: (id: string) => void;
  /** Triggered when the user selects to start a new schema */
  onNewSchema: () => void;
}

export default function SchemaDropzone({
  onFileDrop,
  dropError,
  schemas,
  selectedSchemaId,
  onLoadSchema,
  onNewSchema,
}: Props) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFileDrop(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileDrop(file);
    e.target.value = ""; // allow re-uploading same file
  };

  return (
    <>
      <div
        className="flex justify-between items-center flex-wrap gap-4 border-2 border-dashed border-blue-300 rounded p-5 w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 className="text-lg font-semibold">Database Schema</h2>
        <small className="text-gray-500">
          Drag a file to upload (.sql, .prisma, .dbml, .json)
        </small>

        <input
          id="schema-file-input"
          type="file"
          accept=".sql,.prisma,.dbml,.json"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="schema-file-input"
          className="cursor-pointer rounded border px-2 py-1"
        >
          Choose File
        </label>

        <select
          value={selectedSchemaId || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__new__") {
              onNewSchema();
            } else {
              onLoadSchema(val);
            }
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="">— Load Schema —</option>
          <option value="__new__">New Schema</option>
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
