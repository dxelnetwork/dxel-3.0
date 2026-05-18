const fs = require('fs');
const path = require('path');

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbynURneFNfY_gPHLSLu5676jldJ4TMvUTbcBmeAEvAH0aBg4tR6V_BCBb7OQ7ZAX0GI/exec';
const LEADS_FILE = path.join(__dirname, 'leads.json');

async function manualSync() {
    console.log('--- DXEL MANUAL SYNC START ---');
    
    if (!fs.existsSync(LEADS_FILE)) {
        console.error('Error: leads.json not found!');
        return;
    }

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE));
    console.log(`Found ${leads.length} leads. Starting sync...`);

    for (const lead of leads) {
        // Data Mapping for older leads
        if (!lead.email && !lead.phone && lead.contact) {
            if (lead.contact.includes('@')) {
                lead.email = lead.contact;
            } else {
                lead.phone = lead.contact;
            }
        }
        
        console.log(`Syncing lead: ${lead.name || 'Anonymous'} (${lead.timestamp})`);
        try {
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            console.log('  Success!');
        } catch (err) {
            console.error(`  Failed: ${err.message}`);
        }
        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('--- MANUAL SYNC COMPLETE ---');
}

manualSync();
