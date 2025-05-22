export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      calendars: {
        Row: {
          entity_type: string;
          id: string;
          organisation_id: string | null;
          team_id: string | null;
          user_id: string | null;
        };
        Insert: {
          entity_type: string;
          id?: string;
          organisation_id?: string | null;
          team_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          entity_type?: string;
          id?: string;
          organisation_id?: string | null;
          team_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "calendars_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendars_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_calendars_org";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          room_id: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          room_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          room_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_room_members: {
        Row: {
          room_id: string;
          user_id: string;
        };
        Insert: {
          room_id: string;
          user_id: string;
        };
        Update: {
          room_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_room_members_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_room_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_rooms: {
        Row: {
          created_at: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      completed_forms: {
        Row: {
          completed_at: string;
          form_id: string;
          id: string;
          organisation_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          form_id: string;
          id?: string;
          organisation_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          form_id?: string;
          id?: string;
          organisation_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completed_forms_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "completed_forms_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "completed_forms_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          calendar_id: string;
          created_at: string | null;
          description: string | null;
          end_date: string;
          id: string;
          name: string;
          start_date: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          calendar_id: string;
          created_at?: string | null;
          description?: string | null;
          end_date: string;
          id?: string;
          name: string;
          start_date: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          calendar_id?: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string;
          id?: string;
          name?: string;
          start_date?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_events_calendar";
            columns: ["calendar_id"];
            isOneToOne: false;
            referencedRelation: "calendars";
            referencedColumns: ["id"];
          },
        ];
      };
      events_attendance: {
        Row: {
          did_attend: boolean;
          event_id: string;
          id: string;
          reason: string;
          user_id: string;
        };
        Insert: {
          did_attend: boolean;
          event_id: string;
          id?: string;
          reason: string;
          user_id: string;
        };
        Update: {
          did_attend?: boolean;
          event_id?: string;
          id?: string;
          reason?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_events_attendance_event";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_events_attendance_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events_calendars: {
        Row: {
          calendar_id: string | null;
          event_id: string;
          id: string;
        };
        Insert: {
          calendar_id?: string | null;
          event_id?: string;
          id?: string;
        };
        Update: {
          calendar_id?: string | null;
          event_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_calendars_calendar_id_fkey";
            columns: ["calendar_id"];
            isOneToOne: false;
            referencedRelation: "calendars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_calendars_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events_invitation: {
        Row: {
          description: string | null;
          event_id: string;
          id: string;
          reason: string | null;
          user_id: string;
          will_attend: boolean | null;
        };
        Insert: {
          description?: string | null;
          event_id: string;
          id?: string;
          reason?: string | null;
          user_id: string;
          will_attend?: boolean | null;
        };
        Update: {
          description?: string | null;
          event_id?: string;
          id?: string;
          reason?: string | null;
          user_id?: string;
          will_attend?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_events_invitation_event";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_events_invitation_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      form_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      form_invitations: {
        Row: {
          common_invitation_id: string | null;
          completed: boolean | null;
          created_at: string;
          form_id: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          common_invitation_id?: string | null;
          completed?: boolean | null;
          created_at?: string;
          form_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          common_invitation_id?: string | null;
          completed?: boolean | null;
          created_at?: string;
          form_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "form_invitations_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_invitations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      form_questions: {
        Row: {
          created_at: string;
          form_id: string;
          id: string;
          question_id: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          form_id: string;
          id?: string;
          question_id: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          form_id?: string;
          id?: string;
          question_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "form_questions_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_questions_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      form_responses: {
        Row: {
          completed: boolean;
          earned_experience: number;
          form_id: string;
          id: string;
          invitation_id: string | null;
          submitted_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          earned_experience?: number;
          form_id: string;
          id?: string;
          invitation_id?: string | null;
          submitted_at?: string;
          user_id?: string;
        };
        Update: {
          completed?: boolean;
          earned_experience?: number;
          form_id?: string;
          id?: string;
          invitation_id?: string | null;
          submitted_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_responses_invitation_id_fkey";
            columns: ["invitation_id"];
            isOneToOne: false;
            referencedRelation: "form_invitations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_responses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      forms: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          display_mode: Database["public"]["Enums"]["display_mode"];
          id: string;
          title: string;
          total_experience: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          display_mode?: Database["public"]["Enums"]["display_mode"];
          id?: string;
          title: string;
          total_experience?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          display_mode?: Database["public"]["Enums"]["display_mode"];
          id?: string;
          title?: string;
          total_experience?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      guardians_users: {
        Row: {
          guardian_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          guardian_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          guardian_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_guardians_users_guardian";
            columns: ["guardian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_guardians_users_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      message_reads: {
        Row: {
          id: string;
          message_id: string | null;
          read_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          message_id?: string | null;
          read_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          message_id?: string | null;
          read_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "chat_messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_reads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      organisations: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      organisations_invitation: {
        Row: {
          accepted: boolean | null;
          created_at: string;
          id: string;
          organisation_id: string;
          team_id: string | null;
          user_email: string;
        };
        Insert: {
          accepted?: boolean | null;
          created_at?: string;
          id?: string;
          organisation_id?: string;
          team_id?: string | null;
          user_email: string;
        };
        Update: {
          accepted?: boolean | null;
          created_at?: string;
          id?: string;
          organisation_id?: string;
          team_id?: string | null;
          user_email?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organisations_invitation_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organisations_invitation_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          created_at: string | null;
          endpoint: string;
          id: string;
          keys: Json;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          endpoint: string;
          id?: string;
          keys: Json;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          endpoint?: string;
          id?: string;
          keys?: Json;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      question_options: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          question_id: string;
          sort_order: number;
          value: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          question_id: string;
          sort_order?: number;
          value: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          question_id?: string;
          sort_order?: number;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      question_responses: {
        Row: {
          created_at: string;
          form_response_id: string;
          id: string;
          question_id: string;
          response: Json;
        };
        Insert: {
          created_at?: string;
          form_response_id: string;
          id?: string;
          question_id: string;
          response: Json;
        };
        Update: {
          created_at?: string;
          form_response_id?: string;
          id?: string;
          question_id?: string;
          response?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "question_responses_form_response_id_fkey";
            columns: ["form_response_id"];
            isOneToOne: false;
            referencedRelation: "form_responses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "question_responses_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          category_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          experience: number;
          id: string;
          image_url: string | null;
          input_type: Database["public"]["Enums"]["input_type"];
          max_value: number | null;
          min_value: number | null;
          question: string;
          required: boolean;
          step_value: number | null;
          updated_at: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          experience?: number;
          id?: string;
          image_url?: string | null;
          input_type: Database["public"]["Enums"]["input_type"];
          max_value?: number | null;
          min_value?: number | null;
          question: string;
          required?: boolean;
          step_value?: number | null;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          experience?: number;
          id?: string;
          image_url?: string | null;
          input_type?: Database["public"]["Enums"]["input_type"];
          max_value?: number | null;
          min_value?: number | null;
          question?: string;
          required?: boolean;
          step_value?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "form_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      teams_organisations: {
        Row: {
          id: string;
          organisation_id: string;
          team_id: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          team_id: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_organisations_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teams_organisations_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          address: string;
          avatar: string | null;
          birth_date: string;
          created_at: string;
          deleted_at: string | null;
          email: string;
          first_name: string;
          gender: string;
          id: string;
          is_admin: boolean;
          last_name: string;
          total_experience: number;
          updated_at: string;
        };
        Insert: {
          address: string;
          avatar?: string | null;
          birth_date: string;
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          first_name: string;
          gender: string;
          id: string;
          is_admin?: boolean;
          last_name: string;
          total_experience?: number;
          updated_at?: string;
        };
        Update: {
          address?: string;
          avatar?: string | null;
          birth_date?: string;
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          first_name?: string;
          gender?: string;
          id?: string;
          is_admin?: boolean;
          last_name?: string;
          total_experience?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      users_organisations: {
        Row: {
          id: string;
          organisation_id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          role?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_users_organisations_org";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_users_organisations_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users_teams: {
        Row: {
          id: string;
          position: string;
          role: string;
          team_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          position: string;
          role: string;
          team_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          position?: string;
          role?: string;
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_users_teams_team";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_teams_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_user_experience: {
        Args: { total_experience: number };
        Returns: undefined;
      };
      create_default_emoji_scale: {
        Args: { question_uuid: string };
        Returns: undefined;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_organisation_manager: {
        Args: { p_user_id: string; p_organisation_id: string };
        Returns: boolean;
      };
      is_organisation_member: {
        Args: { p_user_id: string; p_organisation_id: string };
        Returns: boolean;
      };
      is_team_leader: {
        Args: { team_id_param: string };
        Returns: boolean;
      };
      update_tables_for_uuid_and_timestamptz: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      display_mode: "single" | "sequential";
      input_type: "text" | "number" | "emoji" | "slider" | "yesno" | "multiple";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      display_mode: ["single", "sequential"],
      input_type: ["text", "number", "emoji", "slider", "yesno", "multiple"],
    },
  },
} as const;
