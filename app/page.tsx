import { getCurrentUser } from "./actions";

export default async function Home() {
  const user = getCurrentUser();

  return <main className="flex-1 flex flex-col gap-6 px-4"></main>;
}
