export class AdminUsersPage {
  constructor(private customerName: string) {
    this.customerName = customerName;
  }

  impersonate() {
    cy.visit('admins/users');
    cy.get('#query').type(this.customerName);
    cy.get('input[name="commit"]').click();
    cy.get('table>tbody').find('tr').contains(this.customerName).should('exist');
    cy.contains(this.customerName)
      .siblings()
      .find('a[title="login as Mustermann"]')
      .invoke('removeAttr', 'target')
      .click();
    // returning false here prevents Cypress from failing the test
    // need to use es5 otherwise TS complains
    cy.on('uncaught:exception', (_err, _runnable) => false);
  }

  setAPItoken() {
    cy.visit(`admins/users?query=${this.customerName}`);
    cy.get('a[title="Renew API token"').click();

    cy.on('window:confirm', () => true);
    cy.get('.label-success').should('exist');
  }

  findUserEmail() {
    cy.visit(`admins/users?query=${this.customerName}`);
    cy.get('tbody').within(() => {
      cy.contains(this.customerName).parent().siblings().eq(3).invoke('text').as('userEmail');
    });
    cy.get('@userEmail').then((userEmail) => {
      return userEmail;
    });
  }
}
