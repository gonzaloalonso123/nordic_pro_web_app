import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "../database.types"

export default function useSupabaseServer() {
  return createServerComponentClient<Database>({ cookies })
}
