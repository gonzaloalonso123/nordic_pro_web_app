"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Users } from "lucide-react"
import { useClientData } from "@/utils/data/client"
import Link from "next/link"
import { useUrl } from "@/hooks/use-url"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface FormHistoryProps {
  teamId: string
}

export function FormHistory({ teamId }: FormHistoryProps) {
  const { data: sentFormInvitations, isPending: sentFormsPending } = useClientData().formInvitations.useByTeam(teamId)
  const path = useUrl()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form History</CardTitle>
        <CardDescription>Previously sent forms and their responses</CardDescription>
      </CardHeader>
      <CardContent>
        {sentFormsPending ? (
          <div className="space-y-3">
            <Skeleton className="h-[120px] w-full rounded-md" />
            <Skeleton className="h-[120px] w-full rounded-md" />
          </div>
        ) : sentFormInvitations && sentFormInvitations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sentFormInvitations.map((invitation) => (
              <FormCard key={invitation.id} invitation={invitation} path={path} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No forms sent yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When you send forms to this team, they will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FormCardProps {
  invitation: any
  path: string
}

function FormCard({ invitation, path }: FormCardProps) {
  const responded = invitation.invitations?.filter((inv: any) => inv.response).length || 0
  const total = invitation.invitations?.length || 0
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-base">{invitation.form.title}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2">
            {responseRate}% complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Sent on {new Date(invitation.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {responded} of {total} responses received
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-4 py-3">
        <Link href={`${path}/forms/${invitation.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            View Results
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
