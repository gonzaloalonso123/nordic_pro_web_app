"use client";

import type { ResponsiveColumnDef } from "../data-table";

export function createSortableHeader<TData>(
  title: string,
  accessor: keyof TData,
  responsive?: ResponsiveColumnDef<TData>["responsive"]
): ResponsiveColumnDef<TData> {
  return {
    accessor: accessor,
    responsive,
    header: ({ column }) => (
      <button
        className="flex items-center space-x-2 font-semibold hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{title}</span>
      </button>
    ),
    enableSorting: true,
  };
}

export const responsiveBreakpoints = {
  always: {},
  hiddenMobile: {
    visible: "hidden sm:table-cell",
  },
  hiddenTablet: {
    visible: "hidden md:table-cell",
  },
  hiddenUntilLarge: {
    visible: "hidden lg:table-cell",
  },
  hiddenUntilXL: {
    visible: "hidden xl:table-cell",
  },
  mobileOnly: {
    hidden: "sm:hidden",
  },
};
