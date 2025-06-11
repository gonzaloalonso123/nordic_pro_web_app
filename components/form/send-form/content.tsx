import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClientData } from '@/utils/data/client';
import { Tables } from '@/types/database.types';
import { Label } from '@/components/ui/label';

type ExpiryOption = "after-sent" | "after-event";
type EventTiming = "before" | "after";

interface ExpirySelectorProps {
    expiresAt?: Date | null;
    onChange: (expiresAt: Date | null) => void;
    defaultValue?: ExpiryOption;
    teamId: string;
}

export const Content: React.FC<ExpirySelectorProps> = ({
    expiresAt,
    onChange,
    defaultValue = "after-sent",
    teamId,
}) => {
    const events = useClientData().events.useUpcomingByTeam(teamId);
    const [option, setOption] = useState<ExpiryOption>(defaultValue);
    const [hoursAfterSent, setHoursAfterSent] = useState<number>(2);
    const [hoursAfterEvent, setHoursAfterEvent] = useState<number>(2);
    const [eventTiming, setEventTiming] = useState<EventTiming>("after");
    const [selectedEventId, setSelectedEventId] = useState<Tables<'events'>['id']>(
        events.data?.[0]?.id || ""
    );
    const selectedEvent = events.data?.find(event => event.id === selectedEventId);

    const formatEventDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getExpiryDate = () => {
        if (option === "after-sent") {
            return new Date(Date.now() + hoursAfterSent * 60 * 60 * 1000);
        }
        if (option === "after-event" && selectedEvent) {
            return new Date(
                new Date(selectedEvent.end_date).getTime() + hoursAfterEvent * 60 * 60 * 1000
            );
        }
        return null;
    };

    const handleSave = () => {
        onChange(getExpiryDate());
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-4 px-4 sm:px-0">
            <div>
                <div className="p-4 border-b shrink-0">
                    <h2 className="text-xl font-semibold">Expires at</h2>
                </div>
                <div className="p-3 border-t shrink-0 flex flex-col gap-4">
                    {/* Hours after sent option */}
                    <Card
                        className={cn(
                            "cursor-pointer transition-all duration-200 border-2 active:scale-[0.98]",
                            option === "after-sent"
                                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:shadow-md active:shadow-lg"
                        )}
                        onClick={() => setOption("after-sent")}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                    "p-2 rounded-full transition-colors",
                                    option === "after-sent" ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-foreground flex-1">Hours after sent</span>
                                {option === "after-sent" && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </div>

                            <div className="flex items-center gap-2 pl-1">
                                <Label>Expires</Label>
                                <Input
                                    type="number"
                                    value={hoursAfterSent}
                                    onChange={(e) => setHoursAfterSent(Number(e.target.value))}
                                    className="border rounded-sm px-2 py-1 w-16 text-center"
                                    min="1"
                                    max="168"
                                />
                                <span className="text-muted-foreground text-sm">hours</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hours after event option */}
                    <Card
                        className={cn(
                            "cursor-pointer transition-all duration-200 border-2 active:scale-[0.98]",
                            option === "after-event"
                                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:shadow-md active:shadow-lg"
                        )}
                        onClick={() => setOption("after-event")}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                    "p-2 rounded-full transition-colors",
                                    option === "after-event" ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-foreground text-lg flex-1">Hours {eventTiming} event</span>
                                {option === "after-event" && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </div>

                            <div className="space-y-4 pl-1">
                                <div>
                                    <Label>Event</Label>
                                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an event" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {events.data?.map((event) => (
                                                <SelectItem key={event.id} value={event.id}>
                                                    <div className="flex flex-wrap items-center gap-1 p-2">
                                                        <span className="font-medium text-base">{event.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {`${new Date(event.start_date).toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.start_date).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} — ${new Date(event.end_date).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Label>Expires</Label>
                                        <Input
                                            type="number"
                                            value={hoursAfterEvent}
                                            onChange={(e) => setHoursAfterEvent(Number(e.target.value))}
                                            className="border rounded-sm px-2 py-1 w-16 text-center"
                                            min="1"
                                            max="168"
                                        />
                                        <span className="text-muted-foreground text-sm">hours</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Select value={eventTiming} onValueChange={(value: EventTiming) => setEventTiming(value)}>
                                            <SelectTrigger className='w-24'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="before" className="py-2">before</SelectItem>
                                                <SelectItem value="after" className="py-2">after</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-muted-foreground text-sm">the event</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button
                        onClick={handleSave}
                        className="w-full active:scale-[0.98] transition-transform"
                    >
                        Save expiration
                    </Button>
                </div>
            </div>
        </div>
    );
};