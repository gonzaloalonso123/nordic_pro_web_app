import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowRight, Zap, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Tables } from "@/types/database.types";
import { useUrl } from "@/hooks/use-url";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    return null;
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
      return `${diffInHours} hours left`;
    } else {
      const diffInDays = Math.ceil(diffInHours / 24);
      return `${diffInDays} days left`;
    }
  };

  const isTraining = nextEvent.type === "TRAINING";
  const cardClasses = isTraining
    ? "border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-50"
    : "border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50";

  const badgeClasses = isTraining
    ? "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-blue-200 font-bold"
    : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 font-bold";

  const buttonClasses = isTraining
    ? "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700"
    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";

  const iconColor = isTraining ? "text-blue-500" : "text-green-500";
  const EventIcon = isTraining ? Zap : Trophy;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className={`h-full ${cardClasses} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-4 relative overflow-hidden">
          <motion.div
            className={`absolute -top-8 -right-8 w-24 h-24 ${isTraining ? "bg-blue-400" : "bg-green-400"} rounded-full opacity-10`}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="flex flex-row items-start justify-between mb-3">
            <motion.div
              className="flex flex-col items-start gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </motion.div>
                <div className="text-xl font-bold text-gray-800">Next Event</div>
              </div>
              <Badge className={`${badgeClasses} px-3 py-1`}>{nextEvent.type}</Badge>
            </motion.div>
            <motion.span
              className="flex items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="px-3 py-1">{getTimeUntilEvent(nextEvent.start_date)}</Badge>
            </motion.span>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-md font-semibold text-gray-800 leading-tight">{nextEvent?.name ?? ""}</h3>
            {/* <div className="flex items-center gap-2">
              <EventIcon className={`h-5 w-5 ${iconColor}`} />
            </div> */}
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="flex items-center gap-3 text-sm text-gray-700 font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Calendar className={`h-5 w-5 ${iconColor}`} />
              <span>{formatDate(nextEvent.start_date)}</span>
              <span>
                {formatTime(nextEvent.start_date)} - {formatTime(nextEvent.end_date)}
              </span>
            </motion.div>
            {/* <motion.div
              className="flex items-center gap-3 text-sm text-gray-700 font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Clock className={`h-5 w-5 ${iconColor}`} />
              <span>
                {formatTime(nextEvent.start_date)} - {formatTime(nextEvent.end_date)}
              </span>
            </motion.div> */}
            <motion.div
              className="flex items-center gap-3 text-sm text-gray-700 font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <MapPin className={`h-5 w-5 ${iconColor}`} />
              <span className="truncate">{nextEvent?.locations?.name ?? ""}</span>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter
          className={`${
            isTraining
              ? "bg-gradient-to-r from-blue-100/50 to-sky-100/50 border-t-2 border-blue-200"
              : "bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-t-2 border-green-200"
          } py-3`}
        >
          <motion.div
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`${path}/calendar/${nextEvent.id}`} className="w-full">
              <Button className={`w-full ${buttonClasses} text-white shadow-lg font-bold`}>
                View Event Details
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
