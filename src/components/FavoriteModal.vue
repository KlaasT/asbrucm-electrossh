<template>
  <div id="favoriteModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center" :class="{ 'hidden': !isVisible }">
    <div class="bg-dark p-6 rounded-lg shadow-lg w-full max-w-md text-light-text">
      <h5 id="favoriteModalLabel" class="text-white mb-4">{{ editingFavorite ? 'Edit Favorite' : 'Add Favorite' }}</h5>
      <div class="mb-4">
        <label class="block mb-2">Display Name</label>
        <input type="text" v-model="favorite.displayName" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Favorite Name" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Host</label>
        <input type="text" v-model="favorite.hostname" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Host" required />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Username</label>
        <input type="text" v-model="favorite.username" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Username" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Password (optional)</label>
        <input type="password" v-model="favorite.password" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Password" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Port (optional)</label>
        <input type="number" v-model="favorite.port" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="22" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">SSH Key Path (optional)</label>
        <div class="flex items-center space-x-2">
          <input type="text" v-model="favorite.keyPath" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Path to SSH key" />
          <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" @click="selectSshKey">Select Key</button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-2">Group (optional)</label>
        <input type="text" v-model="favorite.group" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Ungrouped" />
      </div>
      <div class="flex justify-end space-x-2">
        <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" :disabled="!favorite.hostname" @click="saveFavorite">Save</button>
        <button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { nanoid } from 'nanoid';

const { ipcRenderer } = window.require('electron');

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    editingFavorite: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const favorite = ref({
      id: nanoid(5),
      displayName: '',
      hostname: '',
      username: '',
      password: '',
      port: 22,
      keyPath: '',
      group: '',
    });

    watch(() => props.editingFavorite, (newFavorite) => {
      console.log('Editing favorite received:', newFavorite);
      if (newFavorite) {
        favorite.value = {
          ...newFavorite,
          id: newFavorite.id || nanoid(5), // Assign new ID if missing
          hostname: newFavorite.hostname || newFavorite.host || '',
          password: newFavorite.password || '',
          keyPath: newFavorite.keyPath || '',
          group: newFavorite.group || '',
        };
        console.log('Form initialized with:', favorite.value);
      } else {
        favorite.value = {
          id: nanoid(5),
          displayName: '',
          hostname: '',
          username: '',
          password: '',
          port: 22,
          keyPath: '',
          group: '',
        };
      }
    }, { immediate: true });

    const selectSshKey = async () => {
      const keyPath = await ipcRenderer.invoke('select-ssh-key');
      if (keyPath) {
        favorite.value.keyPath = keyPath;
      }
    };

    const saveFavorite = async () => {
      if (!favorite.value.hostname) {
        console.error('Hostname is required');
        return;
      }
      const favorites = await ipcRenderer.invoke('get-favorites');
      if (props.editingFavorite) {
        const index = favorites.findIndex(fav => fav.id === favorite.value.id);
        if (index !== -1) {
          favorites[index] = {...favorite.value, port: parseInt(favorite.value.port) || 22};
          delete favorites[index].host;
        } else {
          favorites.push({...favorite.value, port: parseInt(favorite.value.port) || 22});
          console.log('Added as new favorite due to missing ID:', favorite.value);
        }
      } else {
        favorites.push({...favorite.value, port: parseInt(favorite.value.port) || 22});
      }
      ipcRenderer.send('save-favorites', JSON.parse(JSON.stringify(favorites)));
      setTimeout(() => {
        ipcRenderer.send('favorites-updated');
      }, 500);
      emit('close');
    };

    return {
      favorite,
      saveFavorite,
      selectSshKey,
    };
  },
};
</script>