// app/api/change_password/route.ts
import { NextRequest, NextResponse } from "next/server";
import Profiles from "@/controllers/profil";

const profiles = Profiles.getInstance();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kodeUnik, password } = body; // <- passwordBaru !!!!

    console.log("Request body:", body);

    if (!kodeUnik || !password) {
      return NextResponse.json(
        { message: "kodeUnik dan passwordBaru wajib diisi" },
        { status: 400 },
      );
    }
    const profil = await profiles.gantiPassword(kodeUnik, password);
    if (!profil) {
      return NextResponse.json(
        { message: "kode unik salah / Tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Pergantian Password Berhasil",
      data: { kodeUnik },
    });
  } catch (error: any) {
    console.error("Parse error:", error.message);
    return NextResponse.json(
      { message: "Invalid JSON", error: error.message },
      { status: 400 },
    );
  }
}
