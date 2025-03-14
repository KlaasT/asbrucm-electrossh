<template>
  <div class="bg-dark font-sans text-light-text flex h-screen">
    <!-- Sidebar (Left, full height) -->
    <div id="sidebar" class="w-64 bg-dark-hover p-4 overflow-y-auto flex-shrink-0 shadow-custom border-r border-gray-700">
      <favorites @connect="connectToFavorite" @edit="editFavorite" />
    </div>

    <!-- Right Side (Tabs, Terminal, Buttons) -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Tabs -->
      <ul id="terminal-tabs" class="p-2 flex border-b border-gray-700">
        <li v-for="terminal in terminals.list" :key="terminal.id" class="mr-2">
          <a
              :class="[
              'inline-block px-4 py-2 text-white text-sm font-medium shadow-custom rounded-t-lg',
              terminal.id === terminals.activeTabId
                ? 'bg-gray-600 border-blue-500 text-blue-300'
                : 'bg-dark-hover border-transparent hover:border-blue-500'
            ]"
              @click="switchTab(terminal.id)"
          >
            {{ terminal.displayName || terminal.id }}
            <span class="close-tab text-gray-300 hover:text-red-500 cursor-pointer ml-2" @click.stop="closeTab(terminal.id)">✕</span>
          </a>
        </li>
      </ul>

      <!-- Terminal Container -->
      <div id="terminal-container" class="flex-grow relative overflow-y-auto min-h-0 bg-gray-900 border border-gray-700 rounded-md m-2">
        <div
            v-for="terminal in terminals.list"
            :key="terminal.id"
            :id="`terminal-${terminal.id}`"
            class="absolute top-0 left-0 w-full h-full"
            :class="{ 'hidden': terminal.id !== terminals.activeTabId }"
        ></div>
      </div>

      <!-- Bottom Buttons -->
      <div class="bg-dark p-2 flex justify-end space-x-2 border-t border-custom">
        <button id="new-tab-btn" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow-custom" @click="addTab">New Tab</button>
        <button id="settings-btn" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded shadow-custom" @click="openSettings">Settings</button>
        <button id="add-favorite-btn" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded shadow-custom" @click="openFavorite">Add Favorite</button>
      </div>
    </div>

    <!-- Modals -->
    <settings-modal :is-visible="showSettingsModal" @close="closeSettings" />
    <favorite-modal :is-visible="showFavoriteModal" :editing-favorite="editingFavorite" @close="closeFavoriteModal" />
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { nanoid } from 'nanoid';
import { createTerminal, resizeTerminal, connectSSH } from './terminal.js';
import SettingsModal from './components/SettingsModal.vue';
import Favorites from './components/Favorites.vue';
import FavoriteModal from './components/FavoriteModal.vue';

const { ipcRenderer } = window.require('electron');

export default {
  components: { SettingsModal, Favorites, FavoriteModal },
  setup() {
    const terminals = ref({ list: [], activeTabId: null });
    const showSettingsModal = ref(false);
    const showFavoriteModal = ref(false);
    const editingFavorite = ref(null);

    onMounted(() => {
      addTab(); // Start with one tab
    });

    const addTab = () => {
      console.log('New Tab button clicked');
      const tabId = `Tab-${nanoid(5)}`;
      const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
      terminal.displayName = tabId;
      terminals.value.list.push(terminal);
      nextTick(() => {
        const container = document.getElementById(`terminal-${tabId}`);
        if (container) {
          console.log(`Opening terminal for tab ${tabId}`);
          terminal.term.open(container);
          setTimeout(() => {
            resizeTerminal(terminal.term, terminal.fitAddon);
            if (terminal.id === terminals.value.activeTabId) {
              console.log(`Focusing terminal for tab ${tabId}`);
              terminal.term.focus();
            }
          }, 100);
        } else {
          console.error(`Container for terminal-${tabId} not found`);
        }
      });
      switchTab(tabId);
    };

    const switchTab = (tabId) => {
      console.log('Switching to tab:', tabId);
      terminals.value.activeTabId = tabId;
      nextTick(() => {
        const terminal = terminals.value.list.find(t => t.id === tabId);
        if (terminal) {
          console.log(`Resizing and focusing tab ${tabId}`);
          setTimeout(() => {
            resizeTerminal(terminal.term, terminal.fitAddon);
            terminal.term.focus();
          }, 100);
        }
      });
    };

    const closeTab = (tabId) => {
      console.log(`Closing tab: ${tabId}`);
      const index = terminals.value.list.findIndex(t => t.id === tabId);
      if (index === -1) return;

      const terminal = terminals.value.list[index];

      // If SSH was active, disconnect it before closing the tab
      if (terminal.state.shellType === 'ssh' && terminal.state.shellStream) {
        ipcRenderer.send('disconnect-ssh', tabId);
      }

      terminal.term.dispose();
      terminal.term.element.remove();
      terminals.value.list.splice(index, 1);

      // Automatically switch to another tab, or open a new tab if none remain
      if (terminals.value.activeTabId === tabId) {
        terminals.value.activeTabId = terminals.value.list.length > 0
            ? terminals.value.list[Math.max(0, index - 1)].id
            : null;

        if (!terminals.value.activeTabId) addTab();
      }
    };

    const openSettings = () => {
      console.log('Settings button clicked');
      showSettingsModal.value = true;
    };

    const closeSettings = () => {
      console.log('Closing settings modal');
      showSettingsModal.value = false;
    };

    const openFavorite = () => {
      console.log('Add Favorite button clicked');
      editingFavorite.value = null;
      showFavoriteModal.value = true;
    };

    const closeFavoriteModal = () => {
      console.log('Closing favorite modal');
      showFavoriteModal.value = false;
      editingFavorite.value = null;
    };

    const editFavorite = (favorite) => {
      editingFavorite.value = favorite;
      showFavoriteModal.value = true;
    };

    const connectToFavorite = async (favorite) => {
      const tabId = `Tab-${nanoid(5)}`;
      const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
      terminal.displayName = favorite.displayName;
      terminals.value.list.push(terminal);
      nextTick(async () => {
        const container = document.getElementById(`terminal-${tabId}`);
        if (container) {
          console.log(`Connecting favorite to tab ${tabId}`);
          terminal.term.open(container);
          setTimeout(() => {
            resizeTerminal(terminal.term, terminal.fitAddon);
            terminal.term.focus();
          }, 100);

          const options = {
            host: favorite.hostname,
            username: favorite.username || '',
            port: favorite.port || 22,
            password: favorite.password || '',
            keyPath: favorite.keyPath || '',
          };
          await connectSSH(tabId, terminal.term, terminal.state, options);
        } else {
          console.error(`Container for terminal-${tabId} not found`);
        }
      });
      switchTab(tabId);
    };

    return {
      terminals,
      addTab,
      switchTab,
      closeTab,
      openSettings,
      closeSettings,
      openFavorite,
      showSettingsModal,
      showFavoriteModal,
      editingFavorite,
      connectToFavorite,
      editFavorite,
      closeFavoriteModal,
    };
  },
};
</script>

<style scoped>
#terminal-container {
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  max-height: 100%;
  position: relative;
}

.xterm {
  height: 100% !important;
  width: 100% !important;
  padding: 1rem;
  box-sizing: border-box;
}

.xterm-viewport {
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  width: 100% !important;
  height: 100% !important;
  background-color: #1a1a1a;
}
</style>