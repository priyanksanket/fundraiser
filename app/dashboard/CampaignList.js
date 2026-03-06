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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-gray-500 font-medium">No campaigns yet.</p>
                <Link href="/create" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline">
                    Start your first campaign →
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Raised</th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Donors</th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {campaigns.map((c) => {
                        const displayStatus = getDisplayStatus(c);
                        const config = STATUS_CONFIG[displayStatus];
                        const pct = Math.min((c.raised_amount / c.target_amount) * 100, 100);

                        return (
                            <tr key={c.id} className={`transition-colors ${config.row} hover:bg-gray-50/70`}>
                                {/* Title + progress */}
                                <td className="px-5 py-4">
                                    <p className={`font-semibold leading-snug line-clamp-1 ${displayStatus === "terminated" ? "line-through text-gray-400" : "text-gray-800"}`}>
                                        {c.title}
                                    </p>
                                    <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-1.5 rounded-full ${displayStatus === "completed" ? "bg-green-400" : displayStatus === "terminated" ? "bg-gray-300" : "bg-primary-500"}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(c.created_at)}</p>
                                </td>

                                {/* Raised / Goal */}
                                <td className="px-4 py-4 text-right hidden sm:table-cell">
                                    <span className="font-bold text-gray-800">{fmt(c.raised_amount)}</span>
                                    <p className="text-xs text-gray-400">of {fmt(c.target_amount)}</p>
                                </td>

                                {/* Status badge */}
                                <td className="px-4 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badge}`}>
                                        {config.label}
                                    </span>
                                </td>

                                {/* Donor count */}
                                <td className="px-4 py-4 text-center hidden md:table-cell">
                                    <span className="font-semibold text-gray-700">{c._count.donations}</span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={`/campaign/${c.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-primary-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                                            title="View campaign"
                                        >
                                            <ExternalLink size={13} />
                                        </Link>
                                        <TerminateButton campaignId={c.id} status={displayStatus} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
