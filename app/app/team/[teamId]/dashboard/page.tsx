"use client";

import type React from "react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Content } from "@/components/content";
import { FormInvitations } from "./components/form-invitations";
import { RewardOverview } from "./components/reward-overview";
import AccountSetupCard from "@/components/onboarding/account-setup-card";

export default function DashboardPage() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF4500", "#FF6347"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <Content>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Track your progress, earn trophies, and continue your journey!
      </p>

      <AccountSetupCard />
      <div className="lg:col-span-2 pb-4">
        <FormInvitations />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
        <RewardOverview />
      </div>
    </Content>
  );
}
