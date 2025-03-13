<template>
  <div class="favorites">
    <h5 class="text-white mb-2">Favorites</h5>
    <div id="favorites-list" class="text-light-text">
      <div v-if="groupedFavorites.length === 0" class="text-gray-500">No favorites yet.</div>
      <div v-else v-for="(group, groupName) in groupedFavorites" :key="groupName" class="mb-4">
        <h6 class="cursor-pointer mb-2 text-light-text hover:text-white" @click="toggleGroup(groupName)">
          {{ groupName }}
        </h6>
        <div class="group-items" :class="{ 'hidden': !expandedGroups[groupName] }">
          <div v-for="fav in group" :key="fav.id || fav.displayName + fav.hostname" class="flex justify-between items-center p-2 hover:bg-dark-hover cursor-pointer" @dblclick="connectToFavorite(fav)">
            <span class="flex-1">
              <div>{{ fav.displayName || 'Unnamed' }}</div>
            </span>
            <span class="flex space-x-2">
              <button class="bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded" @click="editFavorite(fav)">Edit</button>
              <button class="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded" @click="removeFavorite(fav.id)">X</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

const { ipcRenderer } = window.require('electron');

export default {
  emits: ['connect', 'edit'],
  setup(props, { emit }) {
    const favorites = ref([]);
    const expandedGroups = ref({});

    const loadFavorites = async () => {
      const newFavorites = await ipcRenderer.invoke('get-favorites');
      // Check for missing or duplicate IDs
      const ids = newFavorites.map(fav => fav.id);
      const uniqueIds = new Set(ids);
      if (ids.some(id => !id)) {
        console.error('Some favorites are missing IDs:', ids);
      }
      if (ids.length !== uniqueIds.size) {
        console.error('Duplicate IDs found in favorites:', ids);
      }
      favorites.value = JSON.parse(JSON.stringify(newFavorites)); // Deep copy for reactivity
      favorites.value.forEach(fav => {
        const groupName = fav.group || 'Ungrouped';
        if (!(groupName in expandedGroups.value)) {
          expandedGroups.value[groupName] = true;
        }
      });
    };

    const groupedFavorites = computed(() => {
      const grouped = favorites.value.reduce((acc, fav) => {
        const group = fav.group || 'Ungrouped';
        if (!acc[group]) acc[group] = [];
        acc[group].push(fav);
        return acc;
      }, {});
      console.log('Grouped favorites:', grouped);
      return grouped;
    });

    const toggleGroup = (groupName) => {
      expandedGroups.value[groupName] = !expandedGroups.value[groupName];
    };

    const removeFavorite = (id) => {
      const newFavorites = favorites.value.filter(fav => fav.id !== id);
      ipcRenderer.send('save-favorites', JSON.parse(JSON.stringify(newFavorites)));
      favorites.value = newFavorites; // Update local state immediately
    };

    const connectToFavorite = (favorite) => {
      emit('connect', favorite);
    };

    const editFavorite = (favorite) => {
      emit('edit', favorite);
    };

    onMounted(() => {
      loadFavorites();
      ipcRenderer.on('favorites-updated', () => {
        loadFavorites();
      });
    });

    return {
      groupedFavorites,
      expandedGroups,
      toggleGroup,
      removeFavorite,
      connectToFavorite,
      editFavorite,
    };
  },
};
</script>

<style scoped>
.truncate {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>