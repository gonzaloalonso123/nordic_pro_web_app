"use client";

import Link from "next/link";
import { useHeader } from "@/hooks/useHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileMenu } from "./ProfileMenu";
import Image from "next/image";
import BackButton from "../ui/back-button";

const Header = () => {
  const { headerConfig } = useHeader();
  const { user } = useCurrentUser();

  const { leftContent, centerContent, rightContent } = headerConfig;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex flex-1 flex-shrink justify-start">
          {leftContent ? (
            leftContent === "back" ? (
              <BackButton />
            ) : (
              leftContent
            )
          ) : (
            <Link href="/app" className="mr-8">
              <Image
                src="/icon.png"
                alt="NordicPro Logo"
                width={43}
                height={43}
                className="md:hidden"
              />
              <Image
                src="/nordicpro.webp"
                alt="NordicPro Logo"
                width={128}
                height={43}
                className="hidden md:block"
              />
            </Link>
          )}
        </div>
        <div className="flex flex-2 text-center justify-center font-semibold text-lg truncate">
          {centerContent}
        </div>
        <div className="flex flex-1 flex-shrink justify-end">
          {rightContent ? (
            rightContent
          ) : user ? (
            <ProfileMenu user={user} />
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
