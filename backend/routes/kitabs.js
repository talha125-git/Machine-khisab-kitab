import express from 'express';
import Kitab from '../models/Kitab.js';

const router = express.Router();

// Middleware to check for user ID in headers
const requireUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. User ID required.' });
  }
  req.userId = userId;
  next();
};

// Apply middleware to all kitab routes
router.use(requireUser);

// GET all kitabs for a user
router.get('/', async (req, res) => {
  try {
    const kitabs = await Kitab.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(kitabs);
  } catch (err) {
    console.error('Error fetching kitabs:', err);
    res.status(500).json({ message: 'Server error fetching kitabs.' });
  }
});

// GET a single kitab by id
router.get('/:id', async (req, res) => {
  try {
    const kitab = await Kitab.findOne({ id: req.params.id, userId: req.userId });
    if (!kitab) {
      return res.status(404).json({ message: 'Kitab not found.' });
    }
    res.json(kitab);
  } catch (err) {
    console.error('Error fetching kitab:', err);
    res.status(500).json({ message: 'Server error fetching kitab.' });
  }
});

// POST create a new kitab
router.post('/', async (req, res) => {
  try {
    const kitabData = { ...req.body, userId: req.userId };
    const newKitab = new Kitab(kitabData);
    await newKitab.save();
    res.status(201).json(newKitab);
  } catch (err) {
    console.error('Error creating kitab:', err);
    res.status(500).json({ message: 'Server error creating kitab.' });
  }
});

// PUT update a kitab
router.put('/:id', async (req, res) => {
  try {
    const updatedKitab = await Kitab.findOneAndUpdate(
      { id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedKitab) {
      return res.status(404).json({ message: 'Kitab not found.' });
    }
    res.json(updatedKitab);
  } catch (err) {
    console.error('Error updating kitab:', err);
    res.status(500).json({ message: 'Server error updating kitab.' });
  }
});

// DELETE a kitab
router.delete('/:id', async (req, res) => {
  try {
    const deletedKitab = await Kitab.findOneAndDelete({ id: req.params.id, userId: req.userId });
    if (!deletedKitab) {
      return res.status(404).json({ message: 'Kitab not found.' });
    }
    res.json({ message: 'Kitab deleted successfully.' });
  } catch (err) {
    console.error('Error deleting kitab:', err);
    res.status(500).json({ message: 'Server error deleting kitab.' });
  }
});

export default router;
