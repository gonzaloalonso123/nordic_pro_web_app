import { Json } from "./utils/database.types"

export type Database = {
  public: {
    Tables: {
      calendars: {
        Row: {
          entity_type: string
          id: string
          organisation_id: string | null
          team_id: string | null
        }
        Insert: {
          entity_type: string
          id?: string
          organisation_id?: string | null
          team_id?: string | null
        }
        Update: {
          entity_type?: string
          id?: string
          organisation_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_calendars_org"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_calendars_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: Json
          chat_room_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          attachments: Json
          chat_room_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          attachments?: Json
          chat_room_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_chat_messages_room"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_chat_messages_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_chat_messages_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string
          name: string
        }
        Insert: {
          created_at: string
          description: string
          id: string
          image: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string
          name?: string
        }
        Relationships: []
      }
      completed_forms: {
        Row: {
          completed_at: string
          form_id: string
          id: string
          organisation_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          form_id: string
          id?: string
          organisation_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          form_id?: string
          id?: string
          organisation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_forms_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_response_counts"
            referencedColumns: ["form_id"]
          },
          {
            foreignKeyName: "completed_forms_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_forms_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "completed_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emoji_options: {
        Row: {
          created_at: string
          emoji: string
          id: string
          label: string | null
          question_id: string
          sort_order: number
          value: number
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          label?: string | null
          question_id: string
          sort_order?: number
          value: number
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          label?: string | null
          question_id?: string
          sort_order?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "emoji_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_response_analytics"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "emoji_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          calendar_id: string
          created_at: string | null
          description: string
          end_date: string
          id: string
          name: string
          start_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          calendar_id: string
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          name: string
          start_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          calendar_id?: string
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_events_calendar"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
        ]
      }
      events_attendance: {
        Row: {
          did_attend: boolean
          event_id: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          did_attend: boolean
          event_id: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          did_attend?: boolean
          event_id?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_events_attendance_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_attendance_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_events_attendance_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events_invitation: {
        Row: {
          description: string
          event_id: string
          id: string
          reason: string
          user_id: string
          will_attend: boolean
        }
        Insert: {
          description: string
          event_id: string
          id?: string
          reason: string
          user_id: string
          will_attend: boolean
        }
        Update: {
          description?: string
          event_id?: string
          id?: string
          reason?: string
          user_id?: string
          will_attend?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_events_invitation_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_invitation_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_events_invitation_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      form_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_questions: {
        Row: {
          created_at: string
          form_id: string
          id: string
          question_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          question_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          question_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_questions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_response_counts"
            referencedColumns: ["form_id"]
          },
          {
            foreignKeyName: "form_questions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_response_analytics"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "form_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          completed: boolean
          earned_experience: number
          form_id: string
          id: string
          organisation_id: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          earned_experience?: number
          form_id: string
          id?: string
          organisation_id: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          earned_experience?: number
          form_id?: string
          id?: string
          organisation_id?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_response_counts"
            referencedColumns: ["form_id"]
          },
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "form_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_mode: Database["public"]["Enums"]["display_mode"]
          id: string
          title: string
          total_experience: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_mode?: Database["public"]["Enums"]["display_mode"]
          id?: string
          title: string
          total_experience?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_mode?: Database["public"]["Enums"]["display_mode"]
          id?: string
          title?: string
          total_experience?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians_users: {
        Row: {
          guardian_id: string
          id: string
          user_id: string
        }
        Insert: {
          guardian_id: string
          id?: string
          user_id: string
        }
        Update: {
          guardian_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_guardians_users_guardian"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_guardians_users_guardian"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_guardians_users_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_guardians_users_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      organisations_invitation: {
        Row: {
          accepted: boolean | null
          created_at: string
          id: string
          organisation_id: string
          user_email: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          organisation_id?: string
          user_email: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          organisation_id?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisations_invitation_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          label: string
          question_id: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          question_id: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          question_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_response_analytics"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_responses: {
        Row: {
          created_at: string
          form_response_id: string
          id: string
          question_id: string
          response: Json
        }
        Insert: {
          created_at?: string
          form_response_id: string
          id?: string
          question_id: string
          response: Json
        }
        Update: {
          created_at?: string
          form_response_id?: string
          id?: string
          question_id?: string
          response?: Json
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_response_analytics"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          experience: number
          id: string
          image_url: string | null
          input_type: Database["public"]["Enums"]["input_type"]
          max_value: number | null
          min_value: number | null
          question: string
          required: boolean
          step_value: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          experience?: number
          id?: string
          image_url?: string | null
          input_type: Database["public"]["Enums"]["input_type"]
          max_value?: number | null
          min_value?: number | null
          question: string
          required?: boolean
          step_value?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          experience?: number
          id?: string
          image_url?: string | null
          input_type?: Database["public"]["Enums"]["input_type"]
          max_value?: number | null
          min_value?: number | null
          question?: string
          required?: boolean
          step_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "form_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      teams_organisations: {
        Row: {
          id: string
          organisation_id: string
          team_id: string
        }
        Insert: {
          id?: string
          organisation_id: string
          team_id: string
        }
        Update: {
          id?: string
          organisation_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teams_organisations_org"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_teams_organisations_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string
          avatar: string | null
          birth_date: string
          created_at: string
          deleted_at: string | null
          email: string
          first_name: string
          gender: string
          id: string
          is_admin: boolean
          last_name: string
          total_experience: number
          updated_at: string
        }
        Insert: {
          address: string
          avatar?: string | null
          birth_date: string
          created_at?: string
          deleted_at?: string | null
          email: string
          first_name: string
          gender: string
          id: string
          is_admin?: boolean
          last_name: string
          total_experience?: number
          updated_at?: string
        }
        Update: {
          address?: string
          avatar?: string | null
          birth_date?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          first_name?: string
          gender?: string
          id?: string
          is_admin?: boolean
          last_name?: string
          total_experience?: number
          updated_at?: string
        }
        Relationships: []
      }
      users_chats: {
        Row: {
          chat_room_id: string
          id: string
          user_id: string
        }
        Insert: {
          chat_room_id: string
          id?: string
          user_id: string
        }
        Update: {
          chat_room_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_chats_room"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_users_chats_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_users_chats_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_organisations: {
        Row: {
          id: string
          organisation_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          organisation_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          organisation_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_organisations_org"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_users_organisations_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_users_organisations_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_teams: {
        Row: {
          id: string
          position: string
          role: string
          team_id: string
          users_id: string
        }
        Insert: {
          id?: string
          position: string
          role: string
          team_id: string
          users_id: string
        }
        Update: {
          id?: string
          position?: string
          role?: string
          team_id?: string
          users_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_teams_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_users_teams_user"
            columns: ["users_id"]
            isOneToOne: false
            referencedRelation: "user_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_users_teams_user"
            columns: ["users_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      form_response_counts: {
        Row: {
          first_response: string | null
          form_id: string | null
          form_title: string | null
          last_response: string | null
          organisation_id: string | null
          total_responses: number | null
          unique_users: number | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_response_analytics: {
        Row: {
          category: string | null
          input_type: Database["public"]["Enums"]["input_type"] | null
          organisation_id: string | null
          question: string | null
          question_id: string | null
          responses: Json | null
          total_responses: number | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          name: string | null
          organisation_id: string | null
          total_experience: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_default_emoji_scale: {
        Args: { question_uuid: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_organisation_manager: {
        Args: { p_user_id: string; p_organisation_id: string }
        Returns: boolean
      }
      is_organisation_member: {
        Args: { p_user_id: string; p_organisation_id: string }
        Returns: boolean
      }
      is_team_leader: {
        Args: { team_id_param: string }
        Returns: boolean
      }
      update_tables_for_uuid_and_timestamptz: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      display_mode: "single" | "sequential"
      input_type: "text" | "number" | "emoji" | "slider" | "yesno" | "multiple"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      display_mode: ["single", "sequential"],
      input_type: ["text", "number", "emoji", "slider", "yesno", "multiple"],
    },
  },
} as const
