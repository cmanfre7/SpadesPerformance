import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function JoinPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center">
        <SpadeIcon className="w-10 h-10 mx-auto mb-8 text-white/20" />
        <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">INVITE ONLY</h1>
        <p className="text-sm text-white/20 font-mono mb-8">
          Membership is by invite.
        </p>
        <a
          href="https://www.instagram.com/spades_performance/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono"
        >
          @spades_performance
        </a>
      </div>
    </div>
  );
}
