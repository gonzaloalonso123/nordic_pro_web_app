"use client";

import type React from "react";

interface TabNavigationProps {
  activeTab: "datetime" | "preview";
  setActiveTab: (tab: "datetime" | "preview") => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => (
  <div className="grid grid-cols-2 gap-0 border rounded-md overflow-hidden">
    <button
      className={`py-3 text-center transition-colors ${
        activeTab === "datetime"
          ? "bg-blue-100 text-blue-600 font-medium"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
      onClick={() => setActiveTab("datetime")}
    >
      Date/Time
    </button>
    <button
      className={`py-3 text-center transition-colors ${
        activeTab === "preview"
          ? "bg-blue-100 text-blue-600 font-medium"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
      onClick={() => setActiveTab("preview")}
    >
      Preview
    </button>
  </div>
);
