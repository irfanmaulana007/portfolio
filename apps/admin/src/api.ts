import type {
  ProjectDTO,
  ContactSubmissionDTO,
  ContactStatus,
  CreateProjectInput,
  UpdateProjectInput,
  LoginResponse,
  AdminMe,
} from '@portfolio/shared-types';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:3001';

const TOKEN_KEY = 'portfolio_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    tokenStore.clear();
    throw new ApiRequestError(401, 'Session expired, please log in again');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      // ignore
    }
    throw new ApiRequestError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<AdminMe>('/api/admin/me'),

  // Projects
  listProjects: () => request<ProjectDTO[]>('/api/admin/projects'),
  getProject: (id: number) => request<ProjectDTO>(`/api/admin/projects/${id}`),
  createProject: (data: CreateProjectInput) =>
    request<ProjectDTO>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: UpdateProjectInput) =>
    request<ProjectDTO>(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Contacts
  listContacts: (status?: ContactStatus) =>
    request<{
      items: ContactSubmissionDTO[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/api/admin/contacts${status ? `?status=${status}` : ''}`),
  updateContactStatus: (id: number, status: ContactStatus) =>
    request<ContactSubmissionDTO>(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
