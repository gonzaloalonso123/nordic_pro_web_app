import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingLink } from "@/components/ui/loading-link";
import { FileText, ListChecks } from "lucide-react";

export default function HomePage() {
  const baseUrl = `/app/admin/forms`;
  return (
    <div className="grid gap-6 md:grid-cols-2 container p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="h-5 w-5 mr-2" />
            Question Bank
          </CardTitle>
          <CardDescription>
            Create and manage your question library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Build a collection of reusable questions with different input types
            and earn experience points for each answer.
          </p>
        </CardContent>
        <CardFooter>
          <LoadingLink variant="default" href={`${baseUrl}/questions`} className="w-full">
            Manage Questions
          </LoadingLink>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Form Builder
          </CardTitle>
          <CardDescription>
            Create interactive forms with gamification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Build forms that engage users with images, sequential questions, and
            experience points for completing them.
          </p>
        </CardContent>
        <CardFooter>
          <LoadingLink variant="default" href={`${baseUrl}/forms`} className="w-full">
            Manage Forms
          </LoadingLink>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Program Builder
          </CardTitle>
          <CardDescription>
            Create groups of forms with a common purpose
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create sequences of forms that can be used to gather information
            about a specific topic.
          </p>
        </CardContent>
        <CardFooter>
          <LoadingLink variant="default" href={`${baseUrl}/programs`} className="w-full">
            Manage Programs
          </LoadingLink>
        </CardFooter>
      </Card>
    </div>
  );
}
