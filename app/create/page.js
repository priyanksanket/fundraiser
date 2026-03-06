"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Heart, Loader2, DollarSign, Link as LinkIcon,
    FileText, Tag, ArrowLeft, CheckCircle
} from "lucide-react";
import Link from "next/link";

// ── Category options (mirrors getCategory() on homepage) ──────
const CATEGORIES = [
    { value: "medical", label: "🏥 Medical" },
    { value: "education", label: "📚 Education" },
    { value: "disaster", label: "🌊 Disaster Relief" },
    { value: "creative", label: "🎨 Creative" },
    { value: "other", label: "✨ Other" },
];

// ── Simple URL validator ──────────────────────────────────────
const isValidUrl = (s) => {
    if (!s) return true; // optional field
    try { new URL(s); return true; } catch { return false; }
};

export default function CreateCampaign() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        target_amount: "",
        category: "",
        image_url: "",
    });

    // ── Auth guard ──────────────────────────────────────────────
    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }
    if (status === "unauthenticated") {
        router.replace("/");
        return null;
    }

    // ── Handlers ────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "image_url") setPreview(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isValidUrl(formData.image_url)) {
            setError("Please enter a valid image URL (or leave blank).");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    target_amount: formData.target_amount,
                    category: formData.category || null,
                    image_url: formData.image_url || null,
                }),
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            router.push(`/campaign/${data.id}`);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const charLeft = 2000 - formData.description.length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── Top bar ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 py-4 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={15} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-primary-500 text-white p-1.5 rounded-lg"><Heart size={14} /></div>
                        Fundraiser
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Form (3/5) ───────────────────────────── */}
                    <div className="lg:col-span-3">
                        {/* Page heading */}
                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                                <Heart size={24} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Start a Campaign</h1>
                            <p className="text-gray-500 mt-1.5 text-sm">Tell your story and start raising funds for what matters.</p>
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
                                <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <FileText size={15} className="text-gray-400" /> Campaign Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="title" name="title" type="text" required
                                    value={formData.title} onChange={handleChange}
                                    maxLength={120}
                                    placeholder="e.g. Help build a community library in rural India"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm"
                                />
                                <p className="text-xs text-gray-400">{formData.title.length}/120 characters</p>
                            </div>

                            {/* Category + Goal side-by-side */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Category */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
                                    <label htmlFor="category" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <Tag size={15} className="text-gray-400" /> Category
                                    </label>
                                    <select
                                        id="category" name="category"
                                        value={formData.category} onChange={handleChange}
                                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Goal Amount */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
                                    <label htmlFor="target_amount" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <DollarSign size={15} className="text-gray-400" /> Goal Amount <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                                        <input
                                            id="target_amount" name="target_amount" type="number"
                                            required min="1" step="1"
                                            value={formData.target_amount} onChange={handleChange}
                                            placeholder="10,000"
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 pl-7 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <FileText size={15} className="text-gray-400" /> Campaign Story <span className="text-red-400">*</span>
                                </label>
                                <p className="text-xs text-gray-400">Share why you are raising funds and how contributions will be used.</p>
                                <textarea
                                    id="description" name="description"
                                    required rows={7} maxLength={2000}
                                    value={formData.description} onChange={handleChange}
                                    placeholder="Hi, I'm raising funds because..."
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm resize-y"
                                />
                                <p className={`text-xs ${charLeft < 100 ? "text-red-400" : "text-gray-400"}`}>{charLeft} characters remaining</p>
                            </div>

                            {/* Image URL */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
                                <label htmlFor="image_url" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <LinkIcon size={15} className="text-gray-400" /> Campaign Image URL
                                    <span className="text-xs font-normal text-gray-400">(optional)</span>
                                </label>
                                <p className="text-xs text-gray-400">Paste a direct link to an image (JPG, PNG, WebP). Use <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">Unsplash</a> for free photos.</p>
                                <input
                                    id="image_url" name="image_url" type="url"
                                    value={formData.image_url} onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm font-mono text-xs"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 hover:bg-primary-600 text-white font-bold rounded-2xl py-4 text-base transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Publishing…</>
                                ) : (
                                    <><CheckCircle size={18} /> Launch Campaign</>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                By continuing, you agree to the Fundraiser Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    </div>

                    {/* ── Live Preview (2/5) ───────────────────── */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Image */}
                            <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {preview && isValidUrl(preview) ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview("")} />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-2">
                                        <Heart size={36} />
                                        <span className="text-xs">Image preview</span>
                                    </div>
                                )}
                            </div>
                            {/* Body */}
                            <div className="p-5">
                                {formData.category && (
                                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600 border border-primary-100 mb-2 capitalize">
                                        {CATEGORIES.find(c => c.value === formData.category)?.label}
                                    </span>
                                )}
                                <h3 className="font-bold text-gray-900 text-base leading-snug mb-3 line-clamp-2">
                                    {formData.title || <span className="text-gray-300">Your campaign title</span>}
                                </h3>
                                {/* Progress placeholder */}
                                <div className="mb-2 flex justify-between text-xs text-gray-400">
                                    <span>$0 raised</span>
                                    <span>of {formData.target_amount ? `$${Number(formData.target_amount).toLocaleString()}` : "$0"}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: "0%" }} />
                                </div>
                                <div className="w-full bg-gray-100 text-gray-400 text-xs font-semibold text-center py-2.5 rounded-xl">
                                    Donate Now
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-3">This is how your campaign will appear to donors.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
