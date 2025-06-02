import { Button } from "@/components/ui/button";
import { serverData } from "@/utils/data/server";
import flags from "@/flags.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarPlus, Clock, Plus, Users } from "lucide-react";
import { format } from "date-fns";
import { Content } from "@/components/content";
import Calendar from "@/components/calendar/event-calendar";
import { getInitials } from "@/utils/get-initials";
import { LoadingLink } from "@/components/ui/loading-link";

type PageProps = {
  params: Promise<{
    teamId: string;
    organisationId: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const teamId = params.teamId;
  const organisationId = params.organisationId;
  const team = await serverData.teams.getById(teamId);
  const teamWithUsers = await serverData.teams.getWithUsers(teamId);
  const events = await serverData.events.getByTeam(teamId);

  if (!team) {
    return <div className="container py-4">Team not found</div>;
  }

  return (
    <Content>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{team.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Members
            </h2>
            <LoadingLink
              variant="sport"
              size="sm"
              className="flex gap-2 items-center"
              href={`${flags.current_app}/organisation/${organisationId}/teams/${teamId}/add-member`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </LoadingLink>
          </div>

          <div className="space-y-3">
            {teamWithUsers?.users?.length > 0 ? (
              teamWithUsers.users.map((userTeam: any) => (
                <MemberCard key={userTeam.id} member={userTeam} />
              ))
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                No members found
              </Card>
            )}
          </div>
        </section>

        {/* Calendar Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <CalendarPlus className="mr-2 h-5 w-5" />
              Team Calendar
            </h2>
            <LoadingLink
              variant="sport"
              size="sm"
              className="flex gap-2 items-center"
              href={`${flags.current_app}/organisation/${organisationId}/teams/${teamId}/add-event`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </LoadingLink>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming events
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <Calendar events={events} />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Content>
  );
};

const MemberCard = ({ member }: { member: any }) => {
  const user = member.user;
  const initials = getInitials({ firstName: user.first_name, lastName: user.last_name });

  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.first_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              {user.first_name} {user.last_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {member.role || "Member"}
            </p>
          </div>
        </div>
        <LoadingLink
          href={`${flags.current_app}/admin/users/${user.id}`}
          className="flex gap-2 items-center"
          size="sm"
        >
          View Profile
        </LoadingLink>
      </CardHeader>
    </Card>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{event.name}</CardTitle>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {format(startDate, "MMM d, yyyy h:mm a")} -{" "}
              {format(endDate, "h:mm a")}
            </span>
          </div>
        </div>
        <LoadingLink
          href={`${flags.current_app}/admin/events/${event.id}`}
          className="flex gap-2 items-center"
          size="sm"
        >
          View Details
        </LoadingLink>
      </CardHeader>
    </Card>
  );
};

export default Page;
