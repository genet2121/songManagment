
import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  genre: { type: String, required: true },
  imageUrl: { type: String },
  audioUrl: { type: String },
  createdAt:{type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}, 
});

const Song = mongoose.model('Song', songSchema);
export default Song;
