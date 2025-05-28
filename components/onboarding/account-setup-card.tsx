"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, UserCog } from "lucide-react";

export default function AccountSetupCard() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserCog className="w-6 h-6" />
          Complete Your Profile
        </CardTitle>
        <CardDescription>
          Finish setting up your account to unlock all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>+50 Experience Points</span>
            </div>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Continue Setup
        </Button>
      </CardContent>
    </Card>
  );
}
