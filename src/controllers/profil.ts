import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { profilModel } from "@/models/profil";
import { kelasModel } from "@/models/kelas";
import connectDB from "@/utils/mongoose";
import * as XLSX from "xlsx";
import { nanoid } from "nanoid";

await connectDB();

class Profiles {
  static instance: Profiles;

  static getInstance() {
    if (!Profiles.instance) Profiles.instance = new Profiles();
    return Profiles.instance;
  }

  async createFromExcel(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    const hasil = [];

    for (const row of rows) {
      const isGuru = row["isGuru"] === "TRUE";

      if (isGuru) {
        await kelasModel.findOneAndUpdate(
          { nama: row["Kelas"] },
          { nama: row["Kelas"], noWaWaliKelas: row["No WA"] },
          { upsert: true },
        );
      }

      const kodeUnik = nanoid(8).toUpperCase();
      const password = await bcrypt.hash(kodeUnik, 10);

      await profilModel.create({
        nama: row["Nama"],
        kelas: row["Kelas"],
        isGuru,
        kodeUnik,
        password,
      });

      hasil.push({ nama: row["Nama"], kodeUnik });
    }

    return hasil;
  }
  async gantiPassword(kodeUnik: string, passwordBaru: string) {
    const profil = await profilModel.findOne({ kodeUnik });
    if (!profil) return null;

    profil.password = await bcrypt.hash(passwordBaru, 10);
    profil.isFirstLogin = false;
    await profil.save();

    return profil;
  }
  async login(kodeUnik: string, password: string) {
    try {
      const profil = await profilModel.findOne({ kodeUnik });
      if (!profil) return null;

      const isValid = await bcrypt.compare(password, profil.password);
      if (!isValid) return null;

      return profil;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  async createAccessToken(id: string) {
    try {
      const profil = await profilModel.findById(id);
      if (!profil) return { newToken: "", refreshToken: "" };

      const payload = {
        id: profil._id,
        nama: profil.nama,
        kelas: profil.kelas,
        isGuru: profil.isGuru,
      };

      const newToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "", {
        expiresIn: "1d",
      });

      const refreshToken = jwt.sign(
        { id: profil._id },
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "7d" },
      );

      return { newToken, refreshToken };
    } catch (error) {
      console.error("Token error:", error);
      return { newToken: "", refreshToken: "" };
    }
  }

  checkAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY || "");
    } catch {
      return null;
    }
  }
}

export default Profiles;
