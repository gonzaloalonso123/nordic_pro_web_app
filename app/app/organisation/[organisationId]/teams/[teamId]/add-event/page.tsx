"use client";

import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { Disclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormSelect } from "@/components/form/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TeamUserSelector } from "./components/team-user-selector";

const eventTypeOptions = [
  { value: "TRAINING", label: "Training" },
  { value: "GAME", label: "Game" },
];

const AddTeamEventPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const organisationId = params.organisationId as string;
  const { toast } = useToast();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: team } = useClientData().teams.useWithUsers(teamId);
  const { data: calendar } = useClientData().calendars.useByTeam(teamId);
  const createEvent = useClientData().events.useCreate();
  const createInvitation = useClientData().eventsInvitation.useCreate();
  const sendEventsToCalendars =
    useClientData().calendars.useSendEventsToCalendars();

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (team?.users && team.users.length > 0) {
      if (selectedUsers.length === team.users.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(team.users.map((user: any) => user.user.id));
      }
    }
  };

  const handleCreateEvent = async (values: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    type: string;
  }) => {
    if (!calendar) {
      toast({
        title: "Error",
        description: "Team calendar not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const startDate = new Date(values.start_date);
      const endDate = new Date(values.end_date);
      const event = await createEvent.mutateAsync({
        name: values.name,
        description: values.description,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        type: values.type,
        calendar_id: calendar.id,
      });
      if (selectedUsers.length > 0 && event) {
        const invitationPromises = Promise.all(
          selectedUsers.map((userId) =>
            createInvitation.mutateAsync({
              event_id: event.id,
              user_id: userId,
              description: values.description,
            })
          )
        );
        await invitationPromises;

        await sendEventsToCalendars.mutateAsync({
          usersIds: selectedUsers,
          eventId: event.id,
          teamIds: [teamId],
        });

        toast({
          title: "Success",
          description: `Event created and ${selectedUsers.length} invitations sent`,
        });
      } else {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      router.push(
        `${flags.current_app}/organisation/${organisationId}/teams/${teamId}`
      );
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4 pb-20 md:pb-4">
      <FormWrapper
        title={t("Add Event to Team")}
        onSubmit={handleCreateEvent}
        onBack={() => router.back()}
        showBackButton
      >
        {createEvent.isError && (
          <Disclaimer
            variant="error"
            title={t("Error")}
            description={createEvent.error.message}
          />
        )}
        {createEvent.isSuccess && (
          <Disclaimer
            variant="success"
            title={t("Success")}
            description={t("Event created successfully")}
          />
        )}

        <FormItemWrapper
          label={t("Event Name")}
          description={t("Enter a name for this event")}
          name="name"
        >
          <Input placeholder={t("Event name")} />
        </FormItemWrapper>

        <FormItemWrapper
          label={t("Description")}
          description={t("Provide details about this event")}
          name="description"
        >
          <Textarea placeholder={t("Event description")} />
        </FormItemWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItemWrapper
            label={t("Start Date & Time")}
            description={t("When does the event start")}
            name="start_date"
          >
            <Input type="datetime-local" />
          </FormItemWrapper>

          <FormItemWrapper
            label={t("End Date & Time")}
            description={t("When does the event end")}
            name="end_date"
          >
            <Input type="datetime-local" />
          </FormItemWrapper>
        </div>

        <FormItemWrapper
          label={t("Event Type")}
          description={t("Select the type of event")}
          name="type"
        >
          <FormSelect
            placeholder={t("Select event type")}
            options={eventTypeOptions.map((option) => ({
              value: option.value,
              label: t(option.label),
            }))}
          />
        </FormItemWrapper>

        {team?.users && team.users?.length > 0 && (
          <TeamUserSelector
            users={team.users}
            selectedUsers={selectedUsers}
            onToggleUser={handleToggleUser}
            onSelectAll={handleSelectAll}
          />
        )}

        <SubmitButton disabled={isSubmitting || createEvent.isPending}>
          {isSubmitting || createEvent.isPending
            ? t("Creating...")
            : t("Create Event")}
        </SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default AddTeamEventPage;
