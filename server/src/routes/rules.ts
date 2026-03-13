import { Router } from 'express';
import { prisma } from '../index.js';

export const rulesRouter = Router();

rulesRouter.get('/', async (_req, res) => {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});
