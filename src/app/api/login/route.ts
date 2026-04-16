// /api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import Profiles from "@/controllers/profil";

const profiles = Profiles.getInstance();

export async function POST(req: NextRequest) {
  try {
    const { kodeUnik, password } = await req.json();

    if (!kodeUnik || !password) {
      return NextResponse.json(
        { message: "Kode unik dan password wajib diisi" },
        { status: 400 },
      );
    }

    const profil = await profiles.login(kodeUnik, password);

    if (!profil) {
      return NextResponse.json(
        { message: "kode unik atau password salah" },
        { status: 401 },
      );
    }

    const isFirstLogin = password.toUpperCase() === kodeUnik.toUpperCase();

    const { newToken, refreshToken } = await profiles.createAccessToken(
      profil._id.toString(),
    );

    const res = NextResponse.json({
      message: "Login berhasil",
      isGuru: profil.isGuru,
      isFirstLogin,
      kodeUnik,
    });

    res.cookies.set("token", newToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    res.cookies.set("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
