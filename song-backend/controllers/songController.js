import Song from '../models/Song.js';






export const createSong = async (req, res) => {
  try {
    console.log('Files:', req.files); 
    console.log('Body:', req.body)
    const { title, artist, album, genre } = req.body;

   
    if (!req.files || !req.files.imageUrl || !req.files.audioUrl) {
      return res.status(400).json({ error: 'Image and audio files are required' });
    }

    const imageUrl = req.files.imageUrl[0].path; 
    const audioUrl = req.files.audioUrl[0].path; 

    const newSong = new Song({
      title,
      artist,
      album,
      genre,
      imageUrl,
      audioUrl,
    });

   
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};


export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find()
    

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

;
export const updateSong = async (req, res) => {
  try {
 

    const { title, artist, album, genre } = req.body;

 
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

 
    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (album) song.album = album;
    if (genre) song.genre = genre;


    if (req.files && req.files.imageUrl) {
      song.imageUrl = req.files.imageUrl[0].path; 
    }

   
    if (req.files && req.files.audioUrl) {
      song.audioUrl = req.files.audioUrl[0].path; 
    }

   
    await song.save();
    res.json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
export const deleteSong = async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

// export const getStats = async (_req, res) => {
//   const totalSongs = await Song.countDocuments();
//   const genres = await Song.aggregate([
//     { $group: { _id: '$genre', count: { $sum: 1 } } }
//   ]);
//   res.json({ totalSongs, genres });
// };
export const getStats = async (_req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').then((res) => res.length);
    const totalAlbums = await Song.distinct('album').then((res) => res.length);
    const totalGenres = await Song.distinct('genre').then((res) => res.length);

    const songsPerGenre = await Song.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'lookups',
          localField: '_id',
          foreignField: '_id',
          as: 'genre'
        }
      },
      { $unwind: '$genre' },
      {
        $project: {
          genre: '$genre.value',
          count: 1
        }
      }
    ]);

    const songsAndAlbumsPerArtist = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          songs: { $sum: 1 },
          albums: { $addToSet: '$album' }
        }
      },
      {
        $project: {
          artist: '$_id',
          songs: 1,
          albumsCount: { $size: '$albums' }
        }
      },
      {
        $lookup: {
          from: 'lookups',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
        }
      },
      { $unwind: '$artist' },
      {
        $project: {
          artist: '$artist.value',
          songs: 1,
          albumsCount: 1
        }
      }
    ]);

    const songsPerAlbum = await Song.aggregate([
      {
        $group: {
          _id: '$album',
          songs: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'lookups',
          localField: '_id',
          foreignField: '_id',
          as: 'album'
        }
      },
      { $unwind: '$album' },
      {
        $project: {
          album: '$album.value',
          songs: 1
        }
      }
    ]);

    res.json({
      totals: {
        songs: totalSongs,
        artists: totalArtists,
        albums: totalAlbums,
        genres: totalGenres
      },
      songsPerGenre,
      songsAndAlbumsPerArtist,
      songsPerAlbum
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
   

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.status(200).json(song);
  } catch (error) {
    console.error('Error fetching song by ID:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};