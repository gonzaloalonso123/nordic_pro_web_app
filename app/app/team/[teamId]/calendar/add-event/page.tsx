"use client";

import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Disclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormSelect } from "@/components/form/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateSelector } from "@/components/create-event/date-selector/date-selector";
import { addHours, addMinutes } from "date-fns";
import { useUrl } from "@/hooks/use-url";
import { LocationSelectorPopup } from "@/components/create-event/location-selector/location-selector-popup";
import { TeamUserSelectorPopup } from "@/components/create-event/team-user-selector/team-user-selector";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { triggerNotification } from "@/utils/notificationService";
import { Location } from "@/components/create-event/location-selector/types";

const eventTypeOptions = [
  { value: "TRAINING", label: "Training" },
  { value: "GAME", label: "Game" },
];

const AddTeamEventPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const path = useUrl();
  const { toast } = useToast();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dates, setDates] = useState<{
    timeToCome: string | null;
    startTime: string;
    endTime: string;
    dates: string[];
  }>({
    timeToCome: "17:00",
    startTime: "18:00",
    endTime: "20:00",
    dates: [new Date().toISOString().split("T")[0]],
  });
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [inviteFutureMembers, setInviteFutureMembers] = useState<boolean>(true);
  const { data: team, isPending: isTeamPending } = useClientData().teams.useWithUsers(teamId);
  const { data: calendar, isPending: isCalendarPending } = useClientData().calendars.useByTeam(teamId);
  const createEvent = useClientData().events.useCreate();
  const createInvitation = useClientData().eventsInvitation.useCreate();
  const sendEventsToCalendars = useClientData().calendars.useSendEventsToCalendars();
  const { user } = useCurrentUser();
  const { organisation } = useRole();
  const teamUsersWithoutMe = team?.users.filter((u: any) => u.user.id !== user?.id).filter((user: any) => user.role !== "COACH");

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
        setSelectedUsers(teamUsersWithoutMe.map((user: any) => user.user.id));
      }
    }
  };

  useEffect(() => {
    handleSelectAll();
  }, [team?.users]);

  const onLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCreateEvent = async (values: {
    name: string;
    description: string;
    type: string;
    invite_future_members: boolean;
  }) => {
    if (!calendar) {
      toast({
        title: "Error",
        description: "Team calendar not found",
        variant: "destructive",
      });
      return;
    }

    if (!dates.dates || dates.dates.length === 0) {
      toast({
        title: "Error",
        description: "Please set event date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const [startHours, startMinutes] = dates.startTime.split(":").map(Number);
      const [endHours, endMinutes] = dates.endTime.split(":").map(Number);
      const [timeToComeHours, timeToComeMinutes] = dates.timeToCome ? dates.timeToCome.split(":").map(Number) : [0, 0];

      const createdEventIds: string[] = [];

      for (const date of dates.dates) {
        let cleanDate = date.split("T")[0];
        const timeToCome = new Date(cleanDate);
        timeToCome.setHours(timeToComeHours, timeToComeMinutes);
        const startDate = addMinutes(addHours(new Date(cleanDate), startHours), startMinutes);
        const endDate = addMinutes(addHours(new Date(cleanDate), endHours), endMinutes);

        const event = await createEvent.mutateAsync({
          name: values.name,
          description: values.description,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          time_to_come: dates.timeToCome ? timeToCome.toISOString() : null,
          location_id: selectedLocation?.id,
          type: values.type,
          calendar_id: calendar.id,
          invite_future_members: inviteFutureMembers,
        });

        if (event) {
          createdEventIds.push(event.id);

          if (selectedUsers.length > 0) {
            await Promise.all(
              selectedUsers.map((userId) =>
                createInvitation.mutateAsync({
                  event_id: event.id,
                  user_id: userId,
                  description: values.description,
                })
              )
            );
          }

          await sendEventsToCalendars.mutateAsync({
            usersIds: selectedUsers,
            eventId: event.id,
            teamIds: [teamId],
          });
        }
      }

      // Notificación solo si hay usuarios seleccionados
      if (selectedUsers.length > 0) {
        await triggerNotification({
          recipientUserIds: selectedUsers.filter((id) => id !== user?.id),
          title: "New Event Invitation",
          body: `You have been invited to the event "${values.name}".`,
          tag: "event-invitation",
          url: `/app/team/${teamId}/dashboard`,
        });
      }

      toast({
        title: "Success",
        description: "Creation was successful",
      });

      router.push(`${path}/calendar`);
    } catch (err: any) {
      console.error("Error triggering new event invitation notification:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTeamPending || isCalendarPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4 pb-20 md:pb-4">
      <FormWrapper
        title={t("Add Event to Team")}
        onSubmit={handleCreateEvent}
        onBack={() => router.back()}
        showBackButton
      >
        {createEvent.isError && (
          <Disclaimer variant="error" title={t("Error")} description={createEvent.error.message} />
        )}
        {createEvent.isSuccess && (
          <Disclaimer variant="success" title={t("Success")} description={t("Event created successfully")} />
        )}
        <FormItemWrapper label={t("Event Name")} description={t("Enter a name for this event")} name="name">
          <Input placeholder={t("Event name")} />
        </FormItemWrapper>
        <FormItemWrapper
          label={t("Description")}
          description={t("Provide details about this event")}
          name="description"
        >
          <Textarea placeholder={t("Event description")} />
        </FormItemWrapper>
        <FormItemWrapper label={t("Event Type")} description={t("Select the type of event")} name="type">
          <FormSelect
            placeholder={t("Select event type")}
            options={eventTypeOptions.map((option) => ({
              value: option.value,
              label: t(option.label),
            }))}
          />
        </FormItemWrapper>
        <DateSelector dates={dates} setDates={setDates} />
        <LocationSelectorPopup
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
          organisationId={organisation.id}
        />
        {team?.users && team.users?.length > 0 && (
          <TeamUserSelectorPopup
            users={teamUsersWithoutMe}
            selectedUsers={selectedUsers}
            onToggleUser={handleToggleUser}
            onSelectAll={handleSelectAll}
            inviteFutureMembers={inviteFutureMembers}
            setInviteFutureMembers={setInviteFutureMembers}
          />
        )}

        <SubmitButton disabled={isSubmitting || createEvent.isPending || !dates.dates || dates.dates.length === 0}>
          {isSubmitting || createEvent.isPending ? t("Creating...") : t("Create")}
        </SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default AddTeamEventPage;
