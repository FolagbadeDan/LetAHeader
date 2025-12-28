import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { companyName, slogan, primaryColor, website, address } = body;
        const userId = (session.user as any).id;

        const existingProfile = await db.brandProfile.findFirst({
            where: { userId }
        });

        let profile;
        if (existingProfile) {
            profile = await db.brandProfile.update({
                where: { id: existingProfile.id },
                data: {
                    companyName,
                    slogan,
                    primaryColor,
                    website,
                    address,
                }
            });
        } else {
            profile = await db.brandProfile.create({
                data: {
                    userId,
                    companyName,
                    slogan,
                    primaryColor,
                    website,
                    address,
                }
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error saving brand profile:", error);
        return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }
}
