import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample member data - will be replaced with Supabase
const members = [
  {
    id: "1",
    username: "mike_evo",
    name: "Mike R.",
    avatar: null,
    tier: "verified",
    badges: ["OG", "Track Verified", "Organizer"],
    car: "2006 Mitsubishi Evo IX",
    joinedDate: "2023-01-15",
    eventsAttended: 24,
    location: "Denver",
  },
  {
    id: "2",
    username: "stisnow",
    name: "Sarah T.",
    avatar: null,
    tier: "verified",
    badges: ["Winter Crew", "Helper"],
    car: "2020 Subaru STI",
    joinedDate: "2023-06-20",
    eventsAttended: 18,
    location: "Aurora",
  },
  {
    id: "3",
    username: "m3_dan",
    name: "Dan K.",
    avatar: null,
    tier: "member",
    badges: ["Track Verified"],
    car: "2019 BMW M3 Competition",
    joinedDate: "2024-02-10",
    eventsAttended: 8,
    location: "Lakewood",
  },
  {
    id: "4",
    username: "boosted_civic",
    name: "Chris M.",
    avatar: null,
    tier: "member",
    badges: [],
    car: "2018 Honda Civic Type R",
    joinedDate: "2024-08-01",
    eventsAttended: 3,
    location: "Littleton",
  },
];

const badges = [
  { name: "OG", description: "Original member", color: "bg-purple-500" },
  { name: "Track Verified", description: "Attended track events", color: "bg-red-500" },
  { name: "Organizer", description: "Helps organize events", color: "bg-blue-500" },
  { name: "Helper", description: "Community contributor", color: "bg-green-500" },
  { name: "Winter Crew", description: "Attends winter meets", color: "bg-cyan-500" },
];

function getTierBadge(tier: string) {
  switch (tier) {
    case "verified":
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-spades-gold/20 text-spades-gold text-xs font-semibold rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    case "crew":
      return (
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
          Crew
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 bg-white/10 text-white/60 text-xs font-semibold rounded">
          Member
        </span>
      );
  }
}

export default function MembersPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Members</h1>
          <p className="text-white/60 max-w-2xl">
            The verified community behind Denver&apos;s best car meets.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
          <select className="bg-spades-gray border border-white/10 rounded-lg px-4 py-2 text-sm">
            <option>All Tiers</option>
            <option>Verified</option>
            <option>Crew</option>
            <option>Member</option>
          </select>
          <select className="bg-spades-gray border border-white/10 rounded-lg px-4 py-2 text-sm">
            <option>All Areas</option>
            <option>Denver</option>
            <option>Aurora</option>
            <option>Lakewood</option>
            <option>Littleton</option>
          </select>
          <select className="bg-spades-gray border border-white/10 rounded-lg px-4 py-2 text-sm">
            <option>All Interests</option>
            <option>Meets</option>
            <option>Track</option>
            <option>Cruises</option>
          </select>
        </div>
      </section>

      {/* Badge Legend */}
      <section className="py-6 px-4 bg-spades-gray/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-semibold text-white/50 mb-3">Badges</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"
              >
                <span className={`w-2 h-2 rounded-full ${badge.color}`} />
                <span className="text-sm">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.username}`}
                className="card hover:border-white/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <SpadeIcon className="w-8 h-8 text-white/30" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      {getTierBadge(member.tier)}
                    </div>
                    <p className="text-sm text-white/50 mb-2">@{member.username}</p>
                    <p className="text-sm text-white/70 truncate">{member.car}</p>
                  </div>
                </div>

                {/* Badges */}
                {member.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {member.badges.map((badge) => {
                      const badgeInfo = badges.find((b) => b.name === badge);
                      return (
                        <span
                          key={badge}
                          className={`px-2 py-0.5 text-xs rounded ${
                            badgeInfo?.color
                          }/20 text-white/80`}
                        >
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-sm text-white/50">
                  <span>{member.eventsAttended} events</span>
                  <span>•</span>
                  <span>{member.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
