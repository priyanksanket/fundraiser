"use client";

import { useState, useTransition } from "react";
import { terminateCampaign } from "@/app/actions/campaigns";
import Link from "next/link";
import { ExternalLink, Trash2, Loader2, Edit } from "lucide-react";

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
    completed: { label: "✅ Funded", badge: "bg-green-50 text-green-700 border-green-200 shadow-sm", row: "bg-green-50/20" },
    terminated: { label: "🚫 Terminated", badge: "bg-red-50 text-red-600 border-red-200 shadow-sm", row: "bg-red-50/10 opacity-70 grayscale-[50%]" },
    in_progress: { label: "🔵 In Progress", badge: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm", row: "" },
    active: { label: "⚪ Just Started", badge: "bg-gray-50 text-gray-700 border-gray-200 shadow-sm", row: "" },
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
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-12 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">You haven't started any fund-raising campaigns. Create your first one to get started.</p>
                <Link href="/create" className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
                    Start your first campaign &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-sm hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] transition-all overflow-hidden relative group/table">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                            <th className="px-5 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Raised</th>
                            <th className="px-5 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Donors</th>
                            <th className="px-5 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {campaigns.map((c) => {
                            const displayStatus = getDisplayStatus(c);
                            const config = STATUS_CONFIG[displayStatus];
                            const pct = Math.min((c.raised_amount / c.target_amount) * 100, 100);

                            return (
                                <tr key={c.id} className={`transition-all duration-200 ${config.row} hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-10`}>
                                {/* Title + progress */}
                                <td className="px-6 py-5">
                                    <p className={`font-bold text-base leading-tight mb-2 line-clamp-1 ${displayStatus === "terminated" ? "line-through text-gray-400" : "text-gray-900 group-hover/table:text-primary-700 transition-colors"}`}>
                                        {c.title}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${displayStatus === "completed" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : displayStatus === "terminated" ? "bg-gray-300" : "bg-gradient-to-r from-primary-400 to-primary-600"}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1.5 opacity-80">Posted {fmtDate(c.created_at)}</p>
                                </td>

                                {/* Raised / Goal */}
                                <td className="px-5 py-5 text-right hidden sm:table-cell">
                                    <span className="font-extrabold text-gray-900 text-base block">{fmt(c.raised_amount)}</span>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">of {fmt(c.target_amount)}</p>
                                </td>

                                {/* Status badge */}
                                <td className="px-5 py-5 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${config.badge} tracking-wide`}>
                                        {config.label}
                                    </span>
                                </td>

                                {/* Donor count */}
                                <td className="px-4 py-4 text-center hidden md:table-cell">
                                    <span className="font-semibold text-gray-700">{c._count.donations}</span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={`/campaign/${c.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm"
                                            title="View campaign"
                                        >
                                            <ExternalLink size={12} /> View
                                        </Link>
                                        {displayStatus !== "terminated" && (
                                            <Link
                                                href={`/campaign/${c.id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                                                title="Edit campaign"
                                            >
                                                <Edit size={12} />
                                                Edit
                                            </Link>
                                        )}
                                        <TerminateButton campaignId={c.id} status={displayStatus} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    );
}

