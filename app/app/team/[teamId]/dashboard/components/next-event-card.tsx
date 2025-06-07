"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowRight, Zap, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Tables } from "@/types/database.types";
import { useUrl } from "@/hooks/use-url";
import Link from "next/link";

type EventWithLocation = Tables<"events"> & {
  locations: Tables<"locations">;
};

interface NextEventCardProps {
  events: EventWithLocation[];
}

export default function NextEventCard({ events }: NextEventCardProps) {
  const [nextEvent, setNextEvent] = useState<EventWithLocation | null>(null);
  const path = useUrl();

  useEffect(() => {
    const now = new Date();
    const upcomingEvents = events
      .filter((event) => new Date(event.start_date) > now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    setNextEvent(upcomingEvents[0] || null);
  }, [events]);

  if (!nextEvent) {
    return (
      <Card className="w-full max-w-md bg-linear-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No upcoming events</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getTimeUntilEvent = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInHours = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `in ${diffInHours}h`;
    } else {
      const diffInDays = Math.ceil(diffInHours / 24);
      return `in ${diffInDays}d`;
    }
  };

  const isTraining = nextEvent.type === "TRAINING";
  const cardClasses = isTraining
    ? "border-blue-200 bg-linear-to-br from-blue-50 to-sky-50"
    : "border-green-200 bg-linear-to-br from-green-50 to-emerald-50";

  const badgeClasses = isTraining
    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
    : "bg-green-100 text-green-800 hover:bg-green-200";

  const buttonClasses = isTraining
    ? "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700";

  const iconColor = isTraining ? "text-blue-500" : "text-green-500";
  const EventIcon = isTraining ? Zap : Trophy;

  return (
    <Card className={`w-full max-w-md ${cardClasses} border-2 overflow-hidden`}>
      <CardHeader className="pb-2 relative">
        <motion.div
          className={`absolute -top-6 -right-6 w-24 h-24 ${isTraining ? "bg-blue-500" : "bg-green-500"} rounded-full opacity-10`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EventIcon className={`h-5 w-5 ${iconColor}`} />
            <Badge className={badgeClasses}>{nextEvent.type}</Badge>
          </motion.div>
          <motion.span
            className="text-sm font-medium px-2 py-1 rounded-full bg-white/80 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getTimeUntilEvent(nextEvent.start_date)}
          </motion.span>
        </div>
        <motion.h3
          className="text-xl font-bold text-gray-900 leading-tight mt-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {nextEvent.name}
        </motion.h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-600"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Calendar className={`h-4 w-4 ${iconColor}`} />
            <span>{formatDate(nextEvent.start_date)}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-600"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Clock className={`h-4 w-4 ${iconColor}`} />
            <span>
              {formatTime(nextEvent.start_date)} - {formatTime(nextEvent.end_date)}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-600"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <MapPin className={`h-4 w-4 ${iconColor}`} />
            <span className="truncate">{nextEvent.locations.name}</span>
          </motion.div>
        </motion.div>
      </CardContent>
      <CardFooter
        className={`${isTraining ? "bg-linear-to-r from-blue-100/50 to-sky-100/50 border-t border-blue-200" : "bg-linear-to-r from-green-100/50 to-emerald-100/50 border-t border-green-200"} py-3`}
      >
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
        >
          <Link href={`${path}/calendar/${nextEvent.id}`} className="w-full">
            <Button className={`w-full ${buttonClasses} text-white shadow-md`}>
              View Event Details
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
