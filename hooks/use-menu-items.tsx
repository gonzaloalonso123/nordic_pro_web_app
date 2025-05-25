import flags from "@/flags.json";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  TrophyIcon,
  Clipboard,
  UserRoundCog,
} from "lucide-react";
import { useRole } from "@/app/app/(role-provider)/role-provider";

const root = flags.current_app;

const generalTeamMenuItems = (root: string) => [
  { name: "Calendar", href: `${root}/calendar`, icon: Calendar },
  { name: "Messages", href: `${root}/chat`, icon: MessageSquare },
];

const coachMenuItems = (root: string) => [
  { name: "Management", href: `${root}/management`, icon: Settings },
  { name: "Analytics", href: `${root}/analytics`, icon: BarChart3 },
  { name: "Forms", href: `${root}/forms`, icon: Clipboard },
];

const userMenuItems = (root: string) => [
  { name: "Dashboard", href: `${root}/dashboard`, icon: TrophyIcon },
];

const adminMenuItems = (root: string) => [
  { name: "Admin", href: `${root}/admin`, icon: UserRoundCog },
];

const organisationMenuItems = (root: string, orgId: string) => [
  {
    name: "Organisation",
    href: `${root}/organisation/${orgId}`,
    icon: Settings,
  },
];

export const useMenuItems = () => {
  const { app, organisation, team } = useRole();

  const rootUrl = root;

  if (app.role === "ADMIN") {
    return adminMenuItems(rootUrl);
  }

  if (organisation.role === "MANAGER") {
    return organisationMenuItems(root, organisation.id);
  }

  const isCoach = team.role === "COACH";
  const isUser = team.role === "PLAYER";

  const teamRoot = `${rootUrl}/team/${team.id}`;
  const generalItems = generalTeamMenuItems(teamRoot);
  const coachItems = coachMenuItems(teamRoot);
  const userItems = userMenuItems(teamRoot);

  const combinedMenuItems = [
    ...(isCoach ? coachItems : isUser ? userItems : []),
    ...generalItems,
  ];

  return combinedMenuItems;
};
