import { Schema, model, models } from "mongoose";

const profilSchema = new Schema({
  nama: { type: String, required: true },
  kelas: { type: String, default: "" },
  isGuru: { type: Boolean, default: false },
  noWa: { type: String, default: "" },
  kodeUnik: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalAbsen: { type: Number, default: 0 },
  absenBulanIni: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
});

const profilModel = models.profil || model("profil", profilSchema);
export { profilModel, profilSchema };
