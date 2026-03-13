import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// Get all teams (all statuses)
adminRouter.get('/teams', async (_req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: { captain: true, players: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Update team status/payment
adminRouter.patch('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, depositPaid, fullFeePaid, zelleMemoRef } = req.body;
    const data: any = {};
    if (status !== undefined) data.status = status;
    if (depositPaid !== undefined) data.depositPaid = depositPaid;
    if (fullFeePaid !== undefined) data.fullFeePaid = fullFeePaid;
    if (zelleMemoRef !== undefined) data.zelleMemoRef = zelleMemoRef;

    const team = await prisma.team.update({
      where: { id },
      data,
      include: { captain: true, players: true },
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
adminRouter.delete('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.player.deleteMany({ where: { teamId: id } });
    await prisma.captain.deleteMany({ where: { teamId: id } });
    await prisma.standing.deleteMany({ where: { teamId: id } });
    await prisma.team.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Get all matches (admin view)
adminRouter.get('/matches', async (_req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
    const teamIds = [...new Set(matches.flatMap(m => [m.homeTeamId, m.awayTeamId]))];
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true, name: true },
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

// Create match
adminRouter.post('/matches', async (req, res) => {
  try {
    const { homeTeamId, awayTeamId, date, time, venue, phase, week } = req.body;
    const match = await prisma.match.create({
      data: { homeTeamId, awayTeamId, date: new Date(date), time, venue, phase: phase || 'LEAGUE', week },
    });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// Update match score — auto-updates standings
adminRouter.patch('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, status } = req.body;

    const existingMatch = await prisma.match.findUnique({ where: { id } });
    if (!existingMatch) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    // If match was already completed, reverse the old result first
    if (existingMatch.status === 'COMPLETED' && existingMatch.homeScore !== null && existingMatch.awayScore !== null) {
      await reverseMatchResult(existingMatch.homeTeamId, existingMatch.awayTeamId, existingMatch.homeScore, existingMatch.awayScore);
    }

    const match = await prisma.match.update({
      where: { id },
      data: {
        homeScore,
        awayScore,
        status: status || (homeScore !== undefined ? 'COMPLETED' : existingMatch.status),
      },
    });

    // Apply new result to standings
    if (homeScore !== undefined && awayScore !== undefined) {
      await applyMatchResult(match.homeTeamId, match.awayTeamId, homeScore, awayScore);
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update match' });
  }
});

async function applyMatchResult(homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
  const homePoints = homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
  const awayPoints = awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0;

  await prisma.standing.upsert({
    where: { teamId: homeTeamId },
    update: {
      played: { increment: 1 },
      won: { increment: homeScore > awayScore ? 1 : 0 },
      drawn: { increment: homeScore === awayScore ? 1 : 0 },
      lost: { increment: homeScore < awayScore ? 1 : 0 },
      goalsFor: { increment: homeScore },
      goalsAgainst: { increment: awayScore },
      points: { increment: homePoints },
    },
    create: { teamId: homeTeamId, played: 1, won: homeScore > awayScore ? 1 : 0, drawn: homeScore === awayScore ? 1 : 0, lost: homeScore < awayScore ? 1 : 0, goalsFor: homeScore, goalsAgainst: awayScore, points: homePoints },
  });

  await prisma.standing.upsert({
    where: { teamId: awayTeamId },
    update: {
      played: { increment: 1 },
      won: { increment: awayScore > homeScore ? 1 : 0 },
      drawn: { increment: awayScore === homeScore ? 1 : 0 },
      lost: { increment: awayScore < homeScore ? 1 : 0 },
      goalsFor: { increment: awayScore },
      goalsAgainst: { increment: homeScore },
      points: { increment: awayPoints },
    },
    create: { teamId: awayTeamId, played: 1, won: awayScore > homeScore ? 1 : 0, drawn: awayScore === homeScore ? 1 : 0, lost: awayScore < homeScore ? 1 : 0, goalsFor: awayScore, goalsAgainst: homeScore, points: awayPoints },
  });
}

async function reverseMatchResult(homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
  const homePoints = homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
  const awayPoints = awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0;

  await prisma.standing.update({
    where: { teamId: homeTeamId },
    data: {
      played: { decrement: 1 },
      won: { decrement: homeScore > awayScore ? 1 : 0 },
      drawn: { decrement: homeScore === awayScore ? 1 : 0 },
      lost: { decrement: homeScore < awayScore ? 1 : 0 },
      goalsFor: { decrement: homeScore },
      goalsAgainst: { decrement: awayScore },
      points: { decrement: homePoints },
    },
  });

  await prisma.standing.update({
    where: { teamId: awayTeamId },
    data: {
      played: { decrement: 1 },
      won: { decrement: awayScore > homeScore ? 1 : 0 },
      drawn: { decrement: awayScore === homeScore ? 1 : 0 },
      lost: { decrement: awayScore < homeScore ? 1 : 0 },
      goalsFor: { decrement: awayScore },
      goalsAgainst: { decrement: homeScore },
      points: { decrement: awayPoints },
    },
  });
}

// Manage rules
adminRouter.post('/rules', async (req, res) => {
  try {
    const { section, title, content, sortOrder } = req.body;
    const rule = await prisma.rule.create({
      data: { section, title, content, sortOrder: sortOrder || 0 },
    });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

adminRouter.put('/rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { section, title, content, sortOrder } = req.body;
    const rule = await prisma.rule.update({
      where: { id },
      data: { section, title, content, sortOrder },
    });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rule' });
  }
});
