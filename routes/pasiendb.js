const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Ensure you have the correct database connection

// Endpoint to get all patients
router.get('/', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint to get a specific patient by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Patient not found');
        res.json(results[0]);
    });
});

// Endpoint to add a new patient
router.post('/', (req, res) => {
    const { NamaPasien, Alamat, NoTelp } = req.body;
    if (!NamaPasien || NamaPasien.trim() === '') {
        return res.status(400).send('Patient name is required');
    }

    db.query('INSERT INTO pasien (NamaPasien, Alamat, NoTelp) VALUES (?, ?, ?)', 
    [NamaPasien.trim(), Alamat.trim(), NoTelp], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newPatient = { id: results.insertId, NamaPasien: NamaPasien.trim(), Alamat, NoTelp };
        res.status(201).json(newPatient);
    });
});

// Endpoint to update a patient's details
router.put('/:id', (req, res) => {
    const { NamaPasien, Alamat, NoTelp } = req.body;

    db.query('UPDATE pasien SET NamaPasien = ?, Alamat = ?, NoTelp = ? WHERE id = ?', 
    [NamaPasien, Alamat, NoTelp, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Patient not found');
        res.json({ id: req.params.id, NamaPasien, Alamat, NoTelp });
    });
});

// Endpoint to delete a patient
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Patient not found');
        res.status(204).send();
    });
});

module.exports = router;
