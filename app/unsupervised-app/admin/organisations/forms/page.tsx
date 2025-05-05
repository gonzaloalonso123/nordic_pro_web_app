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
import ExperienceProgress from "@/components/form-builder/experience-progress";

export default function HomePage() {
  return (
    <div className="container">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Interactive Form Builder System
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Create, manage, and gamify forms with experience points and
          interactive elements
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-10">
        <ExperienceProgress />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
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
              Build a collection of reusable questions with different input
              types and earn experience points for each answer.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/unsupervised-app/admin/organisations/forms/questions"
              className="w-full"
            >
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
              Build forms that engage users with images, sequential questions,
              and experience points for completing them.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/unsupervised-app/admin/organisations/forms/forms"
              className="w-full"
            >
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
            <CardDescription>
              Engage users with experience points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Make form completion exciting with experience points, progress
              tracking, and visual rewards for users.
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link
              href="/unsupervised-app/admin/organisations/forms/questions/create"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                Create Question
              </Button>
            </Link>
            <Link
              href="/unsupervised-app/admin/organisations/forms/forms/create"
              className="flex-1"
            >
              <Button className="w-full">Create Form</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
