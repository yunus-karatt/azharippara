import express from 'express';
import Member from '../models/Member.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/members?familyId=xxx — get members for a family
router.get('/', protect, async (req, res) => {
  try {
    const { familyId } = req.query;
    let query = {};
    if (familyId) query.familyId = familyId;
    const members = await Member.find(query).populate('familyId', 'houseName houseNumber');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/members/:id — get single member
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('familyId', 'houseName houseNumber');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/members — create a new member
router.post('/', protect, async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/members/:id — update a member
router.put('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    Object.assign(member, req.body);
    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/members/:id — delete a member
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    await member.deleteOne();
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
