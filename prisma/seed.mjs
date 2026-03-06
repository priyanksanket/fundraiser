import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Use the first existing user, or create a seed user if none exists
    let seedUser = await prisma.user.findFirst()
    if (!seedUser) {
        seedUser = await prisma.user.create({
            data: {
                name: 'Fundraiser Admin',
                email: 'admin@fundraiser.dev',
            },
        })
        console.log('Created seed user:', seedUser.name)
    } else {
        console.log('Using existing user:', seedUser.name)
    }

    const campaigns = [
        // ── Medical ──────────────────────────────────────────────
        {
            title: "Help Maya Beat Leukemia",
            description:
                "Maya is a 7-year-old diagnosed with acute lymphoblastic leukemia. Her family is struggling to cover chemotherapy, bone marrow transplant costs, and travel to a specialist hospital three states away. Every dollar brings her one step closer to remission. Please help us give Maya her childhood back.",
            target_amount: 85000,
            raised_amount: 47320,
            image_url:
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Emergency Heart Surgery for Raj",
            description:
                "Raj, a 42-year-old school teacher, suffered a sudden cardiac arrest last week. Doctors say he needs an emergency bypass surgery within 30 days. His insurance covers only 40% of the cost, leaving his family in a financial crisis. Your support can literally save his life and keep him in the classroom for years to come.",
            target_amount: 60000,
            raised_amount: 12800,
            image_url:
                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        // ── Education ─────────────────────────────────────────────
        {
            title: "Build a Library for 500 Rural Kids",
            description:
                "In the small village of Koilabad, 500 children share just 12 textbooks among themselves. We are raising funds to construct a community library stocked with 2,000+ books, computers, and a reliable internet connection. Education is the most powerful tool we can give the next generation.",
            target_amount: 35000,
            raised_amount: 35000,
            image_url:
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "STEM Scholarships for Underprivileged Girls",
            description:
                "Priya, Aisha, and 23 other brilliant girls from low-income families have been accepted into engineering programs — but cannot afford tuition. We are raising funds to cover full 4-year scholarships, laptops, and mentorship programs. Invest in these future engineers, doctors, and scientists.",
            target_amount: 120000,
            raised_amount: 29500,
            image_url:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Free Coding Bootcamp for Young Adults",
            description:
                "We are launching a 12-week intensive coding bootcamp for 50 unemployed youth aged 18-25. The program covers web development, data science, and job placement assistance — completely free for participants. Your donation covers equipment, mentors, and cloud credits to transform lives through technology.",
            target_amount: 28000,
            raised_amount: 0,
            image_url:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        // ── Disaster Relief ───────────────────────────────────────
        {
            title: "Cyclone Victims Need Homes — Odisha",
            description:
                "Cyclone Bikel destroyed over 3,000 homes across 14 coastal villages in Odisha last month. Families are living under plastic sheets in monsoon season. We are working with local NGOs to build weather-resistant shelters for 200 families. Funds will cover materials, labor, and safe drinking water kits.",
            target_amount: 200000,
            raised_amount: 88700,
            image_url:
                "https://images.unsplash.com/photo-1600005786435-0ee7ceb108cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Wildfire Relief: Families in Uttarakhand",
            description:
                "Devastating wildfires swept through the forests of Uttarakhand, displacing 1,200 families and destroying crops and livestock. Immediate needs include food packets, blankets, medical aid, and animal feed. Long-term, we will help rebuild livelihoods through livestock and crop support programs.",
            target_amount: 75000,
            raised_amount: 51200,
            image_url:
                "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        // ── Creative ──────────────────────────────────────────────
        {
            title: "Bring Our Indie Film to Sundance",
            description:
                "After 3 years of self-funded production, our feature documentary 'Invisible Borders' — about stateless people living across South-East Asia — has been selected for Sundance Film Festival submission. We need funds for festival fees, subtitles in 5 languages, and a distribution pitch package. Help us tell this story to the world.",
            target_amount: 18000,
            raised_amount: 6400,
            image_url:
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Record Our First Full-Length Album",
            description:
                "We are a 4-piece indie folk band from Bangalore who have been playing together for 6 years. We finally have 12 original songs ready and a studio willing to work with us — but we need funds for studio time, mixing, mastering, and vinyl pressing for 500 copies. Back us and get a signed vinyl!",
            target_amount: 15000,
            raised_amount: 0,
            image_url:
                "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Community Mural Project — Mumbai Dharavi",
            description:
                "We are a collective of 8 local artists transforming 12 bare walls in Dharavi into vibrant murals celebrating its street food culture, resilience, and diversity. The project employs 20 youth from the community as apprentice painters. Funds go to paints, scaffolding, and artist stipends.",
            target_amount: 8500,
            raised_amount: 3200,
            image_url:
                "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
    ]

    let created = 0
    for (const campaign of campaigns) {
        await prisma.campaign.create({
            data: {
                ...campaign,
                userId: seedUser.id,
            },
        })
        created++
        console.log(`✅ Created: ${campaign.title}`)
    }

    console.log(`\n🎉 Seeded ${created} campaigns successfully!`)
}

main()
    .catch((e) => {
        console.error('Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
