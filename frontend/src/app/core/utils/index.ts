import { ROLE_LABELS } from '../constants';

export function getInitials(name?: string): string {
  if (!name) return 'BG';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getUserRoleLabel(role?: string): string {
  if (!role) return '';
  return ROLE_LABELS[role.toLowerCase()] || role;
}
