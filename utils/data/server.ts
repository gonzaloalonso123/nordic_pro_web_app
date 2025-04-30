import * as services from "../supabase/services";
import { createClient } from "../supabase/server";

// Add this to the serverData object
export const serverData = {
  users: {
    getAll: async () => {
      const supabase = await createClient();
      return services.usersService.getAll(supabase);
    },
    getById: async (userId: string) => {
      const supabase = await createClient();
      return services.usersService.getById(supabase, userId);
    },
    getByOrganisation: async (organisationId: string) => {
      const supabase = await createClient();
      return services.usersService.getByOrganisation(supabase, organisationId);
    },
    getByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.usersService.getByTeam(supabase, teamId);
    },
    getWithTeams: async (userId: string) => {
      const supabase = await createClient();
      return services.usersService.getWithTeams(supabase, userId);
    },
    getWithOrganisations: async (userId: string) => {
      const supabase = await createClient();
      return services.usersService.getWithOrganisations(supabase, userId);
    },
    create: async (
      user: Parameters<typeof services.usersService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.usersService.create(supabase, user);
    },
    update: async (
      userId: string,
      updates: Parameters<typeof services.usersService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.usersService.update(supabase, userId, updates);
    },
    softDelete: async (userId: string) => {
      const supabase = await createClient();
      return services.usersService.softDelete(supabase, userId);
    },
    hardDelete: async (userId: string) => {
      const supabase = await createClient();
      return services.usersService.hardDelete(supabase, userId);
    },
  },

  organisations: {
    getAll: async () => {
      const supabase = await createClient();
      return services.organisationsService.getAll(supabase);
    },
    getById: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getById(supabase, organisationId);
    },
    getByUser: async (userId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getByUser(supabase, userId);
    },
    getByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getByTeam(supabase, teamId);
    },
    getWithTeams: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getWithTeams(
        supabase,
        organisationId
      );
    },
    getWithUsers: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getWithUsers(
        supabase,
        organisationId
      );
    },
    getWithCalendar: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsService.getWithCalendar(
        supabase,
        organisationId
      );
    },
    create: async (
      organisation: Parameters<typeof services.organisationsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.organisationsService.create(supabase, organisation);
    },
    update: async (
      organisationId: string,
      updates: Parameters<typeof services.organisationsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.organisationsService.update(
        supabase,
        organisationId,
        updates
      );
    },
    delete: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsService.delete(supabase, organisationId);
    },
    addMember: async (organisationId: string, userId: string) => {
      const supabase = await createClient();
      return services.organisationsService.addMember(
        supabase,
        organisationId,
        userId,
        "USER"
      );
    },
    removeMember: async (organisationId: string, userId: string) => {
      const supabase = await createClient();
      return services.organisationsService.removeMember(
        supabase,
        organisationId,
        userId
      );
    },
    addTeam: async (organisationId: string, teamId: string) => {
      const supabase = await createClient();
      return services.organisationsService.addTeam(
        supabase,
        organisationId,
        teamId
      );
    },
    removeTeam: async (organisationId: string, teamId: string) => {
      const supabase = await createClient();
      return services.organisationsService.removeTeam(
        supabase,
        organisationId,
        teamId
      );
    },
  },

  teams: {
    getAll: async () => {
      const supabase = await createClient();
      return services.teamsService.getAll(supabase);
    },
    getById: async (teamId: string) => {
      const supabase = await createClient();
      return services.teamsService.getById(supabase, teamId);
    },
    getByUser: async (userId: string) => {
      const supabase = await createClient();
      return services.teamsService.getByUser(supabase, userId);
    },
    getByOrganisation: async (organisationId: string) => {
      const supabase = await createClient();
      return services.teamsService.getByOrganisation(supabase, organisationId);
    },
    getWithUsers: async (teamId: string) => {
      const supabase = await createClient();
      return services.teamsService.getWithUsers(supabase, teamId);
    },
    getWithOrganisations: async (teamId: string) => {
      const supabase = await createClient();
      return services.teamsService.getWithOrganisations(supabase, teamId);
    },
    getWithCalendar: async (teamId: string) => {
      const supabase = await createClient();
      return services.teamsService.getWithCalendar(supabase, teamId);
    },
    create: async (
      team: Parameters<typeof services.teamsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.teamsService.create(supabase, team);
    },
    update: async (
      teamId: string,
      updates: Parameters<typeof services.teamsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.teamsService.update(supabase, teamId, updates);
    },
    delete: async (teamId: string) => {
      const supabase = await createClient();
      return services.teamsService.delete(supabase, teamId);
    },
  },

  events: {
    getAll: async () => {
      const supabase = await createClient();
      return services.eventsService.getAll(supabase);
    },
    getById: async (eventId: string) => {
      const supabase = await createClient();
      return services.eventsService.getById(supabase, eventId);
    },
    getByCalendar: async (calendarId: string) => {
      const supabase = await createClient();
      return services.eventsService.getByCalendar(supabase, calendarId);
    },
    getByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.eventsService.getByTeam(supabase, teamId);
    },
    getByOrganisation: async (organisationId: string) => {
      const supabase = await createClient();
      return services.eventsService.getByOrganisation(supabase, organisationId);
    },
    getUpcomingByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.eventsService.getUpcomingByTeam(supabase, teamId);
    },
    getPastByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.eventsService.getPastByTeam(supabase, teamId);
    },
    getByTypeAndTeam: async (eventType: string, teamId: string) => {
      const supabase = await createClient();
      return services.eventsService.getByTypeAndTeam(
        supabase,
        eventType,
        teamId
      );
    },
    getWithAttendance: async (eventId: string) => {
      const supabase = await createClient();
      return services.eventsService.getWithAttendance(supabase, eventId);
    },
    getWithRoster: async (eventId: string) => {
      const supabase = await createClient();
      return services.eventsService.getWithRoster(supabase, eventId);
    },
    create: async (
      event: Parameters<typeof services.eventsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.eventsService.create(supabase, event);
    },
    update: async (
      eventId: string,
      updates: Parameters<typeof services.eventsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.eventsService.update(supabase, eventId, updates);
    },
    delete: async (eventId: string) => {
      const supabase = await createClient();
      return services.eventsService.delete(supabase, eventId);
    },
  },

  calendars: {
    getAll: async () => {
      const supabase = await createClient();
      return services.calendarsService.getAll(supabase);
    },
    getById: async (calendarId: string) => {
      const supabase = await createClient();
      return services.calendarsService.getById(supabase, calendarId);
    },
    getByTeam: async (teamId: string) => {
      const supabase = await createClient();
      return services.calendarsService.getByTeam(supabase, teamId);
    },
    getByOrganisation: async (organisationId: string) => {
      const supabase = await createClient();
      return services.calendarsService.getByOrganisation(
        supabase,
        organisationId
      );
    },
    getWithEvents: async (calendarId: string) => {
      const supabase = await createClient();
      return services.calendarsService.getWithEvents(supabase, calendarId);
    },
    create: async (
      calendar: Parameters<typeof services.calendarsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.calendarsService.create(supabase, calendar);
    },
    update: async (
      calendarId: string,
      updates: Parameters<typeof services.calendarsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.calendarsService.update(supabase, calendarId, updates);
    },
    delete: async (calendarId: string) => {
      const supabase = await createClient();
      return services.calendarsService.delete(supabase, calendarId);
    },
  },

  forms: {
    getAll: async () => {
      const supabase = await createClient();
      return services.formsService.getAll(supabase);
    },
    getById: async (formId: string) => {
      const supabase = await createClient();
      return services.formsService.getById(supabase, formId);
    },
    getByUser: async (userId: string) => {
      const supabase = await createClient();
      return services.formsService.getByUser(supabase, userId);
    },
    getByEvent: async (eventId: string) => {
      const supabase = await createClient();
      return services.formsService.getByEvent(supabase, eventId);
    },
    create: async (
      form: Parameters<typeof services.formsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.formsService.create(supabase, form);
    },
    update: async (
      formId: string,
      updates: Parameters<typeof services.formsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.formsService.update(supabase, formId, updates);
    },
    softDelete: async (formId: string) => {
      const supabase = await createClient();
      return services.formsService.softDelete(supabase, formId);
    },
    hardDelete: async (formId: string) => {
      const supabase = await createClient();
      return services.formsService.hardDelete(supabase, formId);
    },
  },

  chatRooms: {
    getAll: async () => {
      const supabase = await createClient();
      return services.chatRoomsService.getAll(supabase);
    },
    getById: async (chatRoomId: string) => {
      const supabase = await createClient();
      return services.chatRoomsService.getById(supabase, chatRoomId);
    },
    getByUser: async (userId: string) => {
      const supabase = await createClient();
      return services.chatRoomsService.getByUser(supabase, userId);
    },
    getWithMessages: async (chatRoomId: string) => {
      const supabase = await createClient();
      return services.chatRoomsService.getWithMessages(supabase, chatRoomId);
    },
    getWithUsers: async (chatRoomId: string) => {
      const supabase = await createClient();
      return services.chatRoomsService.getWithUsers(supabase, chatRoomId);
    },
    create: async (
      chatRoom: Parameters<typeof services.chatRoomsService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.chatRoomsService.create(supabase, chatRoom);
    },
    update: async (
      chatRoomId: string,
      updates: Parameters<typeof services.chatRoomsService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.chatRoomsService.update(supabase, chatRoomId, updates);
    },
    delete: async (chatRoomId: string) => {
      const supabase = await createClient();
      return services.chatRoomsService.delete(supabase, chatRoomId);
    },
  },

  organisationsInvitation: {
    getAll: async () => {
      const supabase = await createClient();
      return services.organisationsInvitationService.getAll(supabase);
    },
    getById: async (invitationId: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.getById(supabase, invitationId);
    },
    getByOrganisation: async (organisationId: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.getByOrganisation(supabase, organisationId);
    },
    getByEmail: async (email: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.getByEmail(supabase, email);
    },
    create: async (
      invitation: Parameters<typeof services.organisationsInvitationService.create>[1]
    ) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.create(supabase, invitation);
    },
    update: async (
      invitationId: string,
      updates: Parameters<typeof services.organisationsInvitationService.update>[2]
    ) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.update(supabase, invitationId, updates);
    },
    delete: async (invitationId: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.deleteInvitation(supabase, invitationId);
    },
    accept: async (invitationId: string, userId: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.acceptInvitation(supabase, invitationId, userId);
    },
    reject: async (invitationId: string) => {
      const supabase = await createClient();
      return services.organisationsInvitationService.rejectInvitation(supabase, invitationId);
    },
  },

  auth: {
    getCurrentUser: async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    getCurrentSession: async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  },
};
