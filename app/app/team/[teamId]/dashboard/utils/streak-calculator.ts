interface FormInvitation {
  id: string;
  created_at: string;
  user_id: string;
  form_id: string;
  common_invitation_id: string;
  completed: boolean;
}

interface StreakData {
  current: number;
  longest: number;
  lastUpdated: Date;
  history: {
    date: string;
    completed: boolean;
  }[];
}

export function calculateStreakFromInvitations(invitations: FormInvitation[]): StreakData {
  const sortedInvitations = [...invitations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let currentStreak = 0;
  let foundFirstCompleted = false;

  for (const invitation of sortedInvitations) {
    if (invitation.completed) {
      if (!foundFirstCompleted) {
        foundFirstCompleted = true;
      }
      currentStreak++;
    } else if (foundFirstCompleted) {
      break;
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;

  const chronologicalInvitations = [...invitations].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const invitation of chronologicalInvitations) {
    if (invitation.completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  const history: { date: string; completed: boolean }[] = sortedInvitations.slice(0, 7).map((invitation) => ({
    date: new Date(invitation.created_at).toISOString(),
    completed: invitation.completed,
  }));

  return {
    current: currentStreak,
    longest: longestStreak,
    lastUpdated: new Date(),
    history,
  };
}
