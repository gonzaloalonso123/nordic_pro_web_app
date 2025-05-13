import flags from "@/flags.json";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  TrophyIcon,
  UserRoundCog,
} from "lucide-react";
import { useCurrentUser } from "./useCurrentUser";

const root = flags.current_app;

const generalMenuItems = [
  { name: "Calendar", href: `${root}/calendar`, icon: Calendar },
  { name: "Messages", href: `${root}/chat`, icon: MessageSquare },
];

const coachMenuItems = [
  { name: "Management", href: `${root}/management`, icon: Settings },
  { name: "Analytics", href: `${root}/analytics`, icon: BarChart3 },
  { name: "Forms", href: `${root}/forms`, icon: MessageSquare },
];

const userMenuItems = [
  { name: "Dashboard", href: `${root}/dashboard`, icon: TrophyIcon },
];

const adminMenuItems = [
  { name: "Admin", href: `${root}/admin`, icon: UserRoundCog },
];

const role: string = "COACH";

export const useMenuItems = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.is_admin;
  const isCoach = role === "COACH";
  const isUser = role === "USER";
  const combinedMenuItems = [
    ...(isAdmin ? adminMenuItems : []),
    ...(isCoach ? coachMenuItems : isUser ? userMenuItems : []),
    ...generalMenuItems,
  ];

  return combinedMenuItems;
};
