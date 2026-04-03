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
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-pulse pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-teal-300 via-emerald-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-pulse pointer-events-none z-0" style={{ animationDelay: "2s" }}></div>
            <div className="fixed bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-gradient-to-tr from-rose-300 via-orange-300 to-amber-300 rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-pulse pointer-events-none z-0" style={{ animationDelay: "4s" }}></div>

            {/* ── Top bar ───────────────────────────────────────── */}
            <div className="bg-white/60 backdrop-blur-2xl border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4 sticky top-0 z-40 transition-all">
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
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 mb-2 tracking-tight">My Dashboard</h1>
                <p className="text-gray-500 text-base font-medium">Everything about your fundraising activity in one place.</p>
            </div>

                {/* ── Stats row ───────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Heart, label: "Campaigns Started", value: campaigns.length, color: "bg-pink-50   text-pink-600" },
                        { icon: TrendingUp, label: "Total Raised", value: fmt(totalRaised), color: "bg-green-50  text-green-600" },
                        { icon: Users, label: "Total Donors", value: campaigns.reduce((s, c) => s + c._count.donations, 0), color: "bg-blue-50 text-blue-600" },
                        { icon: DollarSign, label: "Total Donated", value: fmt(totalDonated), color: "bg-purple-50 text-purple-600" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-sm hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 transform transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                                <Icon size={22} className="opacity-90" />
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                                <p className="text-sm font-semibold text-gray-500 mt-1">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    {/* ── My Campaigns (3/5) ───────────────────────── */}
                    <section className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Campaigns</h2>
                            <Link href="/create" className="text-sm font-bold text-white bg-gray-900 hover:bg-primary-600 transition-colors px-4 py-2.5 rounded-full shadow-md hover:shadow-lg flex items-center gap-1.5 transform hover:-translate-y-0.5">
                                + New Campaign
                            </Link>
                        </div>

                        <CampaignList campaigns={campaigns} />
                    </section>

                    {/* ── Donation History (2/5) ───────────────────── */}
                    <section className="lg:col-span-2">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Donation History</h2>

                        {donations.length === 0 ? (
                            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-10 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
                                <DollarSign className="w-16 h-16 text-gray-200 mx-auto mb-4 drop-shadow-sm" />
                                <p className="text-gray-500 font-medium text-lg">No donations yet.</p>
                                <Link href="/#campaigns" className="mt-4 inline-block text-sm font-bold text-primary-600 hover:text-primary-500 hover:underline transition-colors">Explore causes &rarr;</Link>
                            </div>
                        ) : (
                            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-sm overflow-hidden flex flex-col h-[calc(100%-4rem)]">
                                <ul className="divide-y divide-white/20">
                                    {donations.map((d) => (
                                        <li key={d.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white border-b border-gray-50/50 last:border-0 transition-all duration-200 group">
                                            {/* Amount bubble */}
                                            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors shadow-inner">
                                                <span className="text-sm font-extrabold text-green-600">{fmt(d.amount).replace("$", "")}</span>
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
                                <div className="mt-auto px-6 py-4 bg-gray-50/80 backdrop-blur-md border-t border-white flex justify-between items-center shadow-inner">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Donated</span>
                                    <span className="font-black text-lg text-gray-900">{fmt(totalDonated)}</span>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
