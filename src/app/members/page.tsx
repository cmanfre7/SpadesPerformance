import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample member data
const members = [
  { id: "1", username: "mike_evo", car: "Evo IX", verified: true },
  { id: "2", username: "stisnow", car: "STI", verified: true },
  { id: "3", username: "m3_dan", car: "M3", verified: false },
  { id: "4", username: "boosted_civic", car: "CTR", verified: false },
];

export default function MembersPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">MEMBERS</h1>
        </div>
      </section>

      {/* List */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="py-4 border-b border-white/5"
              >
                <div className="font-mono text-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/50">@{member.username}</span>
                    {member.verified && (
                      <span className="text-spades-gold/50">*</span>
                    )}
                  </div>
                  <span className="text-white/20">{member.car}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
