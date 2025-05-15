
import Lookup from '../models/Lookup.js';


export const createLookup = async (req, res) => {
  try {
    const { category, value } = req.body;
    const lookup = new Lookup({ category, value });
    await lookup.save();
    res.status(201).json(lookup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getLookups = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const lookups = await Lookup.find(filter);
    res.status(200).json(lookups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteLookup = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lookup.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateLookup = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value } = req.body;

    
    const updatedLookup = await Lookup.findByIdAndUpdate(
      id,
      { category, value },
      { new: true, runValidators: true } 
    );

    if (!updatedLookup) {
      return res.status(404).json({ message: 'Lookup not found' });
    }

    res.status(200).json(updatedLookup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};