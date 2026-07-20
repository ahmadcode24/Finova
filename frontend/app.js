// State
let sessionId = null;
let pollInterval = null;
let uploadedFilesCache = new Set();
let selectedFilename = null;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

// Elements
const fileInput = document.getElementById('file-input');
const activeDocuments = document.getElementById('active-documents');
const recentChatsList = document.getElementById('recent-chats-list');
const toastContainer = document.getElementById('toast-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatHistory = document.getElementById('chat-history');
const emptyState = document.getElementById('empty-state');

// Toast Notification
function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeft = type === 'error' ? '4px solid #ef4444' : '4px solid #10b981';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// File Upload Logic
if(fileInput) {
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset
    });
}

function handleFiles(files) {
    if (!sessionId) return;
    const allowedExtensions = ['.xlsx', '.xls', '.pdf', '.docx'];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(ext)) { showToast(`Unsupported file: ${file.name}`); continue; }
        if (file.size > MAX_FILE_SIZE) { showToast(`File too large: ${file.name}`); continue; }
        if (uploadedFilesCache.has(file.name)) { showToast(`Duplicate file: ${file.name}`); continue; }
        validFiles.push(file);
    }
    if (validFiles.length > 0) uploadFiles(validFiles);
}

async function uploadFiles(files) {
    const formData = new FormData();
    for (const file of files) formData.append('files', file);
    formData.append('session_id', sessionId);

    try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        if (response.ok) {
            showToast(`${files.length} file(s) uploaded`, 'success');
            files.forEach(f => uploadedFilesCache.add(f.name));
            pollStatus();
        } else {
            showToast(data.detail || 'Upload failed');
        }
    } catch (error) {
        showToast('Network error during upload');
    }
}

// Status Polling
function pollStatus() {
    fetchDocuments();
    if (!pollInterval) pollInterval = setInterval(fetchDocuments, 2000);
}
function stopPollingIfIdle(docs) {
    if (!docs || docs.length === 0) return;
    const hasProcessing = docs.some(doc => doc.status === 'processing');
    if (!hasProcessing && pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}
async function fetchDocuments() {
    if (!sessionId) return;
    try {
        const response = await fetch(`/api/documents?session_id=${sessionId}`);
        if (!response.ok) return;
        const docs = await response.json();
        renderDocuments(docs);
        stopPollingIfIdle(docs);
    } catch (error) {}
}

function renderDocuments(docs) {
    if (!docs) return;
    uploadedFilesCache.clear();
    docs.forEach(doc => uploadedFilesCache.add(doc.filename));

    if (activeDocuments) {
        activeDocuments.innerHTML = docs.map(doc => `
            <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-[var(--border-strong)] text-[12px] cursor-pointer ${selectedFilename === doc.filename ? 'ring-1 ring-primary' : ''}" onclick="selectDocument('${doc.filename}')">
                <span class="material-symbols-outlined text-[14px]">description</span>
                <span class="truncate max-w-[120px]" title="${doc.filename}">${doc.filename}</span>
                <span class="status-indicator status-${doc.status} w-2 h-2 ml-1" title="${doc.status}"></span>
                <button onclick="deleteDocument('${doc.id}', '${doc.filename}', event)" class="ml-1 text-on-surface-variant hover:text-error" title="Remove">
                    <span class="material-symbols-outlined text-[14px]">close</span>
                </button>
            </div>
        `).join('');
    }

    const hasReadyDoc = docs.some(doc => doc.status === 'ready');
    if (hasReadyDoc && chatInput && sendBtn) {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
    }
}

window.selectDocument = function(filename) {
    selectedFilename = selectedFilename === filename ? null : filename;
    fetchDocuments(); // refresh visual
};

window.deleteDocument = async function(id, filename, event) {
    event.stopPropagation();
    if (!confirm(`Delete "${filename}"?`)) return;
    try {
        const response = await fetch(`/api/documents/${id}?session_id=${sessionId}`, { method: 'DELETE' });
        if (response.ok) {
            uploadedFilesCache.delete(filename);
            if (selectedFilename === filename) selectedFilename = null;
            showToast(`Deleted ${filename}`, 'success');
            pollStatus();
        }
    } catch (error) {}
};

// Sessions & History
async function loadSessions() {
    try {
        const res = await fetch('/api/sessions');
        const sessions = await res.json();
        renderSessions(sessions);
        if (sessions.length > 0) {
            await switchSession(sessions[0].id);
        } else {
            await startNewChat();
        }
    } catch (error) {
        console.error('Failed to load sessions', error);
    }
}

function renderSessions(sessions) {
    if (!recentChatsList) return;
    recentChatsList.innerHTML = sessions.map(s => {
        const docsHtml = s.documents && s.documents.length > 0 
            ? `<div class="text-[10px] text-on-surface-variant/70 mt-1 flex items-center gap-1">
                 <span class="material-symbols-outlined text-[12px]">attach_file</span>
                 <span class="truncate">${s.documents.join(', ')}</span>
               </div>` 
            : '';
            
        return `
        <li class="p-2 rounded-lg cursor-pointer hover:bg-surface-variant text-sm flex flex-col ${sessionId === s.id ? 'bg-surface border border-[var(--border-strong)]' : 'text-on-surface-variant border border-transparent'}" onclick="switchSession('${s.id}')">
            <span class="truncate font-medium ${sessionId === s.id ? 'text-on-surface' : ''}">${s.title}</span>
            ${docsHtml}
        </li>
        `;
    }).join('');
}

window.switchSession = async function(id) {
    if(sessionId === id) return;
    sessionId = id;
    selectedFilename = null;
    
    // UI resets
    const messages = chatHistory.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
    if (emptyState) emptyState.style.display = 'flex';
    if (activeDocuments) activeDocuments.innerHTML = '';
    
    // Enable input right away so user can chat even if no doc
    if (chatInput && sendBtn) {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
    }
    
    // Fetch History
    try {
        const res = await fetch(`/api/sessions/${id}/messages`);
        const msgs = await res.json();
        if(msgs.length > 0 && emptyState) emptyState.style.display = 'none';
        msgs.forEach(m => appendMessage(m.role, m.content));
    } catch(e) {}
    
    // Re-highlight active session in sidebar
    fetch('/api/sessions').then(res => res.json()).then(renderSessions);
    pollStatus();
}

window.startNewChat = async function() {
    try {
        const res = await fetch('/api/sessions', { method: 'POST' });
        const newSession = await res.json();
        await switchSession(newSession.id);
        showToast('New Chat session initialized', 'success');
    } catch (error) {
        showToast('Failed to create new chat');
    }
};

// Chat Logic
if(sendBtn) sendBtn.addEventListener('click', sendMessage);
if(chatInput) {
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || !sessionId) return;

    if (emptyState) emptyState.style.display = 'none';
    appendMessage('user', message);
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;

    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message system-message';
    loadingDiv.innerHTML = '<span style="opacity: 0.7;">Analyzing... <span class="material-symbols-outlined animate-spin" style="font-size:14px; vertical-align:middle;">sync</span></span>';
    chatHistory.appendChild(loadingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const reqBody = { session_id: sessionId, message: message };
        if (selectedFilename) reqBody.filename = selectedFilename;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        });
        const data = await response.json();
        document.getElementById(loadingId)?.remove();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Chat request failed');
        }

        let aiText = data.answer;
        if (data.sources && data.sources.length > 0) {
            aiText += `\n\n<small>Sources: ${data.sources.join(', ')}</small>`;
        }
        appendMessage('system', aiText);
        
        // Refresh sidebar to update title
        fetch('/api/sessions').then(res => res.json()).then(renderSessions);
    } catch (error) {
        document.getElementById(loadingId)?.remove();
        appendMessage('system', 'Error generating response.');
    } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

function appendMessage(sender, text) {
    if (!chatHistory) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'system' ? 'system-message' : 'user-message'}`;
    if (typeof marked !== 'undefined') {
        msgDiv.innerHTML = marked.parse(text);
    } else {
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    }
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    document.querySelector('main').scrollTop = document.querySelector('main').scrollHeight;
}

// Theme
window.toggleTheme = function() {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.contains('dark');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    if (isDark) {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
        if (themeText) themeText.textContent = 'Switch to Dark';
    } else {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
        if (themeText) themeText.textContent = 'Switch to Light';
    }
};

(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const htmlEl = document.documentElement;
    if (savedTheme === 'light') {
        htmlEl.classList.remove('dark');
        const i = document.getElementById('theme-icon');
        const t = document.getElementById('theme-text');
        if(i) i.textContent = 'dark_mode';
        if(t) t.textContent = 'Switch to Dark';
    }
})();

// Initialization
loadSessions();
