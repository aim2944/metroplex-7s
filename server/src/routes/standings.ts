import { Router } from 'express';
import { prisma } from '../index.js';

export const standingsRouter = Router();

standingsRouter.get('/', async (_req, res) => {
  try {
    const standings = await prisma.standing.findMany({
      include: {
        team: { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: [
        { points: 'desc' },
        { goalsFor: 'desc' },
      ],
    });

    const enriched = standings.map(s => ({
      ...s,
      goalDifference: s.goalsFor - s.goalsAgainst,
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});
