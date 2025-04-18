/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import RapiDocComponent from "@/components/ui/rapidoc/RapiDocComponent";
import ApiRouteForm from "@/components/ui/forms/ApiRouteForm";
import ApiRouteList from "@/components/ui/lists/ApiRouteList";
import type { ApiRoute } from "@/types/base";

export default function ApiManagementPage() {
  const { projectId } = useParams();
  const [spec, setSpec] = useState("");
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const fetchSpecUrl = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/openapi-spec`);

      // If the route failed (404/500) bail out gracefully
      if (!res.ok) {
        console.warn("No OpenAPI spec yet:", res.status, res.statusText);
        setSpec(""); // blank == “not ready”
        return;
      }

      // Parse the JSON safely
      const { specUrl } = (await res.json()) as { specUrl?: string | null };

      if (specUrl) {
        setSpec(specUrl); // RapiDoc will fetch this URL itself
      } else {
        console.info("Project has no specUrl yet");
        setSpec("");
      }
    } catch (err) {
      console.error("Error fetching OpenAPI spec:", err);
      setSpec("");
    }
  };
  const fetchRoutes = async () => {
    const res = await fetch(`/api/projects/${projectId}/apis`);
    const data = await res.json();
    setRoutes(data);
  };

  const updateRouteUI = async () => {
    fetchSpecUrl();
    fetchRoutes();
  };
  useEffect(() => {
    if (projectId) {
      fetchSpecUrl();
      fetchRoutes();
    }
  }, [projectId]);

  const handleUpdateRoute = async (updatedRoute: ApiRoute) => {
    await fetch(`/api/projects/${projectId}/apis/${updatedRoute.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRoute),
    });
    await fetchRoutes();
    await fetchSpecUrl();
  };

  const handleDeleteRoute = async (routeId: string) => {
    await fetch(`/api/projects/${projectId}/apis/${routeId}`, {
      method: "DELETE",
    });
    await fetchRoutes();
    await fetchSpecUrl();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        API Management
        <button
          onClick={() => setShowForm(!showForm)}
          className={
            showForm
              ? "ct-btn float-end bg-red-800 text-white text-base rounded border border-gray-400"
              : "ct-btn float-end bg-blue-900 text-white text-base rounded border border-amber-200"
          }
        >
          {showForm ? "Cancel" : "Add API Route"}
        </button>
      </h1>

      {showForm && (
        <ApiRouteForm updateRouteUI={updateRouteUI} onCancel={() => null} />
      )}
      <ApiRouteList
        routes={routes}
        updateRouteUI={updateRouteUI}
        // updateRoutes={handleUpdateRoute}
        // onDeleteRoute={() => handleDeleteRoute("1")}
      />
      {spec ? (
        <RapiDocComponent specUrl={spec} />
      ) : (
        <p className="text-gray-500">Loading OpenAPI spec...</p>
      )}
    </div>
  );
}
