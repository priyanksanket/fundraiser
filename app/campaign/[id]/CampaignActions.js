"use client";

import { useState } from "react";
import { Heart, Share2, ShieldCheck, Check, CheckCircle } from "lucide-react";
import DonationModal from "../../components/DonationModal";

export default function CampaignActions({ campaignId, campaignTitle, isCompleted = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = { title: campaignTitle, text: `Support this cause: ${campaignTitle}`, url };
        if (navigator.share) {
            try { await navigator.share(shareData); return; } catch { }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            window.prompt("Copy this link to share:", url);
        }
    };

    return (
        <>
            <div className="space-y-4 mb-8">
                {isCompleted ? (
                    /* Goal reached banner — no onClick, not a button */
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 py-4 rounded-xl flex items-center justify-center gap-2.5 font-bold text-base">
                        <CheckCircle size={20} className="text-green-500 shrink-0" />
                        This goal has been reached!
                    </div>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                    >
                        <Heart size={20} className="animate-pulse" />
                        Donate Now
                    </button>
                )}

                <button
                    onClick={handleShare}
                    className="w-full bg-white/40 hover:bg-white/60 text-gray-900 border border-white/60 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center justify-center gap-2"
                >
                    {copied ? (
                        <><Check size={20} className="text-green-500" /><span className="text-green-600">Link Copied!</span></>
                    ) : (
                        <><Share2 size={20} />Share Campaign</>
                    )}
                </button>
            </div>

            {/* Trust Indicator */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                    <div className="bg-green-50 p-2 rounded-full text-green-600 mt-1">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Fundraiser Guarantee</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your donation is protected. If anything isn&apos;t right, we&apos;ll refund your contribution.
                        </p>
                    </div>
                </div>
            </div>

            {!isCompleted && (
                <DonationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={campaignId}
                    campaignTitle={campaignTitle}
                />
            )}
        </>
    );
}
