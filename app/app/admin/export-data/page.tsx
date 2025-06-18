"use client";

import { Button } from "@/components/ui/button";
import { useClientData } from "@/utils/data/client";
import React, { useEffect, useState } from "react";
import TeamFormVisualization from "../../team/[teamId]/forms/components/team-form-visualisation";

const teamId = "3ec69a38-7b1d-425d-8253-a6c5999b9e2d";
function transformData(data) {
  if (!Array.isArray(data)) {
    throw new Error("Input data must be an array");
  }

  const forms = [];
  return data.map((form) => {
    const transformedForm = {
      name: form.form.title,
      description: form.form.description,
      createdAt: form.created_at,
      updatedAt: form.updated_at,
      questions: form.form.questions,
    };
    forms.push(transformedForm);
  });
}

const Page = () => {
  const {
    data: sentFormInvitations,
    isPending: sentFormsPending,
    isError,
  } = useClientData().formInvitations.useByTeam(teamId);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    console.log(transformData(sentFormInvitations));
  }, [sentFormInvitations]);

  const handleExport = () => {
    if (!sentFormInvitations || sentFormInvitations.length === 0) {
      alert("No data available to export.");
      return;
    }

    setIsExporting(true);

    try {
      const cleanData = transformData(sentFormInvitations);
      const jsonString = JSON.stringify(cleanData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("An error occurred while exporting the data.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <Button onClick={handleExport} disabled={sentFormsPending || isExporting || !sentFormInvitations}>
      {isExporting ? "Exporting..." : sentFormsPending ? "Loading Data..." : "Export as JSON"}
    </Button>
  );
};

export default Page;
