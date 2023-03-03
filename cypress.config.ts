import { defineConfig } from 'cypress';

let masterToken: string;
let customerId: string;
let userEmail: string;

export default defineConfig({
  viewportHeight: 900,
  viewportWidth: 1440,
  watchForFileChanges: false,
  video: true,
  hideXHRInCommandLog: false,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        setMasterToken: (val) => {
          masterToken = val;
          return masterToken;
        },
        getMasterToken: () => masterToken,

        setCustomerId: (val) => {
          customerId = val;
          return customerId;
        },
        getCustomerId: () => customerId,

        setUserEmail: (val) => {
          userEmail = val;
          return userEmail;
        },
        getUserEmail: () => userEmail,
      });
    },
    baseUrl: '',
    env: {
      API_V1_URL: '',
    },
  },
});
