import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function GET() {
    try {
        const campaigns = await db.campaign.findMany({
            orderBy: { created_at: "desc" },
            include: {
                user: { select: { name: true, image: true } },
                _count: { select: { donations: true } },
            },
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("[CAMPAIGN_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description, target_amount, category, image_url } = body;

        if (!title || !description || !target_amount) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const campaign = await db.campaign.create({
            data: {
                title,
                description,
                target_amount: parseFloat(target_amount),
                category: category || null,
                image_url: image_url || null,
                userId: session.user.id,
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("[CAMPAIGN_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
