/// <reference types="cypress" />
// ***********************************************
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      //       login(email: string, password: string): Chainable<void>;
      //       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      authenticate(): Chainable<void>;
    }
  }
}
interface TypeOptions extends Cypress.TypeOptions {
  sensitive: boolean;
}

Cypress.Commands.overwrite<'type', 'element'>('type', (originalFn, element, text, options?: Partial<TypeOptions>) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false;
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    });
  }
  return originalFn(element, text, options);
});

Cypress.Commands.add('authenticate', () => {
  // No need to log in, if we're already logged in.
  if (Cypress.$('#user_email').length) {
    cy.get('#user_email').type(Cypress.env('AUTH_USERNAME'));
    cy.get('#user_password').type(Cypress.env('AUTH_PASSWORD'), { sensitive: true });
    cy.get('button').click();
  }
});
