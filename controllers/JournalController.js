const asyncHandler = require('express-async-handler');
const client = require('../config/dbConnection');

//@desc create journal
//@route POST /toddle/journal/create
//@access Private and teacher

const createJournal = asyncHandler(async (req, res) => {
    if (req.user.role !== 'teacher') {
        res.status(401).send({ message: "Only teachers can create journals" });
    }
    const email = req.user.email;
    const { id, description,file, students,created_at } = req.body;
    if(!id || !description || !students || !file){
        res.status(400).send({ message: "Please enter all fields" });
    }
    if(!created_at){
        created_at = new Date();
    }
    for(let i=0;i<req.body.students.length;i++){
        const student = await client.query(`SELECT * FROM Users WHERE email = '${req.body.students[i]}' and role = 'student'`);
        if(student.rowCount == 0){
            res.status(400).send({ message: "Invalid student data" });
        }
    }
    const insertQuery = `
            INSERT INTO Journal (id, email, description, file , students, created_at) 
            VALUES ($1, $2, $3, $4 ,$5::text[], $6)
        `;
    const journal = await client.query(insertQuery, [id, email, description,file, students, created_at]);
    if (journal) {
        res.status(201).send({ message: "Journal created successfully" });
    }
    else {
        res.status(400).send({ message: "Invalid journal data" });
    }
}
);
//@desc delete journal
//@route DELETE /toddle/journal/delete/:email/:id
//@access Private and teacher

const deleteJournal = asyncHandler(async (req, res) => {
    if (req.user.role !== 'teacher') {
        res.status(401).send({ message: "Only teachers can delete journals" });
    }
    const journal = await client.query(`DELETE FROM Journal WHERE email = '${req.params.email}' and id = '${req.params.id}'`);
        if (journal.rowCount > 0) {
            res.status(201).send({ message: "Journal deleted successfully" });
        }
        else {
            res.status(400).send({ message: "Invalid journal data" });
        }
});

//@desc get all journals by particular teacher
//@route GET /toddle/journal/teacher/:email
//@access Private and teacher

const getJournalsByTeacher = asyncHandler(async (req, res) => {
    if (req.user.role !== 'teacher') {
        res.status(401).send({ message: "Only teachers can view journals" });
    }
    const getQuery = `SELECT * FROM Journal WHERE email = $1`;
    const journals = await client.query(getQuery, [req.params.email]);
    if (journals) {
        res.status(201).send({ journals: journals.rows });
    }
    else {
        res.status(400).send({ message: "No journal data" });
    }
});

//@desc update journal
//@route PUT /toddle/journal/update/:email/:id
//@access Private and teacher

const updateJournal = asyncHandler(async (req, res) => {
    if (req.user.role !== 'teacher') {
        res.status(401).send({ message: "Only teachers can update journals" });
    }
    const {email,id} = req.params;
    const {description,file, students,created_at } = req.body;
    if(!description || !students || !file){
        res.status(400).send({ message: "Please enter all fields" });
    }
    if(!created_at){
        created_at = new Date();
    }
    for(let i=0;i<req.body.students.length;i++){
        const student = await client.query(`SELECT * FROM Users WHERE email = '${req.body.students[i]}' and role = 'student'`);
        if(student.rowCount == 0){
            res.status(400).send({ message: "Invalid student data" });
        }
    }
    const updateQuery = `UPDATE Journal SET description = $1,file = $2, students = $3::text[], created_at = $4 WHERE email = $5 and id = $6`
    const journal = await client.query(updateQuery, [description,file, students,created_at, email, id]);
    if (journal.rowCount > 0) {
        res.status(201).send({ message: "Journal updated successfully" });
    }
    else {
        res.status(400).send({ message: "Invalid journal data" });
    }
});

//@desc get all journals for particular student 
//@route GET /toddle/journal/student/:email
//@access Private and student

const getJournalsByStudent = asyncHandler(async (req, res) => {
    if(req.user.role !== 'student'){
        res.status(401).send({ message: "Only students can view journals" });
    }
    const journals = await client.query(`SELECT * FROM Journal WHERE $1 = ANY(students) AND created_at <= $2`,[req.params.email,new Date()]);
    if (journals) {
        res.status(201).send({ journals: journals.rows });
    }
    else {
        res.status(400).send({ message: "Invalid journal data" });
    }
});
//@desc get all jounals
//@route GET /toddle/journal/getall
//@access all

const getAllJournals = asyncHandler(async (req, res) => {
    const journals = await client.query(`SELECT * FROM Journal`);
    if (journals) {
        res.status(201).send({ journals: journals.rows });
    }
    else {
        res.status(400).send({ message: "Invalid journal data" });
    }
});
module.exports = {createJournal, deleteJournal,getJournalsByTeacher,updateJournal,getJournalsByStudent,getAllJournals };