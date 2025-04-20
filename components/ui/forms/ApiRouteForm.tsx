"use client";

import { useState, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Option } from "@/components/ui/Option";
import type {
  ApiRoutePayload,
  ApiRoute,
  ApiRouteCreatePayload,
} from "@/types/entities/apiRoutes";
import safeStringify from "fast-safe-stringify";
import JsonEditor from "@/components/apis/JsonEditor";
import { Editor } from "@monaco-editor/react";
import { JsonForm } from "@/components/apis/JsonDataField";
// import { updateApiRoute, createApiRoute } from "@/lib/store/apiRoutes";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

interface Props {
  id?: string;
  tab: "details" | "json";
  initialData?: ApiRoutePayload;
  onSubmitStart?: () => void;
  onSubmitEnd?: (data: ApiRouteCreatePayload | ApiRoutePayload) => void;
}

/**
 * Form for creating or editing a single API route definition.
 * Responsive: single‑column on mobile, two‑column on ≥ sm screens.
 */
export default function ApiRouteForm({
  tab,
  initialData,
  onSubmitStart, // default to resolved promise if not provided
  onSubmitEnd = () => {}, // default to empty function if not provided
}: Props) {
  return (
    <>
      <JsonForm
        initial={initialData}
        onSubmitAction={(data: ApiRoutePayload) => onSubmitEnd(data)}
      />
    </>
  );
}
