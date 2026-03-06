"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Soft-delete a campaign by setting its status to "Terminated".
 * Only the campaign's owner may terminate it.
 */
export async function terminateCampaign(campaignId) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Verify ownership before mutating
    const campaign = await db.campaign.findUnique({
        where: { id: campaignId },
        select: { userId: true, status: true },
    });

    if (!campaign) throw new Error("Campaign not found");
    if (campaign.userId !== session.user.id) throw new Error("Forbidden");
    if (campaign.status === "Terminated") throw new Error("Already terminated");

    await db.campaign.update({
        where: { id: campaignId },
        data: { status: "Terminated" },
    });

    revalidatePath("/dashboard");
}
