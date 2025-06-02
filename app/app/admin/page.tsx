"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { useUrl } from "@/hooks/use-url";
import { LoadingLink } from "@/components/ui/loading-link";

const Page = () => {
  const path = useUrl();
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
        <LoadingLink variant="default" href={`${path}/organisations`}>Organisations</LoadingLink>
        <LoadingLink variant="default" href={`${path}/forms`}>Forms</LoadingLink>
      </Card>
    </div>
  );
};

export default Page;
