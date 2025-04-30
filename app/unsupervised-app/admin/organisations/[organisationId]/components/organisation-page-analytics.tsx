import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, BarChart3, TrendingUp, UserCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import flags from "@/flags.json";

export const OrganisationPageAnalytics = ({
  organisationId,
}: {
  organisationId: string;
}) => {
  const analytics = {
    activeUsers: Math.floor(Math.random() * 500) + 100,
    teamActivity: Math.floor(Math.random() * 85) + 15,
    growthRate: (Math.random() * 15 + 2).toFixed(1),
    totalSessions: Math.floor(Math.random() * 10000) + 1000,
  };
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Analytics Overview
        </h2>
        <Button variant="link" size="sm">
          <Link
            href={`${flags.current_app}/admin/organisations/${organisationId}/analytics`}
          >
            View Full Report
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {analytics.activeUsers}
              <UserCheck className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">↑ 12%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Team Activity</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {analytics.teamActivity}%
              <Activity className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">↑ 5%</span>{" "}
              engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {analytics.growthRate}%
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">↑ 3.2%</span> from
              previous quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {analytics.totalSessions.toLocaleString()}
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">↔ 0.8%</span> change
              from last week
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
