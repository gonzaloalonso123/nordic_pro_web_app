"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search,
  Timer,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isAfter, isBefore } from "date-fns";
import { TrainingSessionsTableLoading } from "./table-loading";

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
  onEventClick?: (event: any) => void;
  isLoading?: boolean;
}

type SortField = "name" | "start_date" | "type" | "location" | "duration";
type SortDirection = "asc" | "desc";

export function TrainingSessionsTable({
  events: events,
  onEventClick,
  isLoading = false,
}: TrainingSessionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("start_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const getSessionStatus = (session: TrainingSession) => {
    const now = new Date();
    const startDate = new Date(session.start_date);
    const endDate = new Date(session.end_date);

    if (isAfter(now, endDate))
      return {
        label: "Completed",
        variant: "secondary" as const,
        value: "past",
      };
    if (isAfter(now, startDate) && isBefore(now, endDate))
      return {
        label: "Live",
        variant: "destructive" as const,
        value: "ongoing",
      };
    if (isAfter(startDate, now))
      return {
        label: "Upcoming",
        variant: "default" as const,
        value: "upcoming",
      };
    return { label: "Unknown", variant: "outline-solid" as const, value: "unknown" };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TRAINING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MATCH":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEETING":
        return "bg-purple-100 text-purple-800 border-purple-200";
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleRowClick = (session: TrainingSession) => {
    if (onEventClick) {
      // Create a mock event object that matches the expected format
      const mockEvent = {
        event: {
          id: session.id,
        },
      };
      onEventClick(mockEvent);
    }
  };

  const filteredAndSortedSessions = useMemo(() => {
    const filtered = events.filter((session) => {
      const matchesSearch =
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.locations?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || session.type === typeFilter;
      const sessionStatus = getSessionStatus(session);
      const matchesStatus =
        statusFilter === "all" || sessionStatus.value === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "start_date":
          aValue = new Date(a.start_date);
          bValue = new Date(b.start_date);
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "location":
          aValue = a.locations?.name?.toLowerCase() || "";
          bValue = b.locations?.name?.toLowerCase() || "";
          break;
        case "duration":
          aValue =
            new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
          bValue =
            new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [events, searchTerm, typeFilter, statusFilter, sortField, sortDirection]);

  if (isLoading) {
    return <TrainingSessionsTableLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
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
              <SelectItem value="GAME">Match</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
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
          Showing {filteredAndSortedSessions.length} of {events.length} sessions
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Session
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Type
                  {getSortIcon("type")}
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("start_date")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Date & Time
                  {getSortIcon("start_date")}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("duration")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Duration
                  {getSortIcon("duration")}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("location")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Location
                  {getSortIcon("location")}
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No sessions found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedSessions.map((session) => {
                const status = getSessionStatus(session);
                const hasLocation = !!session.locations?.name;

                return (
                  <TableRow
                    key={session.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(session)}
                  >
                    <TableCell>
                      <div className="font-medium">{session.name}</div>
                      <div className="sm:hidden text-xs text-muted-foreground mt-1">
                        <Badge variant={status.variant} className="mr-2">
                          {status.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getTypeColor(session.type)}
                        >
                          {session.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={getTypeColor(session.type)}
                      >
                        {session.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {format(
                              new Date(session.start_date),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {format(new Date(session.start_date), "HH:mm")} -{" "}
                            {format(new Date(session.end_date), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {formatDuration(session.start_date, session.end_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {hasLocation && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{session.locations.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRowClick(session)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {hasLocation && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                const [lat, lng] =
                                  session.locations!.coordinates!.split(" ");
                                window.open(
                                  `https://www.google.com/maps?q=${lat},${lng}`,
                                  "_blank"
                                );
                              }}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Open in Maps
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
