
const { hash } = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

interface Leaderboard {
  id?: number,
  teamId: number,
  leagueId: number,
}
interface League {
  id?: number,
  name: string,
  code: string,
  slug: string,
  region: string,
  season: number,
  gameId: number,
}
interface Team {
  id?: number,
  name: string,
  code: string
}
interface User {
  id?: string,
  username: string,
  name: string,
  email: string,
  role: string,
  password: string
}
interface Match {
  id?: string,
  dateTime: string,
  homeTeamId: number,
  awayTeamId: number,
  homeScore: number,
  awayScore: number,
}
async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  const hashedAdminPassword = await hash('myname', 10);
  const hashedUserPassword = await hash('myname', 10);
  await insertUser({ username: "admin", name: "admin", email: "admin@mail.com", role: adminRole.name, password: hashedAdminPassword })
  await insertUser({ username: "user", name: "user", email: "user@mail.com", role: userRole.name, password: hashedUserPassword })

  const ml = await prisma.game.upsert({
    where: { slug: 'mobile-legends' },
    update: {},
    create: {
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      
    },
  });
  const mplid: League = {
    name: "Mobile Legends Professional League Indonesia",
    code: "MPL ID",
    slug: "mpl-id-s15",
    region: "indonesia",
    season: 15,
    gameId: ml.id
  }
  const mplph: League = {
    name: "Mobile Legends Professional League Philippines",
    code: "MPL ID",
    slug: "mpl-ph-s15",
    region: "indonesia",
    season: 15,
    gameId: ml.id
  }

  const mplidData = await insertLeague(mplid)
  const mplphData = await insertLeague(mplph)

  const teams = [
    { name: 'Rex Regum Qeon Hoshi', code: 'RRQ' },
    { name: 'Evos', code: 'EVOS' },
    { name: 'Onic', code: 'ONIC' },
    { name: 'Bigetron Esports', code: 'BTR' },
    { name: 'Alter Ego', code: 'AE' },
    { name: 'Dewa United Esports', code: 'DEWA' },
    { name: 'Natus Vincere', code: 'NAVI' },
    { name: 'Team Liquid ID', code: 'TLID' },
    { name: 'Geek Fams', code: 'GEEK' },
  ]
  const teamsph = [
    { name: 'Team Liquid PH', code: 'TLPH' },
    { name: 'Aurora Gaming', code: 'RORA' },
    { name: 'ONIC Philippines', code: 'ONIC' },
    { name: 'Team Falcons PH', code: 'FLCN' },
    { name: 'TNC Pro Team', code: 'TNC' },
    { name: 'Twisted Minds PH', code: 'TWIS' },
    { name: 'AP.Bren', code: 'APBR' },
    { name: ' Omega Esports', code: 'OMG' },
  ]
  await Promise.all(
    teams.map(async (i) => {
      const team = await insertTeam(i);
      await insertLeaderboard({ teamId: team, leagueId: mplidData });
    })
  );
  teamsph.map(async (i) => {
    const team = await insertTeam(i);
    await insertLeaderboard({ teamId: team, leagueId: mplphData });
  })
  // const match1 = insertMatch(1, 2, "2025-06-01T16:00:00Z", 1)
  // const match2 = insertMatch(3, 4, "2025-06-02T18:00:00Z", 1)
  // const match3 = insertMatch(5, 6, "2025-06-02T20:00:00Z", 1)

  console.log('✅ Seed berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());



const insertLeague = async (dataLeague: League) => {
  const data = await prisma.league.upsert({
    where: { slug: dataLeague.slug },
    update: dataLeague,
    create: dataLeague
  })
  return data.id
}
const insertTeam = async (dataTeam: Team) => {
  const data = await prisma.team.upsert({
    where: { code: dataTeam.code },
    update: dataTeam,
    create: dataTeam
  })
  return data.id
}
const insertLeaderboard = async (team: Leaderboard) => {
  const data = await prisma.leaderboard.upsert({
    where: {
      teamId_leagueId: {
        teamId: team.teamId,
        leagueId: team.leagueId,
      },
    },
    update: team,
    create: team
  })
  return data.id
}
const insertUser = async (user: User) => {
  const userData = await prisma.user.upsert({
    where: { username: user.username },
    update: user,
    create: user,
  })
}
const insertMatch = async (homeTeam: number, awayTeam: number, date: string, leagueId: number) => {
  const data = await prisma.match.create({
    data: {
      date: new Date(date).toISOString(),
      homeTeamId: homeTeam,
      awayTeamId: awayTeam,
      homeScore: 2,
      awayScore: 1,
      leagueId,
    }
  })

  await prisma.leaderboard.update({
    where: {
      teamId_leagueId: {
        teamId: homeTeam,
        leagueId: data.leagueId
      }
    },
    data: { point: { increment: data.homeScore } }
  })
  await prisma.leaderboard.update({
    where: {
      teamId_leagueId: {
        teamId: awayTeam,
        leagueId: data.leagueId
      }
    },
    data: { point: { increment: data.awayScore } }
  })

  return data
}

// const formattedDataLeaderboard = (data:League[]) => {
//   return data.map((item) => ({
//     id: item.id,
//     point: item.point,
//     teamName: item.team?.name ?? "Unknown",
//     teamCode: item.team?.code ?? "-",
//   }));
// }