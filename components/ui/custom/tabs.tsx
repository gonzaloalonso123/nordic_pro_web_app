"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-xl bg-gray-100/80 p-1.5 text-gray-600 backdrop-blur-xs",
  {
    variants: {
      variant: {
        default: "bg-gray-100/80",
        brand: "bg-linear-to-r from-blue-50 to-orange-50 border border-blue-100/50",
        minimal: "bg-transparent border-b border-gray-200",
      },
      size: {
        default: "h-11",
        sm: "h-9 p-1",
        lg: "h-12 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: [
          "text-gray-600 hover:text-gray-900",
          "data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-xs data-[state=active]:shadow-blue-500/10",
          "data-[state=active]:font-semibold",
        ],
        brand: [
          "text-gray-600 hover:text-blue-600",
          "data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600",
          "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25",
          "data-[state=active]:font-semibold",
          "hover:bg-white/50",
        ],
        minimal: [
          "rounded-none border-b-2 border-transparent text-gray-600 hover:text-blue-600",
          "data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50/50",
          "data-[state=active]:font-semibold",
        ],
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant, size }), className)} {...props} />
  ),
)
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant, size }), className)} {...props} />
  ),
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "animate-in fade-in-50 duration-200",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
