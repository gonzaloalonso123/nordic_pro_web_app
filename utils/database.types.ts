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
      attendance: {
        Row: {
          attendance_id: string;
          attending: boolean | null;
          created_at: string | null;
          event_id: string | null;
          player_id: string | null;
          reason: string | null;
        };
        Insert: {
          attendance_id?: string;
          attending?: boolean | null;
          created_at?: string | null;
          event_id?: string | null;
          player_id?: string | null;
          reason?: string | null;
        };
        Update: {
          attendance_id?: string;
          attending?: boolean | null;
          created_at?: string | null;
          event_id?: string | null;
          player_id?: string | null;
          reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "attendance_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          details: Json | null;
          log_id: string;
          timestamp: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          details?: Json | null;
          log_id?: string;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          details?: Json | null;
          log_id?: string;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      chat_participants: {
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
            foreignKeyName: "chat_participants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["room_id"];
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      chat_rooms: {
        Row: {
          created_at: string | null;
          is_group: boolean | null;
          room_id: string;
          room_name: string | null;
        };
        Insert: {
          created_at?: string | null;
          is_group?: boolean | null;
          room_id?: string;
          room_name?: string | null;
        };
        Update: {
          created_at?: string | null;
          is_group?: boolean | null;
          room_id?: string;
          room_name?: string | null;
        };
        Relationships: [];
      };
      coach_feedback: {
        Row: {
          attitude_rating: number | null;
          coach_id: string | null;
          comment: string | null;
          feedback_id: string;
          performance_rating: number | null;
          player_id: string | null;
          submitted_at: string | null;
          week_start_date: string;
        };
        Insert: {
          attitude_rating?: number | null;
          coach_id?: string | null;
          comment?: string | null;
          feedback_id?: string;
          performance_rating?: number | null;
          player_id?: string | null;
          submitted_at?: string | null;
          week_start_date: string;
        };
        Update: {
          attitude_rating?: number | null;
          coach_id?: string | null;
          comment?: string | null;
          feedback_id?: string;
          performance_rating?: number | null;
          player_id?: string | null;
          submitted_at?: string | null;
          week_start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coach_feedback_coach_id_fkey";
            columns: ["coach_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "coach_feedback_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string | null;
          event_date: string;
          event_id: string;
          event_name: string;
          event_type: string;
          location: string | null;
          team_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_date: string;
          event_id?: string;
          event_name: string;
          event_type: string;
          location?: string | null;
          team_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_date?: string;
          event_id?: string;
          event_name?: string;
          event_type?: string;
          location?: string | null;
          team_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      feedback: {
        Row: {
          comment: string | null;
          emoji: string | null;
          event_id: string | null;
          feedback_id: string;
          player_id: string | null;
          rating: number | null;
          submitted_at: string | null;
        };
        Insert: {
          comment?: string | null;
          emoji?: string | null;
          event_id?: string | null;
          feedback_id?: string;
          player_id?: string | null;
          rating?: number | null;
          submitted_at?: string | null;
        };
        Update: {
          comment?: string | null;
          emoji?: string | null;
          event_id?: string | null;
          feedback_id?: string;
          player_id?: string | null;
          rating?: number | null;
          submitted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "feedback_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      gdpr_consent: {
        Row: {
          child_id: string | null;
          consent_date: string | null;
          consent_details: Json;
          consent_given: boolean | null;
          consent_id: string;
          parent_id: string | null;
          revoked: boolean | null;
          revoked_date: string | null;
        };
        Insert: {
          child_id?: string | null;
          consent_date?: string | null;
          consent_details: Json;
          consent_given?: boolean | null;
          consent_id?: string;
          parent_id?: string | null;
          revoked?: boolean | null;
          revoked_date?: string | null;
        };
        Update: {
          child_id?: string | null;
          consent_date?: string | null;
          consent_details?: Json;
          consent_given?: boolean | null;
          consent_id?: string;
          parent_id?: string | null;
          revoked?: boolean | null;
          revoked_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gdpr_consent_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "gdpr_consent_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          message_id: string;
          room_id: string | null;
          sender_id: string | null;
          sent_at: string | null;
        };
        Insert: {
          content: string;
          message_id?: string;
          room_id?: string | null;
          sender_id?: string | null;
          sent_at?: string | null;
        };
        Update: {
          content?: string;
          message_id?: string;
          room_id?: string | null;
          sender_id?: string | null;
          sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["room_id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          is_read: boolean | null;
          message: string;
          notification_id: string;
          title: string;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          is_read?: boolean | null;
          message: string;
          notification_id?: string;
          title: string;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          is_read?: boolean | null;
          message?: string;
          notification_id?: string;
          title?: string;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      parent_child: {
        Row: {
          child_id: string;
          parent_id: string;
        };
        Insert: {
          child_id: string;
          parent_id: string;
        };
        Update: {
          child_id?: string;
          parent_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parent_child_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "parent_child_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      player_ratings: {
        Row: {
          attitude_rating: number | null;
          comment: string | null;
          performance_rating: number | null;
          ratee_id: string | null;
          rater_id: string | null;
          rating_id: string;
          submitted_at: string | null;
          week_start_date: string;
        };
        Insert: {
          attitude_rating?: number | null;
          comment?: string | null;
          performance_rating?: number | null;
          ratee_id?: string | null;
          rater_id?: string | null;
          rating_id?: string;
          submitted_at?: string | null;
          week_start_date: string;
        };
        Update: {
          attitude_rating?: number | null;
          comment?: string | null;
          performance_rating?: number | null;
          ratee_id?: string | null;
          rater_id?: string | null;
          rating_id?: string;
          submitted_at?: string | null;
          week_start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "player_ratings_ratee_id_fkey";
            columns: ["ratee_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "player_ratings_rater_id_fkey";
            columns: ["rater_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      rosters: {
        Row: {
          created_at: string | null;
          event_id: string | null;
          player_id: string | null;
          response: string | null;
          roster_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: string | null;
          player_id?: string | null;
          response?: string | null;
          roster_id?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: string | null;
          player_id?: string | null;
          response?: string | null;
          roster_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rosters_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "rosters_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      teams: {
        Row: {
          age_group: string | null;
          created_at: string | null;
          team_id: string;
          team_name: string;
        };
        Insert: {
          age_group?: string | null;
          created_at?: string | null;
          team_id?: string;
          team_name: string;
        };
        Update: {
          age_group?: string | null;
          created_at?: string | null;
          team_id?: string;
          team_name?: string;
        };
        Relationships: [];
      };
      trophies: {
        Row: {
          awarded_at: string | null;
          comment: string | null;
          player_id: string | null;
          trophy_id: string;
          trophy_type: string;
          week_start_date: string;
        };
        Insert: {
          awarded_at?: string | null;
          comment?: string | null;
          player_id?: string | null;
          trophy_id?: string;
          trophy_type: string;
          week_start_date: string;
        };
        Update: {
          awarded_at?: string | null;
          comment?: string | null;
          player_id?: string | null;
          trophy_id?: string;
          trophy_type?: string;
          week_start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trophies_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          date_of_birth: string | null;
          email: string;
          full_name: string;
          role: string;
          team_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          date_of_birth?: string | null;
          email: string;
          full_name: string;
          role: string;
          team_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          date_of_birth?: string | null;
          email?: string;
          full_name?: string;
          role?: string;
          team_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
