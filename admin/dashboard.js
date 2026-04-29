const SHEET_URLS = {
    agentLeads: 'https://script.google.com/macros/s/AKfycby1wJEExmbIMybJ5n83ZKZcGUzbKcQDz6tds9bG2Rmz3gEbd0nD6oLfLFd3yf85ub5z/exec',
    contactLeads: 'https://script.google.com/macros/s/AKfycbydkMVw35Pq6lQLW03cZFCoYX9e91kt-Uj9pR_RbhH0PFNh8Tz8KlIsCIY1ofXy4B4/exec', // TODO: Replace with new Google Sheet App Script URL
    callMeLeads: 'https://script.google.com/macros/s/AKfycbzO-WeUYUdN5jVl1iK4ud4cjSaf6DdaM438zBwGbR2TSM7Bzol0AoT-564omGxTYOya/exec'   // TODO: Replace with new Google Sheet App Script URL
};

let authToken = localStorage.getItem('dxel_admin_token');
let allLeads = {
    agentLeads: [],
    contactLeads: [],
    callMeLeads: []
};
let currentTab = 'agentLeads';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

// 1. Auth Check
if (authToken === 'valid_static_token') showDashboard();

// 2. Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const password = document.getElementById('adminPass').value;

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
    fetchLeads(currentTab);
    setInterval(() => fetchLeads(currentTab), 60000);
}

// 3. Tab Switching
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        document.querySelectorAll('.tab-view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${currentTab}View`).classList.remove('hidden');
        fetchLeads(currentTab);
    });
});

// 4. Lead Management (Fetching from Google Sheets)
async function fetchLeads(tabId) {
    const refreshBtn = document.querySelector(`.refresh-btn[data-tab="${tabId}"]`);
    if (refreshBtn) refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const url = SHEET_URLS[tabId];
        if (!url || url.includes('YOUR_')) {
            console.warn('Google Sheet URL not configured for', tabId);
            return;
        }
        
        // Add timestamp to bypass browser caching
        const fetchUrl = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
        
        const res = await fetch(fetchUrl);
        const data = await res.json();

        if (data.success && data.leads) {
            allLeads[tabId] = data.leads;
            renderLeads(tabId, allLeads[tabId]);
        }
    } catch (err) {
        console.error('Fetch error:', err);
    } finally {
        if (refreshBtn) refreshBtn.innerHTML = '<i class="fas fa-sync"></i>';
    }
}

function renderLeads(tabId, leads) {
    const tbody = document.getElementById(`${tabId}Body`);
    if (!tbody) return;
    tbody.innerHTML = '';

    // Update Stats based on current tab
    document.getElementById('totalLeads').textContent = leads.length;
    const today = new Date().toISOString().split('T')[0];
    const newToday = leads.filter(l => {
        const ts = l.timestamp || l.date;
        return ts && ts.toString().includes(today);
    }).length;
    document.getElementById('newLeadsToday').textContent = newToday;

    leads.forEach(lead => {
        const row = document.createElement('tr');

        let dateStr = 'Unknown Date';
        const rawDate = lead.timestamp || lead.date || lead.Date || lead.Timestamp;
        if (rawDate) {
            try { 
                const d = new Date(rawDate);
                if (!isNaN(d)) {
                    dateStr = d.toLocaleDateString(); 
                } else {
                    dateStr = String(rawDate);
                }
            } catch (e) { 
                dateStr = String(rawDate);
            }
        }

        const status = lead.status || lead.Status || 'New';
        const statusClass = `status-${status.toLowerCase()}`;

        let colsHTML = '';

        if (tabId === 'agentLeads') {
            const name = lead.name || lead.Name || lead['name / business'] || lead['name/business'] || lead['Name / Business'] || lead.business || 'Anonymous';
            const type = lead.type || lead.Type || 'N/A';
            const budget = lead.budget || lead.Budget || 'N/A';
            const email = lead.email || lead.Email || 'N/A';
            const phone = lead.phone || lead.Phone || 'N/A';
            colsHTML = `
                <td>${dateStr}</td>
                <td><strong>${name}</strong></td>
                <td>${type}</td>
                <td>${budget}</td>
                <td>${email}</td>
                <td>${phone}</td>
            `;
        } else if (tabId === 'contactLeads') {
            const name = lead.name || 'Anonymous';
            colsHTML = `
                <td>${dateStr}</td>
                <td><strong>${name}</strong></td>
                <td>${lead.email || 'N/A'}</td>
                <td>${lead.phone || 'N/A'}</td>
                <td>${lead.service || 'N/A'}</td>
                <td><div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${lead.message || ''}">${lead.message || 'N/A'}</div></td>
            `;
        } else if (tabId === 'callMeLeads') {
            const name = lead.name || 'Anonymous';
            colsHTML = `
                <td>${dateStr}</td>
                <td><strong>${name}</strong></td>
                <td>${lead.phone || 'N/A'}</td>
                <td>${lead.email || 'N/A'}</td>
                <td>${lead.select || 'N/A'}</td>
            `;
        }

        row.innerHTML = `
            ${colsHTML}
            <td><span class="lead-status ${statusClass}">${status}</span></td>
            <td>
                <div class="flex gap-sm">
                    <button class="icon-btn text-accent" onclick="editLead('${tabId}', ${lead.rowId})"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn text-red" onclick="deleteLead('${tabId}', ${lead.rowId})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 5. Remote Edit & Delete Actions
async function deleteLead(tabId, rowId) {
    if (!confirm('Are you sure you want to delete this lead from the Google Sheet? This cannot be undone.')) return;

    try {
        const url = SHEET_URLS[tabId];
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', rowId: rowId })
        });
        alert('Delete command sent! Refreshing dashboard...');
        setTimeout(() => fetchLeads(tabId), 1500);
    } catch (err) { alert('Delete request failed.'); }
}

function editLead(tabId, rowId) {
    const lead = allLeads[tabId].find(l => l.rowId === rowId);
    if (!lead) return;

    document.getElementById('editLeadId').value = rowId;
    // We attach the tabId to the form so we know which sheet to update
    editForm.dataset.tabId = tabId;

    document.getElementById('editName').value = lead.name || lead['name / business'] || '';
    document.getElementById('editEmail').value = lead.email || '';
    document.getElementById('editPhone').value = lead.phone || '';

    // Hide budget field if it's not agentLeads
    const budgetGroup = document.getElementById('editBudget').closest('.form-group');
    if (tabId !== 'agentLeads') {
        budgetGroup.style.display = 'none';
    } else {
        budgetGroup.style.display = 'block';
        document.getElementById('editBudget').value = lead.budget || '';
    }

    document.getElementById('editStatus').value = lead.status || 'New';

    editModal.classList.remove('hidden');
}

function closeModal() {
    editModal.classList.add('hidden');
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tabId = editForm.dataset.tabId;
    const rowId = document.getElementById('editLeadId').value;
    const submitBtn = editForm.querySelector('button[type="submit"]');

    const updatedData = {
        action: 'update',
        rowId: rowId,
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        status: document.getElementById('editStatus').value
    };

    if (tabId === 'agentLeads') {
        updatedData.budget = document.getElementById('editBudget').value;
    }

    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        const url = SHEET_URLS[tabId];
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(updatedData)
        });

        closeModal();
        setTimeout(() => fetchLeads(tabId), 1500);
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

document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', () => fetchLeads(btn.dataset.tab));
});

// Realtime Search filtering
document.querySelectorAll('.table-search').forEach(input => {
    input.addEventListener('input', (e) => {
        const tabId = e.target.dataset.tab;
        const term = e.target.value.toLowerCase();

        const filtered = allLeads[tabId].filter(l =>
            (l.name && l.name.toLowerCase().includes(term)) ||
            (l['name / business'] && l['name / business'].toLowerCase().includes(term)) ||
            (l.email && l.email.toLowerCase().includes(term)) ||
            (l.type && l.type.toLowerCase().includes(term)) ||
            (l.service && l.service.toLowerCase().includes(term)) ||
            (l.select && l.select.toLowerCase().includes(term)) ||
            (l.phone && l.phone.toLowerCase().includes(term))
        );
        renderLeads(tabId, filtered);
    });
});

// Make globally accessible
window.editLead = editLead;
window.deleteLead = deleteLead;
window.closeModal = closeModal;
