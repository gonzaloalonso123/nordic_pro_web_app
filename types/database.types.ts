export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      calendars: {
        Row: {
          entity_type: string
          id: string
          organisation_id: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          entity_type: string
          id?: string
          organisation_id?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          entity_type?: string
          id?: string
          organisation_id?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendars_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_calendars_org"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_participants: {
        Row: {
          id: string
          joined_at: string | null
          last_read_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_participants_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_group_chat: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group_chat?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group_chat?: boolean | null
          name?: string | null
          updated_at?: string | null
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          invite_future_members: boolean | null
          location_id: string | null
          name: string
          start_date: string
          time_to_come: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          invite_future_members?: boolean | null
          location_id?: string | null
          name: string
          start_date: string
          time_to_come?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          invite_future_members?: boolean | null
          location_id?: string | null
          name?: string
          start_date?: string
          time_to_come?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events_calendars: {
        Row: {
          calendar_id: string | null
          event_id: string
          id: string
        }
        Insert: {
          calendar_id?: string | null
          event_id?: string
          id?: string
        }
        Update: {
          calendar_id?: string | null
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_calendars_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_calendars_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events_invitation: {
        Row: {
          description: string | null
          event_id: string
          id: string
          reason: string | null
          user_id: string
          will_attend: boolean | null
        }
        Insert: {
          description?: string | null
          event_id: string
          id?: string
          reason?: string | null
          user_id: string
          will_attend?: boolean | null
        }
        Update: {
          description?: string | null
          event_id?: string
          id?: string
          reason?: string | null
          user_id?: string
          will_attend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "events_invitation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expo_push_tokens: {
        Row: {
          created_at: string
          device: string | null
          expo_push_token: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          expo_push_token: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          expo_push_token?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
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
      form_invitations: {
        Row: {
          common_invitation_id: string | null
          completed: boolean | null
          created_at: string
          expires_at: string | null
          form_id: string
          id: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          common_invitation_id?: string | null
          completed?: boolean | null
          created_at?: string
          expires_at?: string | null
          form_id: string
          id?: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          common_invitation_id?: string | null
          completed?: boolean | null
          created_at?: string
          expires_at?: string | null
          form_id?: string
          id?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_invitations_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      form_program: {
        Row: {
          after_game_form_id: string | null
          after_training_form_id: string | null
          before_game_form_id: string | null
          before_training_form_id: string | null
          color: string | null
          created_at: string
          description: string | null
          duration_weeks: number
          id: string
          name: string | null
          scheduled_forms: Json[] | null
          target_role: string
        }
        Insert: {
          after_game_form_id?: string | null
          after_training_form_id?: string | null
          before_game_form_id?: string | null
          before_training_form_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          name?: string | null
          scheduled_forms?: Json[] | null
          target_role?: string
        }
        Update: {
          after_game_form_id?: string | null
          after_training_form_id?: string | null
          before_game_form_id?: string | null
          before_training_form_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          name?: string | null
          scheduled_forms?: Json[] | null
          target_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_program_after_game_form_id_fkey"
            columns: ["after_game_form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_program_after_training_form_id_fkey"
            columns: ["after_training_form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_program_before_game_form_id_fkey"
            columns: ["before_game_form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_program_before_training_form_id_fkey"
            columns: ["before_training_form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_program_execution: {
        Row: {
          completed: boolean | null
          created_at: string
          end_date: string | null
          form_program_id: string | null
          id: string
          start_date: string | null
          team_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          end_date?: string | null
          form_program_id?: string | null
          id?: string
          start_date?: string | null
          team_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          end_date?: string | null
          form_program_id?: string | null
          id?: string
          start_date?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_program_execution_form_program_id_fkey"
            columns: ["form_program_id"]
            isOneToOne: false
            referencedRelation: "form_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_program_execution_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "forms"
            referencedColumns: ["id"]
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
          invitation_id: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          earned_experience?: number
          form_id: string
          id?: string
          invitation_id?: string | null
          submitted_at?: string
          user_id?: string
        }
        Update: {
          completed?: boolean
          earned_experience?: number
          form_id?: string
          id?: string
          invitation_id?: string | null
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "form_invitations"
            referencedColumns: ["id"]
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
          visibility: Json | null
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
          visibility?: Json | null
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
          visibility?: Json | null
        }
        Relationships: [
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
            referencedRelation: "users"
            referencedColumns: ["id"]
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
      locations: {
        Row: {
          coordinates: string | null
          created_at: string
          id: string
          name: string | null
          organisation_id: string | null
        }
        Insert: {
          coordinates?: string | null
          created_at?: string
          id?: string
          name?: string | null
          organisation_id?: string | null
        }
        Update: {
          coordinates?: string | null
          created_at?: string
          id?: string
          name?: string | null
          organisation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reads: {
        Row: {
          id: string
          message_id: string | null
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey1"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          avatar: string | null
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          id?: string
          name: string
        }
        Update: {
          avatar?: string | null
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
          team_id: string | null
          user_email: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          organisation_id?: string
          team_id?: string | null
          user_email: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          organisation_id?: string
          team_id?: string | null
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
          {
            foreignKeyName: "organisations_invitation_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notifications: {
        Row: {
          body: string | null
          created_at: string
          error_message: string | null
          expo_push_token: string | null
          id: string
          receipt_id: string | null
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          error_message?: string | null
          expo_push_token?: string | null
          id?: string
          receipt_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          error_message?: string | null
          expo_push_token?: string | null
          id?: string
          receipt_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_notifications_expo_push_token_fkey"
            columns: ["expo_push_token"]
            isOneToOne: false
            referencedRelation: "expo_push_tokens"
            referencedColumns: ["expo_push_token"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          keys: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          keys: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          keys?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_forms: {
        Row: {
          created_at: string
          expiration_date: string | null
          form_id: string | null
          form_program_id: string | null
          id: string
          scheduled_date: string
          target_role: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          expiration_date?: string | null
          form_id?: string | null
          form_program_id?: string | null
          id?: string
          scheduled_date?: string
          target_role?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          expiration_date?: string | null
          form_id?: string | null
          form_program_id?: string | null
          id?: string
          scheduled_date?: string
          target_role?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_forms_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_forms_form_program_id_fkey"
            columns: ["form_program_id"]
            isOneToOne: false
            referencedRelation: "form_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_forms_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          team_manager: string | null
        }
        Insert: {
          id?: string
          name: string
          team_manager?: string | null
        }
        Update: {
          id?: string
          name?: string
          team_manager?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_team_manager_fkey"
            columns: ["team_manager"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "teams_organisations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_organisations_team_id_fkey"
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
            foreignKeyName: "users_organisations_user_id_fkey"
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
          position: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          position?: string | null
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          position?: string | null
          role?: string
          team_id?: string
          user_id?: string
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
            foreignKeyName: "users_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_experience: {
        Args: { p_experience_points: number }
        Returns: undefined
      }
      create_default_emoji_scale: {
        Args: { question_uuid: string }
        Returns: undefined
      }
      find_existing_onetoone_chat: {
        Args: { user1_id: string; user2_id: string }
        Returns: {
          room_id: string
        }[]
      }
      get_unread_message_count: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
