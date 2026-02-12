import { NextResponse } from "next/server";
import { createUser, emailExists, getUserByEmail } from "@/lib/db/user";
import { createSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { validateEmail, validatePassword } from "@/lib/utils/format";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body ?? {};

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || !validatePassword(password)) {
      return NextResponse.json(
        { error: "Mot de passe trop faible" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    const exists = await emailExists(email);
    if (exists) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }

    const user = await createUser({
      email,
      name: name.trim(),
      password_hash: hashPassword(password),
    });

    await createSession({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
