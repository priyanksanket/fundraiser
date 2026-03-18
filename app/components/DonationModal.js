"use client";

import { useState } from "react";
import { X, DollarSign, Loader2 } from "lucide-react";

export default function DonationModal({ isOpen, onClose, campaignId, campaignTitle }) {
    const [amount, setAmount] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const presetAmounts = [25, 50, 100, 250];

    const handleDonate = async () => {
        const finalAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

        if (!finalAmount || isNaN(finalAmount) || finalAmount < 1) {
            alert("Please enter a valid amount (minimum $1).");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: finalAmount,
                    campaignId,
                    campaignTitle,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong with the payment system.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl w-full max-w-md border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-slide-up relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/40 hover:bg-white/70 shadow-sm backdrop-blur-sm rounded-full p-2 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Support this cause</h2>
                    <p className="text-gray-500 mb-8">Choose an amount to donate to {campaignTitle}</p>

                    {/* Preset Amounts */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {presetAmounts.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => { setAmount(preset); setCustomAmount(""); }}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all text-lg shadow-sm backdrop-blur-sm
                  ${amount === preset
                                        ? "border-primary-500 bg-primary-100/50 text-primary-700"
                                        : "border-white/60 bg-white/30 text-gray-700 hover:border-white hover:bg-white/60"
                                    }`}
                            >
                                ${preset}
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="relative mb-8 shadow-sm backdrop-blur-sm rounded-xl">
                        <div className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-colors ${amount === "custom" ? "border-primary-500" : "border-white/60 bg-white/30"}`}></div>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <DollarSign className={`h-5 w-5 ${amount === "custom" ? "text-primary-600" : "text-gray-500"}`} />
                        </div>
                        <input
                            type="number"
                            placeholder="Custom Amount"
                            min="1"
                            value={customAmount}
                            onFocus={() => setAmount("custom")}
                            onChange={(e) => {
                                setAmount("custom");
                                setCustomAmount(e.target.value);
                            }}
                            className="block w-full pl-11 pr-4 py-4 rounded-xl bg-transparent outline-none text-gray-900 font-bold text-lg relative z-10"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleDonate}
                        disabled={isLoading || (!amount && !customAmount)}
                        className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Continue to Payment`
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                        Secured by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
