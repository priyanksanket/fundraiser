"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, Menu, X, ArrowRight, Users, Target, Search, ChevronDown } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

// ── Category config ──────────────────────────────────────────────
const CATEGORIES = {
    medical: { label: "Medical", color: "bg-red-50 text-red-600 border-red-100" },
    education: { label: "Education", color: "bg-blue-50 text-blue-600 border-blue-100" },
    disaster: { label: "Disaster Relief", color: "bg-orange-50 text-orange-600 border-orange-100" },
    creative: { label: "Creative", color: "bg-purple-50 text-purple-600 border-purple-100" },
    other: { label: "Other", color: "bg-gray-50 text-gray-600 border-gray-100" },
};

function getCategory(title = "") {
    const t = title.toLowerCase();
    if (t.includes("heart") || t.includes("surgery") || t.includes("leukemia") || t.includes("cancer") || t.includes("medical")) return "medical";
    if (t.includes("school") || t.includes("library") || t.includes("scholar") || t.includes("education") || t.includes("coding") || t.includes("stem")) return "education";
    if (t.includes("cyclone") || t.includes("wildfire") || t.includes("flood") || t.includes("disaster") || t.includes("relief") || t.includes("earthquake")) return "disaster";
    if (t.includes("film") || t.includes("album") || t.includes("mural") || t.includes("art") || t.includes("music") || t.includes("creative")) return "creative";
    return "other";
}

// ── Campaign Card ────────────────────────────────────────────────
function CampaignCard({ campaign, onView }) {
    const pct = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);
    const cat = getCategory(campaign.title);
    const badge = CATEGORIES[cat];
    const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    return (
        <div className="group bg-blue-50/20 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:shadow-[0_12px_48px_rgba(31,38,135,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
            <div className="relative h-48 overflow-hidden bg-black/5 border-b border-white/30">
                {campaign.image_url ? (
                    <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"><Heart className="w-16 h-16 text-primary-200" /></div>
                )}
                <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border ${badge.color}`}>
                    {badge.label}
                </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">by {campaign.user?.name || "Anonymous"}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{campaign.title}</h3>
                <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                        <span className="text-primary-600">{fmt(campaign.raised_amount)} raised</span>
                        <span className="text-gray-400">of {fmt(campaign.target_amount)}</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden mb-4">
                        <div className="bg-primary-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                        <span className="flex items-center gap-1.5"><Target size={14} />{Math.round(pct)}% funded</span>
                        <span className="flex items-center gap-1.5"><Users size={14} />{campaign._count?.donations ?? 0} donors</span>
                    </div>
                    <button
                        onClick={() => onView(campaign.id)}
                        className="w-full bg-gray-900 hover:bg-primary-600 text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        View Details <ArrowRight size={15} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "funded", label: "Most Funded" },
    { value: "oldest", label: "Closing Soon" },
];

// ── Inner page (needs useSearchParams) ──────────────────────────
function HomeInner() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "all";
    const activeSort = searchParams.get("sort") || "newest";
    const activeQuery = searchParams.get("q") || "";

    useEffect(() => { setSearchInput(activeQuery); }, [activeQuery]);

    // Scroll listener
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Fetch campaigns once
    useEffect(() => {
        fetch("/api/campaigns")
            .then((r) => r.json())
            .then((data) => { setCampaigns(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Generic URL param setter
    const setParam = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        const defaults = { category: "all", sort: "newest", q: "" };
        if (!value || value === defaults[key]) params.delete(key);
        else params.set(key, value);
        router.replace(`/?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => setParam("q", searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    // Filter + sort
    let displayed = campaigns
        .filter((c) => c.status !== "Terminated")
        .filter((c) => activeCategory === "all" || getCategory(c.title) === activeCategory)
        .filter((c) => !activeQuery || c.title.toLowerCase().includes(activeQuery.toLowerCase()));

    if (activeSort === "funded") {
        displayed = [...displayed].sort((a, b) => (b.raised_amount / b.target_amount) - (a.raised_amount / a.target_amount));
    } else if (activeSort === "oldest") {
        displayed = [...displayed].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    const categoryKeys = ["all", ...Object.keys(CATEGORIES)];


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex flex-col font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
            <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent)] pointer-events-none"></div>

            {/* ── Navbar ─────────────────────────────────────────── */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] border-b border-white/30 py-3" : "bg-transparent py-5"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/")}>
                            <div className="bg-primary-500 text-white p-2 rounded-xl group-hover:bg-primary-600 transition-colors"><Heart size={22} /></div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">Fundraiser</span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <a href="#campaigns" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Explore</a>
                            {session ? (
                                <>
                                    {/* Profile */}
                                    <div className="flex items-center gap-2">
                                        {session.user?.image
                                            ? <img src={session.user.image} alt={session.user.name} className="w-9 h-9 rounded-full border border-gray-200 shadow-sm" />
                                            : <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">{session.user?.name?.charAt(0) || "U"}</div>
                                        }
                                        <span className="text-sm font-semibold text-gray-800">{session.user?.name?.split(" ")[0] || "User"}</span>
                                    </div>
                                    <button onClick={() => router.push("/dashboard")} className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Dashboard</button>
                                    <button onClick={() => signOut()} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign Out</button>
                                    <button onClick={() => router.push("/create")} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md">Create Campaign</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => signIn("google")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Login</button>
                                    <button onClick={() => signIn("google")} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md">Start a Campaign</button>
                                </>
                            )}
                        </div>

                        <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 flex flex-col gap-4 pt-4">
                            <a href="#campaigns" className="text-sm font-medium text-gray-700">Explore</a>
                            {session ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        {session.user?.image && <img src={session.user.image} className="w-8 h-8 rounded-full" alt="" />}
                                        <span className="font-semibold text-sm">{session.user?.name?.split(" ")[0]}</span>
                                    </div>
                                    <button onClick={() => signOut()} className="text-sm text-gray-600 text-left">Sign Out</button>
                                    <button onClick={() => router.push("/create")} className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">Create Campaign</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => signIn("google")} className="text-sm text-gray-600 text-left">Login</button>
                                    <button onClick={() => signIn("google")} className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">Start a Campaign</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────────────── */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center pt-36 pb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                    </span>
                    Over $10M raised for good causes
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-[1.1] mb-6">
                    Fund what{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-teal-400">matters</span>
                    {" "}to you.
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
                    The most trusted platform to raise funds for medical emergencies, educational needs, community projects, and personal dreams.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => session ? router.push("/create") : signIn("google")} className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:-translate-y-1 shadow-lg">
                        Start a Campaign <ArrowRight size={20} />
                    </button>
                    <a href="#campaigns" className="flex items-center justify-center gap-2 bg-blue-50/20 backdrop-blur-2xl hover:bg-white/40 text-blue-900 border border-white/40 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
                        Explore Causes
                    </a>
                </div>
            </section>

            {/* ── Campaigns Grid ──────────────────────────────────── */}
            <section id="campaigns" className="py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Controls ───────────────────────────────── */}
                    <div className="mb-8 space-y-4">
                        {/* Title + count */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Active Campaigns</h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {loading ? "Loading…" : `${displayed.length} campaign${displayed.length !== 1 ? "s" : ""}${activeQuery ? ` matching "${activeQuery}"` : ""}`}
                            </p>
                        </div>

                        {/* Search + Sort + Category row */}
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Search bar */}
                            <div className="relative">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search campaigns…"
                                    className="pl-9 pr-8 py-2.5 text-sm border border-white/40 rounded-full bg-blue-50/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(31,38,135,0.05)] focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white/40 transition-all w-56 placeholder:text-blue-400/60"
                                />
                                {searchInput && (
                                    <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Sort dropdown */}
                            <div className="relative">
                                <select
                                    value={activeSort}
                                    onChange={(e) => setParam("sort", e.target.value)}
                                    className="appearance-none pl-4 pr-8 py-2.5 text-sm font-semibold border border-white/40 rounded-full bg-blue-50/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(31,38,135,0.05)] focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer focus:bg-white/40 transition-all text-blue-900"
                                >
                                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                            {/* Category pills */}
                            {categoryKeys.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setParam("category", cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeCategory === cat
                                        ? "bg-gray-900/90 text-white border-gray-900/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md"
                                        : "bg-blue-50/20 text-blue-800 border-white/40 hover:bg-white/40 hover:border-white shadow-[0_8px_32px_rgba(31,38,135,0.03)] backdrop-blur-2xl"
                                        }`}
                                >
                                    {cat === "all" ? "All" : CATEGORIES[cat]?.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden animate-pulse">
                                    <div className="h-48 bg-white/30" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                                        <div className="h-5 bg-gray-100 rounded w-3/4" />
                                        <div className="h-2 bg-gray-100 rounded w-full mt-4" />
                                        <div className="h-10 bg-gray-100 rounded-xl mt-6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="text-center py-24 text-gray-400">
                            <Heart size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-lg font-medium">No campaigns found.</p>
                            <button onClick={() => { setSearchInput(""); setParam("category", "all"); setParam("sort", "newest"); }} className="mt-4 text-primary-600 text-sm font-semibold hover:underline">Clear all filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayed.map((c) => (
                                <CampaignCard key={c.id} campaign={c} onView={(id) => router.push(`/campaign/${id}`)} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="mt-auto py-10 border-t border-white/40 bg-white/30 backdrop-blur-lg relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <div className="bg-primary-500 text-white p-1.5 rounded-lg"><Heart size={16} /></div>
                        Fundraiser
                    </div>
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Fundraiser. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

// ── Default export wrapped in Suspense (required for useSearchParams) ──
export default function Home() {
    return (
        <Suspense fallback={null}>
            <HomeInner />
        </Suspense>
    );
}
