import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';

const app = createApp(App);

// Initialize head management
const head = createHead();
app.use(head);

app.mount('#app');