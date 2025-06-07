"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ResponsiveColumnDef<TData, TValue = unknown>
  extends Omit<ColumnDef<TData, TValue>, keyof ColumnDef<TData, TValue>> {
  responsive?: {
    hidden?: string;
    visible?: string;
  };
  mobilePriority?: number;
  skeleton?: {
    type?: "default" | "avatar" | "badge" | "button" | "custom";
    width?: string;
    height?: string;
    className?: string;
    customComponent?: React.ReactNode;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ResponsiveColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  isLoading?: boolean;
  skeletonRows?: number;
}

interface SortableHeaderProps {
  column: any;
  children: React.ReactNode;
  className?: string;
}

function SortableHeader({ column, children, className }: SortableHeaderProps) {
  if (!column.getCanSort()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn("h-auto p-0 font-semibold hover:bg-transparent", className)}
    >
      {children}
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  isLoading = false,
  skeletonRows = 5,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns as unknown as ColumnDef<TData, any>[],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: { id: string; headers: any[] }) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnDef = header.column.columnDef as ResponsiveColumnDef<TData, TValue>;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(columnDef.responsive?.visible || "", columnDef.responsive?.hidden || "")}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => {
                    const columnDef = column as ResponsiveColumnDef<TData, TValue>;
                    const skeletonConfig = columnDef.skeleton || {};

                    return (
                      <TableCell
                        key={`skeleton-${index}-${colIndex}`}
                        className={cn(columnDef.responsive?.visible || "", columnDef.responsive?.hidden || "")}
                      >
                        {skeletonConfig.type === "avatar" ? (
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className={cn("h-4", skeletonConfig.width || "w-24")} />
                          </div>
                        ) : skeletonConfig.type === "badge" ? (
                          <Skeleton className={cn("h-5 w-16 rounded-full", skeletonConfig.className)} />
                        ) : skeletonConfig.type === "button" ? (
                          <Skeleton className={cn("h-8 w-8 rounded", skeletonConfig.className)} />
                        ) : skeletonConfig.type === "custom" && skeletonConfig.customComponent ? (
                          skeletonConfig.customComponent
                        ) : (
                          <Skeleton
                            className={cn(
                              "h-4 w-full max-w-[200px]",
                              skeletonConfig.width,
                              skeletonConfig.height,
                              skeletonConfig.className
                            )}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn("cursor-pointer hover:bg-slate-50", onRowClick && "hover:bg-muted/50")}>
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDef = cell.column.columnDef as ResponsiveColumnDef<TData, TValue>;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(columnDef.responsive?.visible || "", columnDef.responsive?.hidden || "")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { SortableHeader };
