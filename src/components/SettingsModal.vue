<template>
  <div id="settingsModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center" :class="{ 'hidden': !isVisible }">
    <div class="bg-dark p-6 rounded-lg shadow-lg w-full max-w-md text-light-text">
      <h5 class="text-white mb-4">Settings</h5>
      <div class="mb-4">
        <label class="flex items-center">
          <input type="checkbox" v-model="useSshKey" class="mr-2" />
          <span>Use SSH Key</span>
        </label>
      </div>
      <div v-if="useSshKey" class="mb-4">
        <label class="block mb-2">SSH Key Path</label>
        <div class="flex items-center space-x-2">
          <input type="text" v-model="sshKeyPath" class="bg-gray-700 text-white p-2 rounded w-full" readonly />
          <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" @click="selectSshKey">Select Key</button>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded" @click="saveSettings">Save</button>
        <button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

const { ipcRenderer } = window.require('electron');

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const useSshKey = ref(false);
    const sshKeyPath = ref('');

    const loadSettings = async () => {
      const settings = await ipcRenderer.invoke('get-settings');
      useSshKey.value = settings.useSshKey;
      sshKeyPath.value = settings.sshKeyPath;
    };

    const selectSshKey = async () => {
      const keyPath = await ipcRenderer.invoke('select-ssh-key');
      if (keyPath) {
        sshKeyPath.value = keyPath;
      }
    };

    const saveSettings = () => {
      ipcRenderer.send('save-settings', { useSshKey: useSshKey.value, sshKeyPath: sshKeyPath.value });
      emit('close');
    };

    onMounted(() => {
      loadSettings();
    });

    return {
      useSshKey,
      sshKeyPath,
      selectSshKey,
      saveSettings,
    };
  },
};
</script>