"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveFormPopupProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const ResponsiveFormPopup: React.FC<ResponsiveFormPopupProps> = ({
  trigger,
  title,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className = "",
  mobileClassName = "h-[100svh] flex flex-col rounded-none drawer-no-close-btn",
  desktopClassName = "max-w-4xl h-[80vh] p-0 flex flex-col",
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className={`${mobileClassName} ${className}`}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle hidden>{title}</DialogTitle>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`${desktopClassName} ${className}`}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
