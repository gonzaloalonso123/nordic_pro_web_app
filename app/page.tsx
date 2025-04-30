import { redirect } from "next/navigation";
import flags from "@/flags.json";

export default async function Home() {
  redirect(flags.current_app);
}
