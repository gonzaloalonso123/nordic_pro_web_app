"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { ResponsiveFormPopup } from "@/components/form/responsive-form-popup";
import { Content } from "./content";

interface ExpireSelectorProps {
    expiresAt: Date | null;
    onChange: (expiresAt: Date | null) => void;
    teamId: string;
}

export const ExpireSelector: React.FC<ExpireSelectorProps> = ({
    expiresAt,
    onChange,
    teamId,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {expiresAt ? expiresAt.toLocaleString() : "Not set"}
                    </span>
                </div>
                <div>
                    <ResponsiveFormPopup
                        trigger={
                            <Button type="button" size="sm">
                                Configure
                            </Button>
                        }
                        title="Event Settings"
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <Content
                            expiresAt={expiresAt}
                            teamId={teamId}
                            onChange={(date) => {
                                onChange(date);
                                setOpen(false);
                            }}
                        />
                    </ResponsiveFormPopup>
                </div>
            </div>
        </div>
    );
};
