import { Router } from 'express';
import { prisma } from '../index.js';

export const matchesRouter = Router();

// Public: get all matches
matchesRouter.get('/', async (req, res) => {
  try {
    const { phase, status } = req.query;
    const where: any = {};
    if (phase) where.phase = phase;
    if (status) where.status = status;

    const matches = await prisma.match.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    // Attach team names
    const teamIds = [...new Set(matches.flatMap(m => [m.homeTeamId, m.awayTeamId]))];
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true, name: true, logoUrl: true },
    });
    const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

    const enriched = matches.map(m => ({
      ...m,
      homeTeam: teamMap[m.homeTeamId] || { name: 'TBD' },
      awayTeam: teamMap[m.awayTeamId] || { name: 'TBD' },
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});
