"use client";

import type React from "react";
import { Content } from "@/components/content";
import { FormInvitations } from "./components/form-invitations";
import { RewardOverview } from "./components/reward-overview";
import { useHeader } from "@/hooks/useHeader";
import { useClientData } from "@/utils/data/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NextEventCard from "./components/next-event-card";
import { FormCompletionStreak } from "./components/form-completion-streak";
import { DashboardSkeleton } from "@/components/ui/loading-skeletons";

export default function DashboardPage() {
  const { useHeaderConfig } = useHeader();
  useHeaderConfig({ centerContent: "Dashboard" });
  const { user } = useCurrentUser();
  const { data: events, isPaused: eventsPending } = useClientData().events.useByUserId(user?.id as string);
  const { data: formInvitations, isPending: invitationsPending } = useClientData().formInvitations.useByUser(
    user?.id as string
  );

  // useEffect(() => {
  //   const duration = 3 * 1000;
  //   const animationEnd = Date.now() + duration;
  //   const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  //   const randomInRange = (min: number, max: number) => {
  //     return Math.random() * (max - min) + min;
  //   };

  //   const interval = setInterval(() => {
  //     const timeLeft = animationEnd - Date.now();

  //     if (timeLeft <= 0) {
  //       return clearInterval(interval);
  //     }

  //     const particleCount = 50 * (timeLeft / duration);

  //     confetti({
  //       ...defaults,
  //       particleCount,
  //       origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
  //       colors: ["#FFD700", "#FFA500", "#FF4500", "#FF6347"],
  //     });
  //     confetti({
  //       ...defaults,
  //       particleCount,
  //       origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
  //       colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B"],
  //     });
  //   }, 250);

  //   return () => clearInterval(interval);
  // }, []);

  if (eventsPending || invitationsPending) {
    return Array.from({ length: 4 }, (_, index) => <DashboardSkeleton key={index} />);
  }

  return (
    <Content>
      <div className="flex flex-col gap-8">
        <FormInvitations formInvitations={formInvitations || []} />
        <NextEventCard events={events || []} />
        <RewardOverview />
        <FormCompletionStreak formInvitations={formInvitations || []} />
      </div>
    </Content>
  );
}
