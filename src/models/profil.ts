import { Schema, model, models } from "mongoose";

const profilSchema = new Schema({
  sekolahId: { type: Schema.Types.ObjectId, ref: "sekolah", required: true },
  kelasId: { type: Schema.Types.ObjectId, ref: "kelas", required: true },
  nama: { type: String, required: true },
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
