"use client";

import { useState, useTransition } from "react";
import { terminateCampaign } from "@/app/actions/campaigns";
import Link from "next/link";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";

const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function getDisplayStatus(campaign) {
    if (campaign.status === "Terminated") return "terminated";
    if (campaign.raised_amount >= campaign.target_amount) return "completed";
    if (campaign.raised_amount > 0) return "in_progress";
    return "active";
}

const STATUS_CONFIG = {
    completed: { label: "✅ Funded", badge: "bg-green-100 text-green-700 border-green-200", row: "bg-green-50/40" },
    terminated: { label: "🚫 Terminated", badge: "bg-red-100 text-red-600 border-red-200", row: "bg-red-50/30 opacity-60" },
    in_progress: { label: "🔵 In Progress", badge: "bg-blue-100 text-blue-700 border-blue-200", row: "" },
    active: { label: "⚪ Just Started", badge: "bg-gray-100 text-gray-600 border-gray-200", row: "" },
};

function TerminateButton({ campaignId, status }) {
    const [isPending, startTransition] = useTransition();
    const [confirmed, setConfirmed] = useState(false);

    if (status === "terminated") {
        return <span className="text-xs text-gray-400 italic">Terminated</span>;
    }

    const handleClick = () => {
        if (!confirmed) {
            setConfirmed(true);
            // Auto-reset confirmation after 4s if user doesn't click again
            setTimeout(() => setConfirmed(false), 4000);
            return;
        }
        startTransition(async () => {
            await terminateCampaign(campaignId);
            setConfirmed(false);
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${confirmed
                ? "bg-red-600 text-white border-red-600 hover:bg-red-700 animate-pulse"
                : "bg-white text-red-500 border-red-200 hover:bg-red-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isPending ? (
                <Loader2 size={12} className="animate-spin" />
            ) : (
                <Trash2 size={12} />
            )}
            {isPending ? "Terminating…" : confirmed ? "Confirm?" : "Terminate"}
        </button>
    );
}

export default function CampaignList({ campaigns }) {
    if (campaigns.length === 0) {
        return (
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 text-center">
                <p className="text-gray-500 font-medium">No campaigns yet.</p>
                <Link href="/create" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline">
                    Start your first campaign →
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {campaigns.map((c) => {
                const displayStatus = getDisplayStatus(c);
                const config = STATUS_CONFIG[displayStatus];
                const pct = Math.min((c.raised_amount / c.target_amount) * 100, 100);

                return (
                    <div
                        key={c.id}
                        className={`bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-5 transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] flex flex-col gap-4 relative group ${displayStatus === "terminated" ? "opacity-75" : ""}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/campaign/${c.id}`}
                                    className={`text-lg font-bold tracking-tight hover:text-primary-600 transition-colors block truncate ${displayStatus === "terminated" ? "line-through text-gray-400" : "text-gray-900"}`}
                                >
                                    {c.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    Started {fmtDate(c.created_at)}
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    {c._count.donations} donors
                                </p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${config.badge}`}>
                                {config.label}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-gray-900 leading-tight">{fmt(c.raised_amount)}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Raised of {fmt(c.target_amount)}</span>
                                </div>
                                <span className="text-sm font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{Math.round(pct)}%</span>
                            </div>
                            <div className="w-full bg-black/5 rounded-full h-2.5 overflow-hidden border border-white/20">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${displayStatus === "completed" ? "bg-green-400" : displayStatus === "terminated" ? "bg-gray-300" : "bg-gradient-to-r from-primary-500 to-indigo-500"}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/30">
                            <Link
                                href={`/campaign/${c.id}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-white/60 transition-all border border-transparent hover:border-white/50"
                            >
                                <ExternalLink size={14} />
                                View Details
                            </Link>
                            <TerminateButton campaignId={c.id} status={displayStatus} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

