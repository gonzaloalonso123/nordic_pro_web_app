"use client";

import * as userQueries from "@/hooks/queries/useUsers";
import * as organisationQueries from "@/hooks/queries/useOrganisations";
import * as teamQueries from "@/hooks/queries/useTeams";
import * as eventQueries from "@/hooks/queries/useEvents";
import * as calendarQueries from "@/hooks/queries/useCalendars";
import * as organisationsInvitationQueries from "@/hooks/queries/useOrganisationsInvitation";
import * as formQueries from "@/hooks/queries/useForms";
import * as questionQueries from "@/hooks/queries/useQuestions";
import * as formResponseQueries from "@/hooks/queries/useFormResponses";
import * as eventsInvitationQueries from "@/hooks/queries/useEventsInvitation";
import * as formInvitationQueries from "@/hooks/queries/useFormInvitations";
import * as avatarsQueries from "@/hooks/queries/useAvatars";
import * as locationQueries from "@/hooks/queries/useLocations";
import { useCallback } from "react";
import { supabase } from "../supabase/client";

export const useClientData = () => {
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
      useByIds: userQueries.useUserByIds,
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
      useAddMember: teamQueries.useAddUserToTeam,
      useUpdateUserInTeam: teamQueries.useUpdateUserInTeam,
      useRemoveMember: teamQueries.useRemoveUserFromTeam,
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
      useByOrganisationId: eventQueries.useEventsByOrganisationId,
      useByTeamId: eventQueries.useEventsByTeamId,
      useByUserId: eventQueries.useEventsByUserId,
      // Mutations
      useCreate: eventQueries.useCreateEvent,
      useUpdate: eventQueries.useUpdateEvent,
      useDelete: eventQueries.useDeleteEvent,
      useAddToCalendar: eventQueries.useAddEventToCalendar,
      useRemoveFromCalendar: eventQueries.useRemoveEventFromCalendar,
    },

    calendars: {
      // Queries
      useAll: calendarQueries.useCalendars,
      useById: calendarQueries.useCalendar,
      useByTeam: calendarQueries.useCalendarByTeam,
      useByOrganisation: calendarQueries.useCalendarByOrganisation,
      useByUser: calendarQueries.useCalendarByUser,
      useWithEvents: calendarQueries.useCalendarWithEvents,
      useCreate: calendarQueries.useCreateCalendar,
      useUpdate: calendarQueries.useUpdateCalendar,
      useDelete: calendarQueries.useDeleteCalendar,
      useSendEventsToCalendars: calendarQueries.useSendEventsToCalendars,
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
      useAcceptQrType: organisationsInvitationQueries.useQrCodeInvitationAccept,
      useReject: organisationsInvitationQueries.useRejectOrganisationInvitation,
    },

    eventsInvitation: {
      useAll: eventsInvitationQueries.useEventsInvitations,
      useById: eventsInvitationQueries.useEventInvitation,
      useByEvent: eventsInvitationQueries.useEventInvitationsByEvent,
      useByUser: eventsInvitationQueries.useEventInvitationsByUser,
      useByEventAndUser: eventsInvitationQueries.useEventInvitationByEventAndUser,
      useWithUserDetails: eventsInvitationQueries.useEventInvitationWithUserDetails,
      // Mutations
      useCreate: eventsInvitationQueries.useCreateEventInvitation,
      useUpdate: eventsInvitationQueries.useUpdateEventInvitation,
      useDelete: eventsInvitationQueries.useDeleteEventInvitation,
      useBulkCreate: eventsInvitationQueries.useBulkCreateEventInvitations,
    },
    formInvitations: {
      useAll: formInvitationQueries.useFormInvitations,
      useById: formInvitationQueries.useFormInvitation,
      useByForm: formInvitationQueries.useFormInvitationsByForm,
      useByUser: formInvitationQueries.useFormInvitationsByUser,
      useByFormAndUser: formInvitationQueries.useFormInvitationByFormAndUser,
      useByTeam: formInvitationQueries.useFormInvitationsByTeam,
      // Mutations
      useCreate: formInvitationQueries.useCreateFormInvitation,
      useUpdate: formInvitationQueries.useUpdateFormInvitation,
      useDelete: formInvitationQueries.useDeleteFormInvitation,
      useBulkCreate: formInvitationQueries.useBulkCreateFormInvitations,
      useSendToTeam: formInvitationQueries.useSendInvitationsToTeam,
      useSendToUsers: formInvitationQueries.useSendInvitationsToUsers,
    },
    locations: {
      useAll: locationQueries.useLocations,
      useById: locationQueries.useLocation,
      useByOrganisation: locationQueries.useLocationsByOrganisation,
      useCreate: locationQueries.useCreateLocation,
      useUpdate: locationQueries.useUpdateLocation,
      useDelete: locationQueries.useDeleteLocation,
    },
    avatars: {
      useUpload: avatarsQueries.useUploadAvatar,
    },
    auth,
  };
};
