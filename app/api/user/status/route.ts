import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ plan: "FREE" });
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
            plan: true,
            aiUsageCount: true,
            _count: {
                select: { letters: true }
            }
        }
    });

    return NextResponse.json({
        plan: user?.plan || "FREE",
        aiUsage: user?.aiUsageCount || 0,
        letterCount: user?._count.letters || 0
    });
}
