import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type CalendarRow = Tables<"calendars">;
type CalendarInsert = TablesInsert<"calendars">;
type CalendarUpdate = TablesUpdate<"calendars">;

export const calendarsService = {

  async getAll(supabase: SupabaseClient<Database>): Promise<CalendarRow[]> {
    const { data, error } = await supabase.from("calendars").select("*");

    if (error) throw error;
    return data || [];
  },

  async getById(supabase: SupabaseClient<Database>, calendarId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase.from("calendars").select("*").eq("id", calendarId).single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("team_id", teamId)
      .eq("entity_type", "TEAM")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByOrganisation(supabase: SupabaseClient<Database>, organisationId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("organisation_id", organisationId)
      .eq("entity_type", "ORGANISATION")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<CalendarRow[]> {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("user_id", userId)
      .eq("entity_type", "USER");
    if (error && error.code !== "PGRST116") throw error;
    return data || [];
  },

  async sendEventsToCalendars(
    supabase: SupabaseClient<Database>,
    calendars: {
      usersIds?: string[];
      teamIds?: string[];
      organisationIds?: [];
      eventId: string;
    }
  ): Promise<boolean> {
    const { usersIds, teamIds, organisationIds, eventId } = calendars;

    console.log(usersIds, teamIds, organisationIds);
    const allUserCalendars = await Promise.all(
      (usersIds ?? []).map(async (userId) => {
        return await calendarsService.getByUser(supabase, userId);
      })
    );
    const allTeamCalendars = await Promise.all(
      (teamIds ?? []).map(async (teamId) => {
        return await calendarsService.getByTeam(supabase, teamId);
      })
    );
    const allOrganisationCalendars = await Promise.all(
      (organisationIds ?? []).map(async (organisationId) => {
        return await calendarsService.getByOrganisation(supabase, organisationId);
      })
    );
    const allCalendars = [...allUserCalendars, ...allTeamCalendars, ...allOrganisationCalendars];
    const allCalendarsIds = allCalendars.flatMap((calendars) =>
      (Array.isArray(calendars) ? calendars : [calendars])
        .filter((cal): cal is CalendarRow => cal !== null)
        .map((calendar) => calendar.id)
    );
    const { data, error } = await supabase.from("events_calendars").insert(
      allCalendarsIds.map((calendarId) => {
        return {
          calendar_id: calendarId,
          event_id: eventId,
        };
      })
    );
    if (error) throw error;
    return true;
  },

  async create(supabase: SupabaseClient<Database>, calendar: CalendarInsert): Promise<CalendarRow> {
    const { data, error } = await supabase.from("calendars").insert(calendar).select().single();

    if (error) throw error;
    return data;
  },

  async update(supabase: SupabaseClient<Database>, calendarId: string, updates: CalendarUpdate): Promise<CalendarRow> {
    const { data, error } = await supabase.from("calendars").update(updates).eq("id", calendarId).select().single();

    if (error) throw error;
    return data;
  },

  async delete(supabase: SupabaseClient<Database>, calendarId: string): Promise<boolean> {
    const { error } = await supabase.from("calendars").delete().eq("id", calendarId);

    if (error) throw error;
    return true;
  },

  async getWithEvents(supabase: SupabaseClient<Database>, calendarId: string): Promise<any> {
    const { data, error } = await supabase
      .from("calendars")
      .select(
        `
        *,
        events(*)
      `
      )
      .eq("id", calendarId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
};
