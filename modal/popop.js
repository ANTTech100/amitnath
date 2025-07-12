import { number } from "framer-motion";
import mongoose from "mongoose";

const popopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Popop = mongoose.models.Popop || mongoose.model("Popop", popopSchema);
export default Popop;
