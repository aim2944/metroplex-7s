import { Router } from 'express';
import { prisma } from '../index.js';

export const teamsRouter = Router();

// Public: get confirmed teams
teamsRouter.get('/', async (_req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: { status: 'CONFIRMED' },
      select: { id: true, name: true, logoUrl: true },
      orderBy: { name: 'asc' },
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Public: register a new team
teamsRouter.post('/register', async (req, res) => {
  try {
    const { teamName, captain, players } = req.body;

    const team = await prisma.team.create({
      data: {
        name: teamName,
        status: 'INTERESTED',
        captain: {
          create: {
            firstName: captain.firstName,
            lastName: captain.lastName,
            email: captain.email,
            phone: captain.phone,
            waiverSigned: captain.waiverSigned || false,
          },
        },
        players: {
          create: (players || []).map((p: { firstName: string; lastName: string; jerseyNumber?: number }) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            jerseyNumber: p.jerseyNumber || null,
          })),
        },
      },
      include: { captain: true, players: true },
    });

    // Create standing entry for the team
    await prisma.standing.create({
      data: { teamId: team.id },
    });

    res.status(201).json({
      teamId: team.id,
      teamName: team.name,
      zelleMemoRef: `MSL7s-${team.name.replace(/\s+/g, '-').toUpperCase()}`,
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'A captain with this email is already registered' });
      return;
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});
