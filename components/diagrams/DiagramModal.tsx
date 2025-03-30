"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

type Props = {
  content: string;
  onClose: () => void;
  title?: string;
};

export default function DiagramModal({ content, onClose, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: "default" });
        const { svg } = await mermaid.render(`diagram-${Date.now()}`, content);
        setSvgHtml(svg);
        setError("");
      } catch (err: any) {
        setError(err.message || "Mermaid rendering error");
      }
    };

    renderDiagram();
  }, [content]);

  const downloadSVG = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "diagram"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    if (!svgHtml) return;

    const svg = new Blob([svgHtml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${title || "diagram"}.png`;
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title || "Diagram"}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadSVG}
              className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
              title="Export SVG"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              SVG
            </button>
            <button
              onClick={downloadPNG}
              className="text-sm flex items-center gap-1 text-green-600 hover:underline"
              title="Export PNG"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-red-500 italic text-sm">{error}</p>
        ) : (
          <div
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: svgHtml }}
            className="overflow-auto"
          />
        )}
      </div>
    </div>
  );
}
