import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // In a real app, verify the transaction with Paystack here using the reference
        // const { reference } = await req.json();
        // await verifyPaystackTransaction(reference);

        const user = await db.user.update({
            where: { email: session.user.email },
            data: { plan: "PRO" },
        });

        return NextResponse.json({ success: true, plan: user.plan });
    } catch (error) {
        console.error("[UPGRADE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
