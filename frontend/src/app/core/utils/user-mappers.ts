import { User } from '../models';

export function mapApiUserToUser(res: any): User {
  let mappedRole: User['role'] = 'foreman';
  const roleUpper = String(res.role || '').toUpperCase();

  if (roleUpper === 'ADMIN') {
    mappedRole = 'admin';
  } else if (roleUpper === 'PROJECT_ENGINEER') {
    mappedRole = 'engineer';
  } else if (roleUpper === 'FOREMAN') {
    mappedRole = 'foreman';
  }

  return {
    id: String(res.id || ''),
    name: res.fullName || '',
    employeeId: res.id ? 'EMP-' + res.id : '',
    companyName: 'BuildGuard Client',
    email: res.email || '',
    phone: res.phone || '',
    role: mappedRole,
    status: 'active'
  };
}

export function mapUserToApiRequest(u: User): any {
  let mappedRole = 'FOREMAN';
  if (u.role === 'admin') mappedRole = 'ADMIN';
  else if (u.role === 'engineer' || u.role === 'inspector') mappedRole = 'PROJECT_ENGINEER';

  return {
    fullName: u.name,
    email: u.email,
    role: mappedRole,
    phone: u.phone || ''
  };
}

export function mapRegistrationFormToApiRequest(form: any): any {
  let mappedRole = 'FOREMAN';
  if (form.role === 'admin') mappedRole = 'ADMIN';
  else if (form.role === 'engineer' || form.role === 'inspector') mappedRole = 'PROJECT_ENGINEER';

  return {
    fullName: form.fullName,
    email: form.email,
    password: form.password,
    role: mappedRole,
    phone: form.phone || form.mobileNumber || ''
  };
}
