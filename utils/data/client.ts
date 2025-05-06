"use client";

import * as userQueries from "@/hooks/queries/useUsers";
import * as organisationQueries from "@/hooks/queries/useOrganisations";
import * as teamQueries from "@/hooks/queries/useTeams";
import * as eventQueries from "@/hooks/queries/useEvents";
import * as calendarQueries from "@/hooks/queries/useCalendars";
import * as chatRoomQueries from "@/hooks/queries/useChatRooms";
import * as organisationsInvitationQueries from "@/hooks/queries/useOrganisationsInvitation";
import * as formQueries from "@/hooks/queries/useForms";
import * as questionQueries from "@/hooks/queries/useQuestions";
import * as formResponseQueries from "@/hooks/queries/useFormResponses";

import { createClient } from "../supabase/client";
import { useCallback } from "react";

export const useClientData = () => {
  const supabase = createClient();

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
      useAddMember: organisationQueries.useAddMemberToOrganisation,
      useRemoveMember: organisationQueries.useRemoveMemberFromOrganisation,
      useAddTeam: organisationQueries.useAddTeamToOrganisation,
      useRemoveTeam: organisationQueries.useRemoveTeamFromOrganisation,
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
      useAll: formQueries.useForms,
      useById: formQueries.useForm,
      useByCreator: formQueries.useFormsByCreator,
      useByOrganization: formQueries.useFormsByOrganization,
      useWithQuestions: formQueries.useFormWithQuestions,
      useResponses: formQueries.useFormResponses,
      // Mutations
      useCreate: formQueries.useCreateForm,
      useUpdate: formQueries.useUpdateForm,
      useDelete: formQueries.useDeleteForm,
      useAddQuestions: formQueries.useAddQuestionsToForm,
      useRemoveQuestion: formQueries.useRemoveQuestionFromForm,
      useUpdateQuestionOrder: formQueries.useUpdateQuestionOrder,
    },
    questions: {
      useAll: questionQueries.useQuestions,
      useById: questionQueries.useQuestion,
      useByCategory: questionQueries.useQuestionsByCategory,
      useByCreator: questionQueries.useQuestionsByCreator,
      useCategories: questionQueries.useCategories,
      // Mutations
      useCreate: questionQueries.useCreateQuestion,
      useUpdate: questionQueries.useUpdateQuestion,
      useDelete: questionQueries.useDeleteQuestion,
      useCreateCategory: questionQueries.useCreateCategory,
    },
    formResponses: {
      useByForm: formResponseQueries.useFormResponses,
      useByOrganization: formResponseQueries.useResponsesByOrganization,
      useByUser: formResponseQueries.useResponsesByUser,
      useById: formResponseQueries.useResponse,
      useAnalytics: formResponseQueries.useFormAnalytics,
      useUserAnalytics: formResponseQueries.useUserAnalytics,
      // Mutations
      useSubmit: formResponseQueries.useSubmitFormResponse,
      useDelete: formResponseQueries.useDeleteFormResponse,
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

    organisationsInvitation: {
      // Queries
      useAll: organisationsInvitationQueries.useOrganisationsInvitations,
      useById: organisationsInvitationQueries.useOrganisationInvitation,
      useByOrganisation: organisationsInvitationQueries.useOrganisationInvitationsByOrganisation,
      useByEmail: organisationsInvitationQueries.useOrganisationInvitationsByEmail,
      // Mutations
      useCreate: organisationsInvitationQueries.useCreateOrganisationInvitation,
      useUpdate: organisationsInvitationQueries.useUpdateOrganisationInvitation,
      useDelete: organisationsInvitationQueries.useDeleteOrganisationInvitation,
      useAccept: organisationsInvitationQueries.useAcceptOrganisationInvitation,
      useReject: organisationsInvitationQueries.useRejectOrganisationInvitation,
    },

    auth,
  };
};
