export type InitialsInput = {
  firstName?: string | null;
  lastName?: string | null;
} | string | null | undefined;

export const getInitials = (input: InitialsInput): string => {
  if (input && typeof input === 'object') {
    const { firstName, lastName } = input;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    return '';
  }

  if (typeof input === 'string') {
    const trimmedName = input.trim();
    if (!trimmedName) return '';

    const names = trimmedName.split(' ').filter(Boolean);

    if (names.length === 0) {
      return '';
    } else if (names.length === 1) {
      return names[0][0].toUpperCase();
    } else {
      const firstInitial = names[0][0];
      const lastInitial = names[names.length - 1][0];
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
  }

  return '';
};
