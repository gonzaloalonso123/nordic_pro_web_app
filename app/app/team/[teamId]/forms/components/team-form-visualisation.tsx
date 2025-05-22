"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/types/database.types";
import { useRouter } from "next/navigation";
import { getInitials } from "@/utils/get-initials";

type QuestionOption = Tables<"question_options">;

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

// Helper function to render different response types
const renderResponse = (response: QuestionResponse) => {
  const { response: value, questions } = response;

  switch (questions.input_type) {
    case "emoji":
      return <div className="text-2xl">{value as string}</div>;

    case "multiple":
      const selectedValues = value as string[];

      // If there are no options defined, fall back to simple display
      if (
        !questions.question_options ||
        questions.question_options.length === 0
      ) {
        return <Badge variant="outline">Option {selectedValues[0]}</Badge>;
      }

      return (
        <div className="space-y-1">
          {questions.question_options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <div
                key={option.id}
                className={`flex items-center py-1 px-2 rounded ${
                  isSelected ? "bg-primary/10 border-l-2 border-primary" : ""
                }`}
              >
                <div className="mr-2 flex-shrink-0">
                  {isSelected ? (
                    <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                  )}
                </div>
                <span
                  className={
                    isSelected ? "font-medium" : "text-muted-foreground"
                  }
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      );

    case "yesno":
      return (
        <Badge variant={value ? "success" : "destructive"}>
          {value ? "Yes" : "No"}
        </Badge>
      );

    case "slider":
      return (
        <div className="space-y-1">
          <Progress value={(value as number) * 20} className="h-2" />
          <div className="text-xs text-muted-foreground">{value}/5</div>
        </div>
      );

    default:
      return <div>{String(value)}</div>;
  }
};

export default function TeamFormVisualization({ data }: { data: FormData }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const totalInvitations = data.invitations.length;
  const completedInvitations = data.invitations.filter(
    (inv) => inv.completed
  ).length;
  const completionRate =
    totalInvitations > 0 ? (completedInvitations / totalInvitations) * 100 : 0;
  const toggleUserSelection = (userId: string, hasCompleted: boolean) => {
    if (hasCompleted) {
      setSelectedUserId(selectedUserId === userId ? null : userId);
    }
  };
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-1 h-8 w-8 md:h-9 md:w-9"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <span>{data.form.title}</span>
          </div>
          <Badge variant="outline" className="ml-2">
            {completedInvitations}/{totalInvitations} completed
          </Badge>
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          Created on {formatDate(data.form.created_at)}
        </div>
        <Progress value={completionRate} className="h-1.5 mt-2" />
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-3">
        <h3 className="text-sm font-medium">Team Members</h3>

        <div className="space-y-2">
          {data.invitations.map((invitation) => {
            const isSelected = selectedUserId === invitation.user_id;
            const hasResponded = invitation.completed;
            const hasResponseData =
              hasResponded &&
              invitation.response &&
              invitation.response.length > 0;
            const { first_name: firstName, last_name: lastName } = invitation.users;

            return (
              <div
                key={invitation.id}
                className="border rounded-md overflow-hidden"
              >
                <Button
                  variant="primary"
                  onClick={() =>
                    toggleUserSelection(invitation.user_id, hasResponded)
                  }
                  className="w-full bg-white"
                  disabled={!hasResponded}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials({ firstName, lastName })}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {firstName} {lastName}
                    </span>
                    {hasResponded ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {hasResponded &&
                    (isSelected ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </Button>

                {isSelected && hasResponseData && (
                  <div className="border-t" style={{ transition: "none" }}>
                    {invitation.response[0].question_responses.map(
                      (qr, index) => (
                        <div key={qr.id} className="px-3 py-2">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="text-sm font-medium">
                              {qr.questions.question}
                            </h4>
                            <Badge variant="outline" className="text-xs h-5">
                              {qr.questions.input_type}
                            </Badge>
                          </div>
                          <div className="ml-1 py-5">{renderResponse(qr)}</div>
                          {index <
                            invitation.response[0].question_responses.length -
                              1 && <Separator className="my-2" />}
                        </div>
                      )
                    )}

                    <div className="text-xs text-muted-foreground px-3 py-2 bg-muted/10">
                      Submitted:{" "}
                      {formatDate(invitation.response[0].submitted_at)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
