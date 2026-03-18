import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import Link from "next/link";
import { Heart, ArrowLeft, TrendingUp, Users, DollarSign } from "lucide-react";
import CampaignList from "./CampaignList";

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });


// ── Page ───────────────────────────────────────────────────────
export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/?signin=true");

    const userId = session.user.id;

    // Fetch user's campaigns and donations in parallel
    const [campaigns, donations] = await Promise.all([
        db.campaign.findMany({
            where: { userId },
            orderBy: { created_at: "desc" },
            include: { _count: { select: { donations: true } } },
        }),
        db.donation.findMany({
            where: { userId },
            orderBy: { created_at: "desc" },
            include: { campaign: { select: { id: true, title: true } } },
        }),
    ]);

    const totalRaised = campaigns.reduce((sum, c) => sum + c.raised_amount, 0);
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col font-sans relative overflow-hidden">
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40%] h-[50%] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-pink-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>

            {/* ── Top bar ───────────────────────────────────────── */}
            <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={15} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        {session.user.image
                            ? <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                            : <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">{session.user.name?.charAt(0) ?? "U"}</div>
                        }
                        <span className="text-sm font-semibold text-gray-800">{session.user.name}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

                {/* ── Header ──────────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">My Dashboard</h1>
                    <p className="text-gray-500 text-sm">Everything about your fundraising activity in one place.</p>
                </div>

                {/* ── Stats row ───────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Heart, label: "Campaigns Started", value: campaigns.length, color: "bg-pink-50   text-pink-600" },
                        { icon: TrendingUp, label: "Total Raised", value: fmt(totalRaised), color: "bg-green-50  text-green-600" },
                        { icon: Users, label: "Total Donors", value: campaigns.reduce((s, c) => s + c._count.donations, 0), color: "bg-blue-50 text-blue-600" },
                        { icon: DollarSign, label: "Total Donated", value: fmt(totalDonated), color: "bg-purple-50 text-purple-600" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* ── My Campaigns (3/5) ───────────────────────── */}
                    <section className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">My Campaigns</h2>
                            <Link href="/create" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                + New Campaign
                            </Link>
                        </div>

                        <CampaignList campaigns={campaigns} />
                    </section>

                    {/* ── Donation History (2/5) ───────────────────── */}
                    <section className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Donation History</h2>

                        {donations.length === 0 ? (
                            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 text-center">
                                <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No donations yet.</p>
                                <Link href="/#campaigns" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline">Explore causes →</Link>
                            </div>
                        ) : (
                            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
                                <ul className="divide-y divide-white/20">
                                    {donations.map((d) => (
                                        <li key={d.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors">
                                            {/* Amount bubble */}
                                            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-extrabold text-green-600">{fmt(d.amount).replace("$", "")}</span>
                                            </div>
                                            {/* Campaign */}
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/campaign/${d.campaign.id}`} className="font-semibold text-sm text-gray-800 hover:text-primary-600 transition-colors line-clamp-1">
                                                    {d.campaign.title}
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-0.5">{fmtDate(d.created_at)}</p>
                                            </div>
                                            {/* Amount */}
                                            <span className="font-bold text-sm text-green-600 shrink-0">{fmt(d.amount)}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Total */}
                                <div className="px-5 py-3 bg-black/5 backdrop-blur-md border-t border-white/30 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Donated</span>
                                    <span className="font-extrabold text-gray-800">{fmt(totalDonated)}</span>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
