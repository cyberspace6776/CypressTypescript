export {};
declare global {
  namespace Cypress {
    interface Chainable {
      /** alternative way to organize custom commands
       * to login user for testing provide username and password
       * @example cy.visit('admins').login('email', 'password')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.contains('Please sign in').should('exist');

  cy.get('#user_email').type(email);
  cy.get('#user_password').type(password);
  cy.get('button').click();
});
