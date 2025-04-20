import type { ApiRoute } from "@/types/entities/apiRoutes";
import { JsonDetailForm, type FieldConfig } from "./EditorField";
import JsonEditor from "./JsonEditor";

const apiFields: FieldConfig<ApiRoute>[] = [
  { name: "projectId", type: "hidden" },
  { name: "id", type: "hidden" },
  { name: "path", label: "Path", type: "text", placeholder: "/api/foo" },
  {
    name: "method",
    label: "HTTP Method",
    type: "select",
    options: [
      { value: "GET", label: "GET" },
      { value: "POST", label: "POST" },
      /* … */
    ],
  },
  { name: "summary", label: "Summary", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  // {
  //   name: "responses",
  //   label: "Responses",
  //   type: "textarea",
  //   placeholder: "{\n   200: OK\n404: Not Found\n500: Internal Server Error\n}",
  // },
  // { name: "params", label: "Parameters", type: "textarea" },
  // { name: "body", label: "Request Body", type: "textarea" },

  // { name: "query", label: "Query", type: "textarea" },
];
export function JsonForm({ initial, onSave }: any) {
  return (
    <>
      <JsonDetailForm<ApiRoute>
        fields={apiFields}
        initialData={initial}
        onSubmitAction={onSave}
      />
    </>
  );
}
