import type { ContactStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';

interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createContact(data: CreateContactData) {
  return prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
    },
  });
}

interface ListContactsOptions {
  status?: ContactStatus;
  page?: number;
  pageSize?: number;
}

export async function listContacts(opts: ListContactsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 25));
  const where = opts.status ? { status: opts.status } : {};

  const [items, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getContactById(id: number) {
  const contact = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!contact) throw new AppError(404, 'not_found', 'Contact submission not found');
  return contact;
}

export async function updateContactStatus(id: number, status: ContactStatus) {
  await getContactById(id);
  return prisma.contactSubmission.update({ where: { id }, data: { status } });
}
