import { Router } from 'express';
import type { ContactStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/error';
import { contactStatusSchema, updateContactSchema } from '../lib/validation';
import {
  getContactById,
  listContacts,
  updateContactStatus,
} from '../services/contact.service';
import { toContactDTO } from '../lib/serialize';

export const adminContactsRouter = Router();

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'bad_request', 'Invalid id');
  return id;
}

adminContactsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const statusParsed = req.query.status
      ? contactStatusSchema.safeParse(req.query.status)
      : undefined;
    const status =
      statusParsed && statusParsed.success ? (statusParsed.data as ContactStatus) : undefined;

    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

    const result = await listContacts({ status, page, pageSize });
    res.json({
      items: result.items.map(toContactDTO),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  })
);

adminContactsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const contact = await getContactById(parseId(req.params.id));
    res.json(toContactDTO(contact));
  })
);

adminContactsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { status } = updateContactSchema.parse(req.body);
    const contact = await updateContactStatus(parseId(req.params.id), status);
    res.json(toContactDTO(contact));
  })
);
