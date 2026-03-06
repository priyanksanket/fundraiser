import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || "anonymous";

        const body = await req.json();
        const { amount, campaignId, campaignTitle } = body;

        if (!amount || !campaignId) {
            return new NextResponse("Missing amount or campaign ID", { status: 400 });
        }

        // ── Server-side completion guard ────────────────────────
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId },
            select: { raised_amount: true, target_amount: true },
        });

        if (!campaign) {
            return new NextResponse("Campaign not found", { status: 404 });
        }

        if (campaign.raised_amount >= campaign.target_amount) {
            return new NextResponse("This campaign has already reached its goal.", { status: 409 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Donation to: ${campaignTitle}`,
                            description: "Thank you for supporting this cause on Fundraiser.",
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/campaign/${campaignId}?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/campaign/${campaignId}?canceled=true`,
            metadata: {
                campaignId,
                userId,
            },
            submit_type: "donate",
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[CHECKOUT_SESSION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
