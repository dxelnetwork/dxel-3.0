const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'dxel_secret_key_99'; 
const ADMIN_CREDENTIALS = { id: 'admin', password: 'password123' };

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbynURneFNfY_gPHLSLu5676jldJ4TMvUTbcBmeAEvAH0aBg4tR6V_BCBb7OQ7ZAX0GI/exec';

app.use(cors());
app.use(bodyParser.json());

const LEADS_FILE = path.join(__dirname, 'leads.json');
const TRAINING_FILE = path.join(__dirname, 'training.json');

// Initialize files
if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, JSON.stringify([]));
if (!fs.existsSync(TRAINING_FILE)) fs.writeFileSync(TRAINING_FILE, JSON.stringify({ KB: {}, INTENTS: [] }));

async function syncToGoogleSheets(lead) {
    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
        });
    } catch (error) { console.error('Sync Error:', error); }
}

// BOT APIs
app.get('/api/training', (req, res) => {
    try { res.json(JSON.parse(fs.readFileSync(TRAINING_FILE))); } catch (err) { res.status(500).json({ error: 'Fail' }); }
});

app.post('/api/leads', (req, res) => {
    try {
        const lead = { id: Date.now(), timestamp: new Date().toISOString(), ...req.body, status: 'New' };
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE));
        leads.unshift(lead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
        syncToGoogleSheets(lead);
        res.status(201).json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});

// ADMIN APIs
app.post('/api/admin/login', (req, res) => {
    const { id, password } = req.body;
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else res.status(401).json({ success: false });
});

app.get('/api/admin/leads', verifyToken, (req, res) => {
    try { res.json({ success: true, leads: JSON.parse(fs.readFileSync(LEADS_FILE)) }); } catch (err) { res.status(500).json({ success: false }); }
});

// [NEW] Delete Lead
app.delete('/api/admin/leads/:id', verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let leads = JSON.parse(fs.readFileSync(LEADS_FILE));
        leads = leads.filter(l => l.id !== id);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
        res.json({ success: true, message: 'Lead deleted' });
    } catch (err) { res.status(500).json({ success: false }); }
});

// [NEW] Update Lead
app.put('/api/admin/leads/:id', verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedLead = req.body;
        let leads = JSON.parse(fs.readFileSync(LEADS_FILE));
        const index = leads.findIndex(l => l.id === id);
        if (index !== -1) {
            leads[index] = { ...leads[index], ...updatedLead };
            fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
            res.json({ success: true, message: 'Lead updated' });
        } else res.status(404).json({ success: false, message: 'Lead not found' });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/admin/training', verifyToken, (req, res) => {
    try { fs.writeFileSync(TRAINING_FILE, JSON.stringify(req.body, null, 2)); res.json({ success: true }); } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/admin/sync-all', verifyToken, async (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE));
        for (const lead of leads) { await syncToGoogleSheets(lead); await new Promise(r => setTimeout(r, 300)); }
        res.json({ success: true, message: `Synced ${leads.length} leads` });
    } catch (err) { res.status(500).json({ success: false }); }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, SECRET_KEY, (err, authData) => {
            if (err) res.status(403).json({ success: false });
            else { req.authData = authData; next(); }
        });
    } else res.status(403).json({ success: false });
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
