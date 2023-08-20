const express = require('express');
const validateToken = require('../middleware/validateToken');
const { createJournal,deleteJournal,getJournalsByTeacher,updateJournal,getJournalsByStudent,getAllJournals } = require('../controllers/JournalController');
const router = express.Router();

router.post("/create",validateToken,createJournal);
router.delete("/delete/:email/:id",validateToken,deleteJournal);
router.put("/update/:email/:id",validateToken,updateJournal);
router.get("/teacher/:email",validateToken,getJournalsByTeacher);
router.get("/student/:email",validateToken,getJournalsByStudent);
router.get("/getall",getAllJournals);

module.exports = router;