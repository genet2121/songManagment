
import mongoose from 'mongoose';

const lookupSchema = new mongoose.Schema({
  category: { type: String, enum: ['artist', 'album', 'genre'], required: true },
  value: { type: String, required: true },
});

const Lookup = mongoose.model('Lookup', lookupSchema);
export default Lookup;
