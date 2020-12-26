import mongoose, { Schema } from 'mongoose';

interface IGreList extends mongoose.Document {
  email: string;
  list: string;
  word: string;
}

const listSchema = new Schema({
  email: { type: String },
  list: { type: String },
  word: { type: String },
});

export default mongoose.model<IGreList>('lists', listSchema);
