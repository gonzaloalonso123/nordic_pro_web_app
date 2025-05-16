import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type EventCalendarRow = Tables<"events_calendars">;
type EventCalendarInsert = TablesInsert<"events_calendars">;
type EventCalendarUpdate = TablesUpdate<"events_calendars">;

export const eventsCalendarsService = {
  async addEventToCalendar(
    supabase: SupabaseClient<Database>,
    eventCalendar: EventCalendarInsert
  ): Promise<EventCalendarRow | null> {
    const { data, error } = await supabase
      .from("events_calendars")
      .insert([eventCalendar])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async removeEventFromCalendar(
    supabase: SupabaseClient<Database>,
    eventCalendarId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("events_calendars")
      .delete()
      .eq("id", eventCalendarId);
    if (error) throw error;
    return true;
  },
};
