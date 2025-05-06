import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FileText, ListChecks, Award, Smartphone } from "lucide-react";

export default function HomePage() {
  const baseUrl = `/unsupervised-app/admin/forms`;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <Link href={`${baseUrl}/questions`} className="w-full">
            <Button className="w-full">Manage Questions</Button>
          </Link>
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
          <Link href={`${baseUrl}/forms`} className="w-full">
            <Button className="w-full">Manage Forms</Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Gamification
          </CardTitle>
          <CardDescription>Engage users with experience points</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Make form completion exciting with experience points, progress
            tracking, and visual rewards for users.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href={`${baseUrl}/questions.create`} className="flex-1">
            <Button variant="outline" className="w-full">
              Create Question
            </Button>
          </Link>
          <Link href={`${baseUrl}/forms/create`} className="flex-1">
            <Button className="w-full">Create Form</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
