import type {
  ProjectDTO,
  ProfileDTO,
  CreateContactInput,
} from '@portfolio/shared-types';

// Server-side base URL (defaults to local backend). Falls back to the public
// var so a single env works for both server and client if desired.
const API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3001';

/**
 * Fetch published projects from the backend (server-side, revalidated).
 * On any failure returns `null` so the caller can fall back to static data
 * and the public site never breaks when the API is briefly unavailable.
 */
export async function fetchProjects(): Promise<ProjectDTO[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      // ISR: cache and revalidate every 60s.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ProjectDTO[];
  } catch {
    return null;
  }
}

/**
 * Fetch site content (personal info, social links, nav items, skills) from the
 * backend (server-side, revalidated). Returns `null` on any failure so callers
 * can degrade gracefully instead of crashing the render.
 */
export async function fetchProfile(): Promise<ProfileDTO | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      // ISR: cache and revalidate every 60s.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ProfileDTO;
  } catch {
    return null;
  }
}

export interface SubmitContactResult {
  ok: boolean;
  status?: number;
  message?: string;
}

/** Submit the contact form to the backend (client-side). */
export async function submitContact(
  input: CreateContactInput
): Promise<SubmitContactResult> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (res.ok) return { ok: true, status: res.status };
    let message = 'Failed to send message';
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      // ignore parse errors
    }
    return { ok: false, status: res.status, message };
  } catch {
    return { ok: false, message: 'Network error' };
  }
}
