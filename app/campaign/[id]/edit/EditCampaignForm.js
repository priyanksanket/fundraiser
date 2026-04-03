"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Heart, Loader2, DollarSign, Link as LinkIcon,
    FileText, Tag, ArrowLeft, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { updateCampaign } from "@/app/actions/campaigns";

const CATEGORIES = [
    { value: "medical", label: "🏥 Medical" },
    { value: "education", label: "📚 Education" },
    { value: "disaster", label: "🌊 Disaster Relief" },
    { value: "creative", label: "🎨 Creative" },
    { value: "other", label: "✨ Other" },
];

const isValidUrl = (s) => {
    if (!s) return true;
    try { new URL(s); return true; } catch { return false; }
};

export default function EditCampaignForm({ campaign }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(campaign.image_url || "");
    const [formData, setFormData] = useState({
        title: campaign.title || "",
        description: campaign.description || "",
        target_amount: campaign.target_amount || "",
        category: campaign.category || "",
        image_url: campaign.image_url || "",
    });

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
            await updateCampaign(campaign.id, formData);
            router.push(`/dashboard`);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const charLeft = 2000 - formData.description.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col font-sans relative">
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40%] h-[50%] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-pink-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none z-0"></div>

            {/* ── Top bar ──────────────────────────────────────── */}
            <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-4 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={15} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-primary-500 text-white p-1.5 rounded-lg"><Heart size={14} /></div>
                        Fundraiser
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Form (3/5) ───────────────────────────── */}
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Campaign</h1>
                            <p className="text-gray-500 mt-1.5 text-sm">Update your campaign details.</p>
                        </div>

                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-2">
                                <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <FileText size={15} className="text-gray-400" /> Campaign Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="title" name="title" type="text" required
                                    value={formData.title} onChange={handleChange}
                                    maxLength={120}
                                    className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white/70 focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-2">
                                    <label htmlFor="category" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <Tag size={15} className="text-gray-400" /> Category
                                    </label>
                                    <select
                                        id="category" name="category"
                                        value={formData.category} onChange={handleChange}
                                        className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-md px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white/70 focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm shadow-inner"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-2">
                                    <label htmlFor="target_amount" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <DollarSign size={15} className="text-gray-400" /> Goal Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                                        <input
                                            id="target_amount" name="target_amount" type="number"
                                            required min="1" step="1"
                                            value={formData.target_amount} onChange={handleChange}
                                            className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-md pl-7 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white/70 focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-2">
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <FileText size={15} className="text-gray-400" /> Campaign Story <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    id="description" name="description"
                                    required rows={7} maxLength={2000}
                                    value={formData.description} onChange={handleChange}
                                    className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white/70 focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm resize-y shadow-inner"
                                />
                                <p className={`text-xs ${charLeft < 100 ? "text-red-400" : "text-gray-400"}`}>{charLeft} characters remaining</p>
                            </div>

                            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-2">
                                <label htmlFor="image_url" className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <LinkIcon size={15} className="text-gray-400" /> Campaign Image URL
                                </label>
                                <input
                                    id="image_url" name="image_url" type="url"
                                    value={formData.image_url} onChange={handleChange}
                                    className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white/70 focus:ring-2 focus:ring-primary-300 transition-all outline-none text-sm font-mono text-xs shadow-inner"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 hover:bg-primary-600 text-white font-bold rounded-2xl py-4 text-base transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</> : <><CheckCircle size={18} /> Save Changes</>}
                            </button>
                        </form>
                    </div>

                    {/* ── Preview (2/5) ────────────────────────── */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 mt-8 lg:mt-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
                        <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="h-44 bg-black/5 border-b border-white/30 flex items-center justify-center overflow-hidden">
                                {preview && isValidUrl(preview) ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview("")} />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-2">
                                        <Heart size={36} />
                                        <span className="text-xs">Image preview</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                {formData.category && (
                                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600 border border-primary-100 mb-2 capitalize">
                                        {CATEGORIES.find(c => c.value === formData.category)?.label}
                                    </span>
                                )}
                                <h3 className="font-bold text-gray-900 text-base leading-snug mb-3 line-clamp-2">
                                    {formData.title || <span className="text-gray-300">Your campaign title</span>}
                                </h3>
                                <div className="mb-2 flex justify-between text-xs text-gray-400">
                                    <span>$0 raised</span>
                                    <span>of {formData.target_amount ? `$${Number(formData.target_amount).toLocaleString()}` : "$0"}</span>
                                </div>
                                <div className="w-full bg-black/5 rounded-full h-1.5 mb-4">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: "0%" }} />
                                </div>
                                <div className="w-full bg-black/5 text-gray-400 text-xs font-semibold text-center py-2.5 rounded-xl border border-white/40 shadow-inner">
                                    Donate Now
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
