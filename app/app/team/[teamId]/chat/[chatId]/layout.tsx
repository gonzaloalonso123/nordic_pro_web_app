"use client";

import BackButton from "@/components/ui/back-button";
import { useUrl } from "@/hooks/use-url";
import { useHeader } from "@/hooks/useHeader";
import type { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const path = useUrl();
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    leftContent: <BackButton className="md:hidden" path={`${path}/chat`} />,
    centerContent: "Chat",
  }, [path]);

  return children;
}
