import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col font-sans">
            <div className="bg-white/60 backdrop-blur-2xl border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4 sticky top-0 z-40 transition-all">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 text-primary-600 font-extrabold text-lg">
                        <FileText size={20} />
                        Terms
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow p-8 sm:p-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-gray-500 font-medium mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

                    <div className="space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">1. Acceptance of Terms</h2>
                            <p>By accessing or using our fundraising platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">2. User Responsibilities</h2>
                            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating campaigns or making donations.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">3. Prohibited Conduct</h2>
                            <p>Users are strictly prohibited from using the platform for any unlawful purpose, to solicit others to perform or participate in unlawful acts, or to harass, abuse, insult, harm, defame, slander, or discriminate against others.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">4. Funds and Payments</h2>
                            <p>All donations are considered final and non-refundable unless otherwise required by law or specified in a particular campaign. We reserve the right to withhold funds or terminate campaigns that violate our policies.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">5. Modifications</h2>
                            <p>We reserve the right to modify or replace these Terms at any time. Your continued use of the platform after any changes indicates your acceptance of the new Terms.</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-gray-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Fundraiser. All rights reserved.
            </footer>
        </div>
    );
}
