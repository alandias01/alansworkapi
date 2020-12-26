import mongoose, { Schema } from 'mongoose';

const userListSchema = new Schema({
  email: { type: String },
  list: { type: String },
  word: { type: String },
  definition: { type: String },
  type: { type: String },
});

export default mongoose.model('userlists', userListSchema);
