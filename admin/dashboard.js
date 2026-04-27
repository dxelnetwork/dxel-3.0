const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby1wJEExmbIMybJ5n83ZKZcGUzbKcQDz6tds9bG2Rmz3gEbd0nD6oLfLFd3yf85ub5z/exec';
let authToken = localStorage.getItem('dxel_admin_token');
let allLeads = [];

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const leadsBody = document.getElementById('leadsBody');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

// 1. Auth Check
if (authToken === 'valid_static_token') showDashboard();

// 2. Login Handler (Static Serverless Auth)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const password = document.getElementById('adminPass').value;
    
    // Simple static check since we have no backend. 
    // In a real app, you'd use a server or Firebase Auth.
    if (id === 'admin' && password === 'password123') {
        localStorage.setItem('dxel_admin_token', 'valid_static_token');
        authToken = 'valid_static_token';
        showDashboard();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    fetchLeads();
    setInterval(fetchLeads, 60000); // Auto-refresh every minute
}

// 3. Tab Switching (Simplified)
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${target}View`).classList.remove('hidden');
    });
});

// 4. Lead Management (Fetching from Google Sheets)
async function fetchLeads() {
    try {
        document.getElementById('refreshBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const res = await fetch(GOOGLE_SHEET_URL);
        const data = await res.json();
        
        if (data.success && data.leads) {
            allLeads = data.leads;
            renderLeads(allLeads);
        }
    } catch (err) { 
        console.error('Fetch error:', err); 
        // If the script isn't updated yet, it might fail CORS or return HTML.
    } finally {
        document.getElementById('refreshBtn').innerHTML = '<i class="fas fa-sync"></i>';
    }
}

function renderLeads(leads) {
    leadsBody.innerHTML = '';
    document.getElementById('totalLeads').textContent = leads.length;
    
    // Count new today (assuming timestamp is stored)
    const today = new Date().toISOString().split('T')[0];
    const newToday = leads.filter(l => {
        const ts = l.timestamp || l.date;
        return ts && ts.toString().includes(today);
    }).length;
    document.getElementById('newLeadsToday').textContent = newToday;

    leads.forEach(lead => {
        const row = document.createElement('tr');
        
        // Parse the timestamp safely
        let dateStr = 'Unknown Date';
        const rawDate = lead.timestamp || lead.date;
        if (rawDate) {
            try {
                dateStr = new Date(rawDate).toLocaleDateString();
            } catch(e) {}
        }
        
        const name = lead.name || lead['name / business'] || 'Anonymous';
        const email = lead.email || 'N/A';
        const phone = lead.phone || 'N/A';
        const status = lead.status || 'New';
        const statusClass = `status-${status.toLowerCase()}`;

        row.innerHTML = `
            <td>${dateStr}</td>
            <td><strong>${name}</strong></td>
            <td>${lead.type || 'N/A'}</td>
            <td>${lead.budget || 'N/A'}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td><span class="lead-status ${statusClass}">${status}</span></td>
            <td>
                <div class="flex gap-sm">
                    <button class="icon-btn text-accent" onclick="editLead(${lead.rowId})"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn text-red" onclick="deleteLead(${lead.rowId})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        leadsBody.appendChild(row);
    });
}

// 5. Remote Edit & Delete Actions
async function deleteLead(rowId) {
    if (!confirm('Are you sure you want to delete this lead from the Google Sheet? This cannot be undone.')) return;
    
    try {
        const res = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', rowId: rowId })
        });
        // We use mode: 'no-cors' automatically sometimes, but assuming fetch works natively for POST
        // In Apps Script, standard POST without headers is usually allowed without preflight.
        alert('Delete command sent! Refreshing dashboard...');
        setTimeout(fetchLeads, 1500); // Wait a second for Google Sheets to process
    } catch (err) { alert('Delete request failed.'); }
}

function editLead(rowId) {
    const lead = allLeads.find(l => l.rowId === rowId);
    if (!lead) return;
    
    document.getElementById('editLeadId').value = lead.rowId;
    document.getElementById('editName').value = lead.name || lead['name / business'] || '';
    document.getElementById('editEmail').value = lead.email || '';
    document.getElementById('editPhone').value = lead.phone || '';
    document.getElementById('editBudget').value = lead.budget || '';
    document.getElementById('editStatus').value = lead.status || 'New';
    
    editModal.classList.remove('hidden');
}

function closeModal() {
    editModal.classList.add('hidden');
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rowId = document.getElementById('editLeadId').value;
    const submitBtn = editForm.querySelector('button[type="submit"]');
    
    const updatedData = {
        action: 'update',
        rowId: rowId,
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        budget: document.getElementById('editBudget').value,
        status: document.getElementById('editStatus').value
    };

    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: JSON.stringify(updatedData)
        });
        
        closeModal();
        setTimeout(fetchLeads, 1500); // Give sheet time to update
    } catch (err) { 
        alert('Update request failed.'); 
    } finally {
        submitBtn.innerHTML = 'Save Changes';
        submitBtn.disabled = false;
    }
});

// 6. Utilities
function logout() { 
    localStorage.removeItem('dxel_admin_token'); 
    window.location.reload(); 
}

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('refreshBtn').addEventListener('click', fetchLeads);

// Realtime Search filtering
document.getElementById('searchLeads').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allLeads.filter(l => 
        (l.name && l.name.toLowerCase().includes(term)) || 
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.type && l.type.toLowerCase().includes(term))
    );
    renderLeads(filtered);
});

// Make globally accessible for onclick
window.editLead = editLead;
window.deleteLead = deleteLead;
window.closeModal = closeModal;
