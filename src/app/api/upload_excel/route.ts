import { NextRequest, NextResponse } from "next/server";
import Profiles from "@/controllers/profil";
import { kelasModel } from "@/models/kelas";
import connectDB from "@/utils/mongoose";

const profiles = Profiles.getInstance();

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sekolahId = formData.get("sekolahId") as string;

    if (!file || !sekolahId) {
      return NextResponse.json(
        { message: "File dan sekolahId wajib ada" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const kelasMap: Record<string, string> = {};
    const existingKelas = await kelasModel.find({ sekolahId });
    for (const k of existingKelas) {
      kelasMap[k.namaKelas] = k._id.toString();
    }

    const hasil = await profiles.createFromExcel(buffer, sekolahId, kelasMap);

    return NextResponse.json(
      { message: "Berhasil", data: hasil },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
