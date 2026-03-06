import { Suspense } from "react";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { Heart, Clock, Users, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import CampaignActions from "./CampaignActions";
import PaymentToast from "./PaymentToast";

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(n);

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Page ───────────────────────────────────────────────────────
export default async function CampaignPage({ params }) {
    const { id } = await params;

    const campaign = await db.campaign.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, image: true } },
            _count: { select: { donations: true } },
            donations: {
                take: 8,
                orderBy: { created_at: "desc" },
                include: {
                    user: { select: { name: true, image: true } },
                },
            },
        },
    });

    if (!campaign) notFound();

    const pct = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);
    const createdDaysAgo = Math.max(
        Math.ceil((Date.now() - new Date(campaign.created_at).getTime()) / 86_400_000),
        1
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Payment result toast */}
            <Suspense fallback={null}>
                <PaymentToast />
            </Suspense>

            {/* ── Top bar ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={15} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Campaigns
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* ── LEFT: Main content ─────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Hero image */}
                        <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden bg-gray-100 mb-8 shadow-sm">
                            {campaign.image_url ? (
                                <img
                                    src={campaign.image_url}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Heart className="w-20 h-20 text-gray-200" />
                                </div>
                            )}
                        </div>

                        {/* Campaign meta */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">

                            {/* Stats row */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-5 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    {campaign._count.donations} donors
                                </span>
                                <span className="text-gray-200">|</span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    {createdDaysAgo} day{createdDaysAgo !== 1 ? "s" : ""} running
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                                {campaign.title}
                            </h1>

                            {/* Organiser */}
                            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
                                {campaign.user.image ? (
                                    <img src={campaign.user.image} alt={campaign.user.name} className="w-10 h-10 rounded-full border border-gray-200" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                        {campaign.user.name?.charAt(0) ?? "U"}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Organised by</p>
                                    <p className="font-semibold text-gray-800 text-sm">{campaign.user.name ?? "Anonymous"}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">About this campaign</h2>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                                    {campaign.description}
                                </div>
                            </div>
                        </div>

                        {/* Recent donors — mobile only (duplicated from sidebar below lg) */}
                        <div className="block lg:hidden bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <DonorList donations={campaign.donations} />
                        </div>
                    </div>

                    {/* ── RIGHT: Sticky Sidebar ──────────────────── */}
                    <aside className="w-full lg:w-96 shrink-0">
                        <div className="sticky top-24 space-y-6">

                            {/* Fundraising summary */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                {/* Amounts */}
                                <div className="mb-2">
                                    <span className="text-3xl font-extrabold text-gray-900">{fmt(campaign.raised_amount)}</span>
                                    <span className="text-gray-400 text-sm ml-2">raised of {fmt(campaign.target_amount)}</span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-5">
                                    <div
                                        className="bg-primary-500 h-3 rounded-full relative overflow-hidden"
                                        style={{ width: `${pct}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between text-sm text-gray-500 mb-6">
                                    <span><strong className="text-gray-900">{campaign._count.donations}</strong> donations</span>
                                    <span><strong className="text-gray-900">{Math.round(pct)}%</strong> of goal</span>
                                </div>

                                {/* Actions (Donate + Share) */}
                                <CampaignActions
                                    campaignId={campaign.id}
                                    campaignTitle={campaign.title}
                                    isCompleted={campaign.raised_amount >= campaign.target_amount}
                                />

                                {/* Trust badge */}
                                <div className="flex items-start gap-3 pt-4 border-t border-gray-100 mt-2">
                                    <div className="bg-green-50 p-2 rounded-full text-green-600 shrink-0">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        <strong className="text-gray-600">Guaranteed safe & secure.</strong> Your donation is protected — full refund if something goes wrong.
                                    </p>
                                </div>
                            </div>

                            {/* Recent donors — desktop */}
                            <div className="hidden lg:block bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <DonorList donations={campaign.donations} />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

// ── Recent Donors list ─────────────────────────────────────────
function DonorList({ donations }) {
    const fmt = (n) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    return (
        <>
            <h3 className="font-bold text-gray-900 text-base mb-5">
                Recent Donations {donations.length > 0 && <span className="text-gray-400 font-normal">({donations.length})</span>}
            </h3>

            {donations.length === 0 ? (
                <div className="text-center py-8">
                    <Heart className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Be the first to donate!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {donations.map((d) => (
                        <li key={d.id} className="flex items-center gap-3">
                            {/* Avatar */}
                            {d.user.image ? (
                                <img src={d.user.image} alt={d.user.name} className="w-9 h-9 rounded-full border border-gray-100 shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm border border-primary-100 shrink-0">
                                    {d.user.name?.charAt(0) ?? "A"}
                                </div>
                            )}
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-800 truncate">{d.user.name ?? "Anonymous"}</p>
                                <p className="text-xs text-gray-400">{timeAgo(d.created_at)}</p>
                            </div>
                            {/* Amount */}
                            <span className="text-sm font-bold text-primary-600 shrink-0">{fmt(d.amount)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
