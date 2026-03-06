"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function PaymentToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setToast({ type: "success", message: "🎉 Thank you! Your donation was received. It may take a moment to reflect." });
            // Clean the URL without reloading
            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            router.replace(url.pathname, { scroll: false });
        } else if (searchParams.get("canceled") === "true") {
            setToast({ type: "error", message: "Payment was cancelled. No charge was made." });
            const url = new URL(window.location.href);
            url.searchParams.delete("canceled");
            router.replace(url.pathname, { scroll: false });
        }
    }, [searchParams]);

    if (!toast) return null;

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm w-full border animate-slide-up
            ${toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
            {toast.type === "success"
                ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            }
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
                <X size={16} />
            </button>
        </div>
    );
}
