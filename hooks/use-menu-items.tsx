import flags from "@/flags.json";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  TrophyIcon,
  UserRoundCog,
} from "lucide-react";
import { useRole } from "@/app/app/(role-provider)/role-provider";

const root = flags.current_app;

const generalTeamMenuItems = [
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

const organisationMenuItems = [
  { name: "Organisation", href: `${root}/organisation`, icon: Settings },
];

export const useMenuItems = () => {
  const { app, organisation, team } = useRole();

  if (app.role === "ADMIN") {
    return adminMenuItems;
  }

  if (organisation.role === "MANAGER") {
    return organisationMenuItems;
  }

  const isCoach = team.role === "COACH";
  const isUser = team.role === "PLAYER";

  const combinedMenuItems = [
    ...(isCoach ? coachMenuItems : isUser ? userMenuItems : []),
    ...generalTeamMenuItems,
  ];

  return combinedMenuItems;
};
