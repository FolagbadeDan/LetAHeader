import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        const body = await request.json();

        // Verify ownership
        const existing = await db.brandProfile.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existing || existing.user.email !== session.user.email) {
            return NextResponse.json({ error: "Profile not found or unauthorized" }, { status: 404 });
        }

        if (body.isDefault) {
            // Unset other defaults if this is becoming default
            await db.brandProfile.updateMany({
                where: { userId: existing.userId },
                data: { isDefault: false }
            });
        }

        const updated = await db.brandProfile.update({
            where: { id },
            data: {
                companyName: body.name,
                address: body.address,
                website: body.website,
                primaryColor: body.primaryColor,
                logoUrl: body.logoUrl,
                isDefault: body.isDefault
                // Add other fields mapping
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        // Verify ownership
        const existing = await db.brandProfile.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existing || existing.user.email !== session.user.email) {
            return NextResponse.json({ error: "Profile not found or unauthorized" }, { status: 404 });
        }

        await db.brandProfile.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete profile:", error);
        return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
    }
}
