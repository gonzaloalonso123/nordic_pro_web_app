"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import flags from "@/flags.json";

const Page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="p-4 flex flex-col gap-2 w-full max-w-md">
        <CardTitle>
          <h1 className="text-2xl font-bold">Admin</h1>
        </CardTitle>
        <Image
          src="/hero-image.webp"
          width={200}
          height={200}
          className="w-full"
          alt="Hero image"
        />
        <Button asChild>
          <Link href={`${flags.current_app}/admin/organisation/`}>
            Organisations
          </Link>
        </Button>
        <Button asChild>
          <Link href={`${flags.current_app}/admin/forms`}>Forms</Link>
        </Button>
        <Button asChild>
          <Link href="">Option 3</Link>
        </Button>
      </Card>
    </div>
  );
};

export default Page;
