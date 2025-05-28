"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Plus, Trash2, Users, Building2 } from "lucide-react";

interface Team {
  id: string;
  name: string;
  coachEmail: string;
}

export default function OrganizationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "", coachEmail: "" },
  ]);

  const addTeam = () => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: "",
      coachEmail: "",
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    if (teams.length > 1) {
      setTeams(teams.filter((team) => team.id !== id));
    }
  };

  const updateTeam = (id: string, field: keyof Team, value: string) => {
    setTeams(
      teams.map((team) => (team.id === id ? { ...team, [field]: value } : team))
    );
  };

  const canProceedToStep2 = organizationName.trim().length > 0;
  const canFinish = teams.every(
    (team) => team.name.trim().length > 0 && team.coachEmail.trim().length > 0
  );

  const handleFinish = () => {
    console.log("Organization:", organizationName);
    console.log("Teams:", teams);
    alert(
      "Organization and teams created successfully! QR codes will be sent to coaches."
    );
  };

  const steps = [
    { number: 1, title: "Create Organization", icon: Building2 },
    { number: 2, title: "Create Teams", icon: Users },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.number
                    ? "bg-green-500 border-green-500 text-white"
                    : currentStep === step.number
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6" />
              Create Your Organization
            </CardTitle>
            <CardDescription>
              Give your organization a name to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Enter your organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className="px-8"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              Create Teams for {organizationName}
            </CardTitle>
            <CardDescription>
              Set up your teams with coaches. You can create more teams later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Each coach will receive a QR code via
                email that team members can use to sign up for their team.
              </p>
            </div>

            <div className="space-y-4">
              {teams.map((team, index) => (
                <div key={team.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Team {index + 1}</Badge>
                    {teams.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeam(team.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`team-name-${team.id}`}>Team Name</Label>
                      <Input
                        id={`team-name-${team.id}`}
                        placeholder="Enter team name"
                        value={team.name}
                        onChange={(e) =>
                          updateTeam(team.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`coach-email-${team.id}`}>
                        Coach Email
                      </Label>
                      <Input
                        id={`coach-email-${team.id}`}
                        type="email"
                        placeholder="coach@example.com"
                        value={team.coachEmail}
                        onChange={(e) =>
                          updateTeam(team.id, "coachEmail", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addTeam} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Team
            </Button>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleFinish}
                disabled={!canFinish}
                className="px-8"
              >
                Create Organization & Teams
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
