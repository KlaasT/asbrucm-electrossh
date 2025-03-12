const mitt = require('mitt');
const emitter = mitt();

function addTab(tabId, displayName) {
    const tabList = document.getElementById('terminal-tabs');
    const tab = document.createElement('li');
    tab.className = 'mr-2 bg-gray-700 rounded-t-lg shadow-md border-b-2 border-transparent hover:border-blue-500 rounded p-2';
    tab.innerHTML = `
        <a class="inline-block px-4 py-2 text-white text-sm font-medium" id="tab-${tabId}-tab">${displayName} <span class="close-tab text-gray-300 hover:text-red-500 cursor-pointer ml-2">✕</span></a>
    `;
    tabList.appendChild(tab);

    const tabLink = tab.querySelector('a');
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        emitter.emit('switchTab', tabId);
    });
    tab.querySelector('.close-tab').addEventListener('click', (e) => {
        e.stopPropagation();
        emitter.emit('closeTab', tabId);
    });

    emitter.emit('switchTab', tabId);
}

function switchTab(tabId, terminals) {
    const oldTab = document.getElementById(`terminal-${terminals.activeTabId}`);
    const oldTabLink = document.getElementById(`tab-${terminals.activeTabId}-tab`);
    if (oldTab) oldTab.classList.add('hidden');
    if (oldTabLink) {
        oldTabLink.parentElement.classList.remove('border-blue-500', 'bg-gray-600');
        oldTabLink.classList.remove('text-blue-300');
    }

    const newTab = document.getElementById(`terminal-${tabId}`);
    const newTabLink = document.getElementById(`tab-${tabId}-tab`);
    if (newTab) newTab.classList.remove('hidden');
    if (newTabLink) {
        newTabLink.parentElement.classList.add('border-blue-500', 'bg-gray-600');
        newTabLink.classList.add('text-blue-300');
    }

    terminals.activeTabId = tabId;
    const terminal = terminals.list.find(t => t.id === tabId);
    if (terminal) {
        terminal.term.focus();
        const { resizeTerminal } = require('./terminal');
        // Defer resize to ensure container is visible and sized
        setTimeout(() => resizeTerminal(terminal.term, terminal.fitAddon), 0);
    }
}

function showModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function renderFavorites(favorites) {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '';

    const grouped = favorites.reduce((acc, fav, index) => {
        const group = fav.group || 'Ungrouped';
        if (!acc[group]) acc[group] = [];
        acc[group].push({ ...fav, index });
        return acc;
    }, {});

    Object.keys(grouped).forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-4';
        groupDiv.innerHTML = `
            <h6 class="cursor-pointer mb-2 text-light-text hover:text-white" onclick="window.api.toggleGroup(this)">${group}</h6>
            <div class="group-items"></div>
        `;
        const itemsDiv = groupDiv.querySelector('.group-items');
        grouped[group].forEach(fav => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-2 hover:bg-dark-hover cursor-pointer';
            div.innerHTML = `
                <span ondblclick="window.api.connectToFavorite(${fav.index})">${fav.displayName}</span>
                <span class="flex space-x-2">
                    <button class="bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded" onclick="window.api.editFavorite(${fav.index})">Edit</button>
                    <button class="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded" onclick="window.api.removeFavorite(${fav.index})">X</button>
                </span>
            `;
            itemsDiv.appendChild(div);
        });
        list.appendChild(groupDiv);
    });
}

module.exports = { addTab, switchTab, showModal, hideModal, renderFavorites, emitter };