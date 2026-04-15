import { Schema, model, models } from "mongoose";

const kelasScheme = new Schema({
  id: String,
  nama: String,
  noWaWaliKelas: String,
});

const kelasModel = models.kelas || model("kelas", kelasScheme);
export { kelasModel, kelasScheme };
