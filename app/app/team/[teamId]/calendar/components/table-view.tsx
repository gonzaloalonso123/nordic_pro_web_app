"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, MoreHorizontal, Search, Timer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isAfter, isBefore } from "date-fns";
import { DataTable, type ResponsiveColumnDef, SortableHeader } from "@/components/data-table/data-table";
import { cn } from "@/lib/utils";
import { responsiveBreakpoints } from "@/components/data-table/lib/table-utils";
import { Card } from "@/components/ui/card";
import { useUrl } from "@/hooks/use-url";
import { useRouter } from "next/navigation";

interface TrainingSession {
  id: string;
  type: string;
  start_date: string;
  end_date: string;
  name: string;
  description: string;
  calendar_id?: string;
  created_at?: string;
  updated_at?: string;
  time_to_come?: string;
  location_id?: string;
  invite_future_members?: boolean;
  locations?: {
    id: string;
    name: string;
    created_at?: string;
    coordinates?: string;
    organisation_id?: string;
  };
}

interface TrainingSessionsTableProps {
  events: TrainingSession[];
  isLoading?: boolean;
}

type SessionStatus = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  value: "upcoming" | "ongoing" | "past" | "unknown";
};

export function TrainingSessionsTable({ events, isLoading = false }: TrainingSessionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const path = useUrl();
  const router = useRouter();

  const getSessionStatus = (session: TrainingSession): SessionStatus => {
    const now = new Date();
    const startDate = new Date(session.start_date);
    const endDate = new Date(session.end_date);

    if (isAfter(now, endDate))
      return {
        label: "Completed",
        variant: "secondary",
        value: "past",
      };
    if (isAfter(now, startDate) && isBefore(now, endDate))
      return {
        label: "Live",
        variant: "destructive",
        value: "ongoing",
      };
    if (isAfter(startDate, now))
      return {
        label: "Upcoming",
        variant: "default",
        value: "upcoming",
      };
    return { label: "Unknown", variant: "outline", value: "unknown" };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TRAINING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "GAME":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleRowClick = (session: TrainingSession) => {
    router.push(`${path}/calendar/${session.id}`);
  };

  const filteredData = useMemo(() => {
    return events.filter((session) => {
      const matchesSearch =
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.locations?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || session.type === typeFilter;
      const sessionStatus = getSessionStatus(session);
      const matchesStatus = statusFilter === "all" || sessionStatus.value === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, typeFilter, statusFilter]);

  const columns: ResponsiveColumnDef<TrainingSession>[] = [
    {
      accessorKey: "name",
      mobilePriority: 1,
      header: ({ column }) => <SortableHeader column={column}>Session</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-48",
      },
      cell: ({ row }) => {
        const session = row.original;
        const status = getSessionStatus(session);
        return (
          <div>
            <div className="font-medium">{session.name}</div>
            <div className="sm:hidden text-xs text-muted-foreground mt-1 space-x-2">
              <Badge variant={status.variant} className="mr-2">
                {new Date(session.start_date).toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getTypeColor(session.type))}>
                {session.type}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => <SortableHeader column={column}>Type</SortableHeader>,
      skeleton: {
        type: "badge",
      },
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge variant="outline" className={cn("text-xs", getTypeColor(type))}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "start_date",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => <SortableHeader column={column}>Date & Time</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-32",
      },
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{format(new Date(session.start_date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>
                {format(new Date(session.start_date), "HH:mm")} - {format(new Date(session.end_date), "HH:mm")}
              </span>
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.start_date);
        const dateB = new Date(rowB.original.start_date);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      id: "duration",
      responsive: responsiveBreakpoints.hiddenTablet,
      header: ({ column }) => <SortableHeader column={column}>Duration</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-20",
      },
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <span>{formatDuration(session.start_date, session.end_date)}</span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const durationA = new Date(rowA.original.end_date).getTime() - new Date(rowA.original.start_date).getTime();
        const durationB = new Date(rowB.original.end_date).getTime() - new Date(rowB.original.start_date).getTime();
        return durationA - durationB;
      },
    },
    {
      accessorKey: "locations.name",
      responsive: responsiveBreakpoints.hiddenTablet,
      header: ({ column }) => <SortableHeader column={column}>Location</SortableHeader>,
      skeleton: {
        type: "default",
        width: "w-28",
      },
      cell: ({ row }) => {
        const session = row.original;
        const hasLocation = !!session.locations?.name;
        return hasLocation ? (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{session.locations.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        );
      },
    },
    {
      id: "status",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      skeleton: {
        type: "badge",
      },
      cell: ({ row }) => {
        const session = row.original;
        const status = getSessionStatus(session);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
      sortingFn: (rowA, rowB) => {
        const statusA = getSessionStatus(rowA.original);
        const statusB = getSessionStatus(rowB.original);
        const statusOrder = { upcoming: 0, ongoing: 1, past: 2, unknown: 3 };
        return statusOrder[statusA.value] - statusOrder[statusB.value];
      },
    },
    {
      id: "actions",
      header: "",
      skeleton: {
        type: "button",
      },
      cell: ({ row }) => {
        const session = row.original;
        const hasLocation = !!session.locations?.name && !!session.locations?.coordinates;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRowClick(session)}>View Details</DropdownMenuItem>
                {hasLocation && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      const [lat, lng] = session.locations!.coordinates!.split(" ");
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Maps
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="TRAINING">Training</SelectItem>
              <SelectItem value="GAME">GAME</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="upcoming" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Live</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {events.length} sessions
        </div>
      </Card>

      <div
        className="cursor-pointer"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const row = target.closest("[data-row-id]");
          if (row && !target.closest("button")) {
            const sessionId = row.getAttribute("data-row-id");
            const session = filteredData.find((s) => s.id === sessionId);
            if (session) handleRowClick(session);
          }
        }}
      >
        <div className="bg-white rounded-md">
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            skeletonRows={5}
            className="[&_tr]:cursor-pointer [&_tr]:hover:bg-muted/50"
            onRowClick={(row) => {
              const session = row.original;
              handleRowClick(session);
            }}
          />
        </div>
      </div>

      {!isLoading && filteredData.length === 0 && (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No sessions found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}
