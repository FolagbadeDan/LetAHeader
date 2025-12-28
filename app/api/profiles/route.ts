import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEFAULT_PROFILE } from '@/types';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const profiles = await db.brandProfile.findMany({
            where: {
                user: { email: session.user.email }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(profiles);
    } catch (error) {
        console.error("Failed to fetch profiles:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const user = await db.user.findUnique({ where: { email: session.user.email } });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Check if this is their first profile, if so make it default
        const count = await db.brandProfile.count({ where: { userId: user.id } });
        const isDefault = count === 0 || body.isDefault;

        if (body.isDefault) {
            // Unset other defaults
            await db.brandProfile.updateMany({
                where: { userId: user.id },
                data: { isDefault: false }
            });
        }

        const newProfile = await db.brandProfile.create({
            data: {
                userId: user.id,
                companyName: body.name || DEFAULT_PROFILE.name,
                address: body.address || DEFAULT_PROFILE.address,
                website: body.website || DEFAULT_PROFILE.website,
                primaryColor: body.primaryColor || DEFAULT_PROFILE.primaryColor,
                isDefault: isDefault,
                logoUrl: body.logoUrl || null,
                // ... mapped fields
            }
        });

        return NextResponse.json(newProfile);
    } catch (error) {
        console.error("Failed to create profile:", error);
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
}
