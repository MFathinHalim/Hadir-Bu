import { NextRequest, NextResponse } from "next/server";
import Profiles from "@/controllers/profil";
import connectDB from "@/utils/mongoose";

const profiles = Profiles.getInstance();

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "File wajib ada" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hasil = await profiles.createFromExcel(buffer);

    return NextResponse.json(
      { message: "Berhasil", data: hasil },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
