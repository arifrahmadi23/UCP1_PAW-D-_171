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



// Endpoint to add a new patient
router.post('/', (req, res) => {
    const { namaPasien, alamat, noTelp } = req.body;

    if (!namaPasien || !alamat || !noTelp) {
        return res.status(400).json({ message: 'Data tidak lengkap!' });
    }

    const sql = 'INSERT INTO pasien (NamaPasien, Alamat, NoTelp) VALUES (?, ?, ?)';
    db.query(sql, [namaPasien, alamat, noTelp], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Gagal menambahkan pasien ke database.' });
        }
        res.status(201).json({ message: 'Pasien berhasil ditambahkan.' });
    });
});


// Endpoint to update a patient's details
router.put('/:id', (req, res) => {
    const { namaPasien, alamat, noTelp } = req.body;

    // Ensure all fields are provided
    if (!namaPasien || !alamat || !noTelp) {
        return res.status(400).send('All fields are required');
    }

    const sql = 'UPDATE pasien SET NamaPasien = ?, Alamat = ?, NoTelp = ? WHERE id = ?';
    db.query(sql, [namaPasien, alamat, noTelp, req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Pasien tidak ditemukan');
        }
        res.json({ id: req.params.id, namaPasien, alamat, noTelp });  // Return the updated data
    });
});





// Endpoint to delete a patient
router.delete('/:id', (req, res) => {
    console.log("ID yang diterima di server:", req.params.id);  // Cek ID yang diterima
    db.query('DELETE FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Patient not found');
        res.status(204).send();
    });
});


module.exports = router;
