import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col font-sans">
            <div className="bg-white/60 backdrop-blur-2xl border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4 sticky top-0 z-40 transition-all">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 text-primary-600 font-extrabold text-lg">
                        <Shield size={20} />
                        Privacy
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow p-8 sm:p-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 font-medium mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

                    <div className="space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us when using our fundraising platform. This includes personal information such as your name, email address, payment details, and any campaign information you create or interact with.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">2. How We Use Your Information</h2>
                            <p>We use the information we collect to operate, maintain, and improve our services. This includes processing transactions, communicating with you about your campaigns or donations, and ensuring compliance with legal obligations.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">3. Data Sharing and Disclosure</h2>
                            <p>We do not share your personal information with third parties except as necessary to provide our services (such as processing payments through secure payment gateways), comply with the law, or protect our rights.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">4. Security</h2>
                            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">5. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact our support team through the platform.</p>
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
