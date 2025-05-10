// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://192.168.8.103:8030', // Replace with your actual base URL
  },
});
