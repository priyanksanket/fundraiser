import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

export async function POST(req) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object;

    if (event.type === "checkout.session.completed") {
        try {
            if (!session?.metadata?.campaignId) {
                throw new Error("Missing metadata in Stripe session");
            }

            // Convert cents back to dollars
            const amountDonated = session.amount_total / 100;
            const campaignId = session.metadata.campaignId;
            const userId = session.metadata.userId;

            // 1. Create the Donation record
            // If user is anonymous, you might need an optional relation in Prisma or a system user ID.
            // Based on our schema, userId is required. For this demo, let's assume the user MUST be logged in
            // to donate based on schema constraints, or we use a fallback if schema allowed it. 
            // (Note: Since our schema requires userId, if 'anonymous' is passed, it will fail unless an 'anonymous' user exists.
            // We will wrap this in a transaction or individual queries).

            let validUserId = userId;

            if (userId === "anonymous") {
                // Fallback: If your schema strict forces a User relation, we might need a system user
                // For standard tutorial flow, we just associate with the Campaign Creator locally if anon fails, 
                // or ensure they are logged in. We'll proceed assuming they are logged in or have a valid UUID.
                // To be safe against Prisma foreign key errors:
                const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
                validUserId = campaign.userId; // fallback to creator for accounting if anon
            }

            await db.donation.create({
                data: {
                    amount: amountDonated,
                    campaignId: campaignId,
                    userId: validUserId,
                },
            });

            // 2. Increment the Campaign's raised_amount
            await db.campaign.update({
                where: {
                    id: campaignId,
                },
                data: {
                    raised_amount: {
                        increment: amountDonated,
                    },
                },
            });

        } catch (error) {
            console.error("[WEBHOOK_PROCESSING_ERROR]", error);
            return new NextResponse("Error processing webhook data", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
