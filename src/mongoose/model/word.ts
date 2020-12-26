import mongoose, { Schema } from 'mongoose';

interface IGreWord extends mongoose.Document {
  word: string;
  definition: string;
  type: string;
}

const wordSchema = new Schema({
  word: { type: String, required: true },
  definition: { type: String, default: null },
  partOfSpeech: { type: String, default: '' },
});

export default mongoose.model<IGreWord>('words', wordSchema);
