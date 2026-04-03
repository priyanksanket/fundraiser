import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import EditCampaignForm from "./EditCampaignForm";

export default async function EditCampaignPage({ params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/");
    }

    const { id } = await params;

    const campaign = await db.campaign.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            target_amount: true,
            category: true,
            image_url: true,
            userId: true,
            status: true,
        },
    });

    if (!campaign) notFound();
    if (campaign.userId !== session.user.id) redirect("/");
    if (campaign.status === "Terminated") redirect("/dashboard");

    return <EditCampaignForm campaign={campaign} />;
}
