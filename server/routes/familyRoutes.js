import express from 'express';
import Family from '../models/Family.js';
import Member from '../models/Member.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/families — list all families with search/filter
router.get('/', protect, async (req, res) => {
  try {
    const { search, ward } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { houseName: { $regex: search, $options: 'i' } },
        { houseHolderOnlyName: { $regex: search, $options: 'i' } },
        { houseNumber: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } },
      ];
    }
    if (ward) {
      query.wardNumber = ward;
    }
    const families = await Family.find(query).sort({ createdAt: -1 });
    res.json(families);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/families/:id — get single family with its members
router.get('/:id', protect, async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ message: 'Family not found' });
    const members = await Member.find({ familyId: family._id });
    res.json({ family, members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/families — create a new family
router.post('/', protect, async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/families/:id — update a family
router.put('/:id', protect, async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ message: 'Family not found' });
    Object.assign(family, req.body);
    const updatedFamily = await family.save();
    res.json(updatedFamily);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/families/:id — delete a family and its members
router.delete('/:id', protect, async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ message: 'Family not found' });
    await Member.deleteMany({ familyId: family._id });
    await family.deleteOne();
    res.json({ message: 'Family and its members removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
