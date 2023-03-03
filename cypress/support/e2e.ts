// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './loginCommands';
import 'cypress-wait-until';

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions {
      hideXHRInCommandLog?: boolean;
    }
    interface TypeOptions {
      sensitive: boolean;
    }
  }
}
if (Cypress.config('hideXHRInCommandLog')) {
  const app = window.top;

  if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');

    app.document.head.appendChild(style);
  }
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
