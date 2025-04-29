"use client";

import * as userQueries from "@/hooks/queries/useUsers";
import * as organisationQueries from "@/hooks/queries/useOrganisations";
import * as teamQueries from "@/hooks/queries/useTeams";
import * as eventQueries from "@/hooks/queries/useEvents";
import * as calendarQueries from "@/hooks/queries/useCalendars";
import * as formQueries from "@/hooks/queries/useForms";
import * as chatRoomQueries from "@/hooks/queries/useChatRooms";
import useSupabaseBrowser from "../supabase/client";
import { useCallback } from "react";

export const useClientData = () => {
  const supabase = useSupabaseBrowser();

  const auth = {
    getCurrentUser: useCallback(async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }, [supabase]),
    getCurrentSession: useCallback(async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }, [supabase]),
    signOut: useCallback(async () => {
      return await supabase.auth.signOut();
    }, [supabase]),
  };

  return {
    users: {
      useAll: userQueries.useUsers,
      useById: userQueries.useUser,
      useByOrganisation: userQueries.useUsersByOrganisation,
      useByTeam: userQueries.useUsersByTeam,
      useWithTeams: userQueries.useUserWithTeams,
      useWithOrganisations: userQueries.useUserWithOrganisations,
      // Mutations
      useCreate: userQueries.useCreateUser,
      useUpdate: userQueries.useUpdateUser,
      useSoftDelete: userQueries.useSoftDeleteUser,
    },

    organisations: {
      useAll: organisationQueries.useOrganisations,
      useById: organisationQueries.useOrganisation,
      useByUser: organisationQueries.useOrganisationsByUser,
      useByTeam: organisationQueries.useOrganisationsByTeam,
      useWithTeams: organisationQueries.useOrganisationWithTeams,
      useWithUsers: organisationQueries.useOrganisationWithUsers,
      useWithCalendar: organisationQueries.useOrganisationWithCalendar,
      // Mutations
      useCreate: organisationQueries.useCreateOrganisation,
      useUpdate: organisationQueries.useUpdateOrganisation,
      useDelete: organisationQueries.useDeleteOrganisation,
    },

    teams: {
      useAll: teamQueries.useTeams,
      useById: teamQueries.useTeam,
      useByUser: teamQueries.useTeamsByUser,
      useByOrganisation: teamQueries.useTeamsByOrganisation,
      useWithUsers: teamQueries.useTeamWithUsers,
      useWithOrganisations: teamQueries.useTeamWithOrganisations,
      useWithCalendar: teamQueries.useTeamWithCalendar,
      // Mutations
      useCreate: teamQueries.useCreateTeam,
      useUpdate: teamQueries.useUpdateTeam,
      useDelete: teamQueries.useDeleteTeam,
    },

    events: {
      useAll: eventQueries.useEvents,
      useById: eventQueries.useEvent,
      useByTeam: eventQueries.useEventsByTeam,
      useUpcomingByTeam: eventQueries.useUpcomingEventsByTeam,
      usePastByTeam: eventQueries.usePastEventsByTeam,
      useByTypeAndTeam: eventQueries.useEventsByTypeAndTeam,
      useWithAttendance: eventQueries.useEventWithAttendance,
      useWithRoster: eventQueries.useEventWithRoster,
      // Mutations
      useCreate: eventQueries.useCreateEvent,
      useUpdate: eventQueries.useUpdateEvent,
      useDelete: eventQueries.useDeleteEvent,
    },

    calendars: {
      // Queries
      useAll: calendarQueries.useCalendars,
      useById: calendarQueries.useCalendar,
      useByTeam: calendarQueries.useCalendarByTeam,
      useByOrganisation: calendarQueries.useCalendarByOrganisation,
      useWithEvents: calendarQueries.useCalendarWithEvents,
      // Mutations
      useCreate: calendarQueries.useCreateCalendar,
      useUpdate: calendarQueries.useUpdateCalendar,
      useDelete: calendarQueries.useDeleteCalendar,
    },

    forms: {
      // Queries
      useAll: formQueries.useForms,
      useById: formQueries.useForm,
      useByUser: formQueries.useFormsByUser,
      useByEvent: formQueries.useFormsByEvent,
      // Mutations
      useCreate: formQueries.useCreateForm,
      useUpdate: formQueries.useUpdateForm,
      useSoftDelete: formQueries.useSoftDeleteForm,
      useHardDelete: formQueries.useHardDeleteForm,
    },

    chatRooms: {
      // Queries
      useAll: chatRoomQueries.useChatRooms,
      useById: chatRoomQueries.useChatRoom,
      useByUser: chatRoomQueries.useChatRoomsByUser,
      useWithMessages: chatRoomQueries.useChatRoomWithMessages,
      useWithUsers: chatRoomQueries.useChatRoomWithUsers,
      // Mutations
      useCreate: chatRoomQueries.useCreateChatRoom,
      useUpdate: chatRoomQueries.useUpdateChatRoom,
      useDelete: chatRoomQueries.useDeleteChatRoom,
    },

    auth,
  };
};
