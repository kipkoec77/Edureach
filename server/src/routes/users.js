const express = require('express')
const router = express.Router()
const Course = require('../models/Course')

// GET /api/users/:id/enrolled-courses
router.get('/:id/enrolled-courses', async (req, res) => {
  try{
    const userId = req.params.id
    const courses = await Course.find({ 'students.studentId': userId }).sort({ createdAt: -1 })
    res.json(courses)
  } catch (err){
    console.error(err)
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
