import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createMediaEntry, MediaStatus, MediaType } from "@/lib/db/media";

const MEDIA_TYPES: MediaType[] = ["film", "serie", "livre", "manga", "anime"];
const MEDIA_STATUSES: MediaStatus[] = ["a_voir", "en_cours", "termine"];

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const {
      title,
      type,
      status,
      rating,
      rank,
      notes,
      started_at,
      finished_at,
    } = body ?? {};

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Titre manquant" }, { status: 400 });
    }

    if (!MEDIA_TYPES.includes(type)) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    if (status && !MEDIA_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const media = await createMediaEntry(session.user.id, {
      title,
      type,
      status,
      rating: typeof rating === "number" ? rating : undefined,
      rank: typeof rank === "number" ? rank : undefined,
      notes: typeof notes === "string" && notes.length > 0 ? notes : undefined,
      started_at: typeof started_at === "string" ? new Date(started_at) : undefined,
      finished_at: typeof finished_at === "string" ? new Date(finished_at) : undefined,
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
