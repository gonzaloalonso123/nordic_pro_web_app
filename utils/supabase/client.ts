import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../database.types"

export default function useSupabaseBrowser() {
  return createClientComponentClient<Database>()
}
