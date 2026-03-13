import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const existing = await prisma.user.findUnique({ where: { email: 'admin@msl7s.com' } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: 'admin@msl7s.com',
        passwordHash,
        role: 'ADMIN',
      },
    });
  }

  // Seed rules (clear and re-create)
  await prisma.rule.deleteMany();
  const rules = [
    { section: 'Format', title: 'Game Format', content: '7v7 (6 field players + 1 goalkeeper). Games are 2 x 25-minute halves with a 5-minute halftime.', sortOrder: 1 },
    { section: 'Format', title: 'League Structure', content: 'Round-robin group stage followed by a single-elimination knockout bracket. Top 4 or 8 teams (depending on registration) advance to playoffs.', sortOrder: 2 },
    { section: 'Format', title: 'Field & Venue', content: 'Approximately 60-70 yards long by 40-50 yards wide. Fields are based on the location of both teams playing. Indoor or outdoor depending on conditions.', sortOrder: 3 },
    { section: 'Roster', title: 'Roster Size', content: 'Maximum 12 players per team. Minimum 5 players required to start a match (4 + GK).', sortOrder: 4 },
    { section: 'Roster', title: 'Substitutions', content: 'Unlimited rolling substitutions. Players may re-enter. Subs must enter/exit at the halfway line.', sortOrder: 5 },
    { section: 'Roster', title: 'Player Eligibility', content: 'All players must be 18+ and must have signed the league waiver before their first game.', sortOrder: 6 },
    { section: 'Gameplay', title: 'Kick-Off & Restarts', content: 'Standard FIFA rules apply for kick-offs, throw-ins, goal kicks, and corner kicks.', sortOrder: 7 },
    { section: 'Gameplay', title: 'Offsides', content: 'Offside rule IS enforced.', sortOrder: 8 },
    { section: 'Gameplay', title: 'Slide Tackles', content: 'Slide tackles are NOT allowed. A slide tackle results in an indirect free kick to the opposing team.', sortOrder: 9 },
    { section: 'Gameplay', title: 'Goalkeeper Rules', content: 'Goalkeepers cannot punt the ball past the halfway line in the air. Goal kicks must be taken from the ground.', sortOrder: 10 },
    { section: 'Scoring', title: 'Points System', content: 'Win = 3 points. Draw = 1 point. Loss = 0 points. Tiebreakers: 1) Goal difference, 2) Goals scored, 3) Head-to-head, 4) Coin toss.', sortOrder: 11 },
    { section: 'Discipline', title: 'Yellow & Red Cards', content: '2 yellow cards in one game = red card (ejection for remainder of game). Red card = minimum 1-game suspension. Accumulation: 3 yellows across the season = 1-game suspension.', sortOrder: 12 },
    { section: 'Discipline', title: 'Fighting & Violent Conduct', content: 'Any fighting or violent conduct results in immediate ejection and a minimum 2-game suspension. Severe cases may result in permanent ban from the league.', sortOrder: 13 },
    { section: 'General', title: 'Game Day', content: 'Teams must arrive 15 minutes before scheduled kick-off. A 10-minute grace period is allowed; after that, the match is forfeited 3-0.', sortOrder: 14 },
    { section: 'General', title: 'Referees', content: 'All matches are officiated by certified referees. Referee decisions are final.', sortOrder: 15 },
    { section: 'Fees', title: 'Registration Fee', content: 'Early Bird: $325 per team (first 10 teams). Regular: $375 per team. Fee includes: field rental, referees, trophies for champion and runner-up, and MVP award.', sortOrder: 16 },
    { section: 'Fees', title: 'Payment', content: 'We accept all forms of payment (Zelle, Venmo, CashApp, PayPal, etc.). A $100 deposit is required to reserve your spot. Remaining balance due before the first game. Include your team name in the payment memo.', sortOrder: 17 },
  ];

  for (const rule of rules) {
    await prisma.rule.create({ data: rule });
  }

  console.log('Seed complete: admin user + rules created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
