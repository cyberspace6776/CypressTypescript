export type FeatureFlagType = 'powerbi' | 'supplier_invite';

export class AdminCustomersPage {
  constructor(private customerName: string) {
    this.customerName = customerName;
  }

  createClient() {
    cy.visit('admins/customers/new');
    cy.get('#customer_name').type(this.customerName);
    cy.get('input[name="commit"]').click();

    cy.contains('Customer created.').should('exist');

    // get master token to use api
    cy.get('#customer_api_token')
      .invoke('val')
      .then((masterToken) => {
        cy.task('setMasterToken', masterToken);
      });
    cy.url().then((url) => {
      const customerId = url.split('/')[5];
      cy.task('setCustomerId', customerId);
    });
  }

  static addFeatureFlag(featureName: FeatureFlagType) {
    cy.task('getCustomerId').then((customerId) => {
      cy.visit(`admins/customers/${customerId}/security`);
      cy.get('input[name="feature_setting_name"').type(featureName);
      cy.get('input[value="Add"]').click();
    });
  }
}
