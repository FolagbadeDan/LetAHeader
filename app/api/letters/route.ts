
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, content, profile } = body;

    // @ts-ignore
    const userId = session.user.id;

    // Check user plan and existing letters
    const user = await db.user.findUnique({ where: { id: userId } });
    const existingLetters = await db.savedLetter.count({ where: { userId } });

    if (user && user.plan === 'FREE' && existingLetters >= 1) {
      return NextResponse.json({ error: "Free plan limit reached. Upgrade to save more." }, { status: 403 });
    }

    const saved = await db.savedLetter.create({
      data: {
        name,
        content: JSON.stringify(content),
        profile: JSON.stringify(profile),
        userId
      }
    });

    return NextResponse.json({
      id: saved.id,
      name: saved.name,
      content: JSON.parse(saved.content),
      profile: JSON.parse(saved.profile),
      userId: saved.userId,
      lastModified: saved.lastModified.getTime()
    });
  } catch (error: any) {
    console.error("Save letter error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-ignore - session.user.id is added via JWT callback
  const userId = session.user.id as string;

  const letters = await db.savedLetter.findMany({
    where: { userId },
    orderBy: { lastModified: 'desc' }
  });

  return NextResponse.json(letters.map(l => ({
    id: l.id,
    name: l.name,
    content: JSON.parse(l.content),
    profile: JSON.parse(l.profile),
    userId: l.userId,
    lastModified: l.lastModified.getTime()
  })));
}
