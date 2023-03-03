export type DataSourceType =
  | 'BitSight'
  | 'D&B supplier risk assessment ©'
  | 'EcoVadis ©'
  | 'Bureau van Dijk © (v2)'
  | 'Creditsafe © (v2)'
  | 'Open Exchange Rates'
  | 'MunichRE NATHAN ©'
  | 'riskmethods Country Risks';

export class AdminSubscriptionPage {
  constructor(private customerName: string) {
    this.customerName = customerName;
  }

  private selectValueFromDropdown(dropdownName: string, selectValue: string) {
    const downArrowSelector = '.select2-selection__arrow';

    cy.get(`.${dropdownName}`).find(downArrowSelector).click();
    cy.get(`input[aria-controls$="${dropdownName}-results"]`).type(selectValue);
    cy.get(`ul#select2-${dropdownName}-results > li`).contains(selectValue).first().click();
    return this;
  }

  private selectSubscriptionOwner(dataSource: string) {
    const customerSelector = 'subscription_customer_id';
    const dataSourceSelector = 'subscription_data_source_id';

    this.selectValueFromDropdown(customerSelector, this.customerName);
    this.selectValueFromDropdown(dataSourceSelector, dataSource);

    cy.get('#data_source_indicators table tr').should('have.length.greaterThan', 0);
  }

  private fillCredentials(dataSource: DataSourceType) {
    switch (dataSource) {
      case 'BitSight':
        this.fillBitSightCredentials();
        break;
      case 'D&B supplier risk assessment ©':
        this.fillDnBsraCredentials();
        break;
      case 'EcoVadis ©':
        this.fillEcovadisCredentials();
        break;
      case 'Bureau van Dijk © (v2)':
        this.fillBvDCredentials();
        break;
      case 'Creditsafe © (v2)':
        this.fillCreditsafeCredentials();
        break;
      case 'riskmethods Country Risks':
        // Do nothing
        break;
      case 'Open Exchange Rates':
        // Do nothing
        break;
      case 'MunichRE NATHAN ©':
        break;
      default:
        throw new Error(`Unknown data source "${dataSource}"`);
    }
  }

  private fillBitSightCredentials() {
    cy.get('input[name="subscription[credentials][token]"]').type(Cypress.env('BITSIGHT_TOKEN'));
    return this;
  }

  private fillDnBsraCredentials() {
    cy.get('#subscription_credentials_key').type(Cypress.env('DNB_API_KEY'));
    cy.get('#subscription_credentials_secret').type(Cypress.env('DNB_API_SECRET'));
    cy.get('input[name="subscription[additional_info][registration_reference]"]').type('RiskMethods_CMPSRA');
    return this;
  }

  private fillCreditsafeCredentials() {
    cy.get('input[name="subscription[credentials][user]"]').type(Cypress.env('CREDITSAFE_USER'));
    cy.get('input[name="subscription[credentials][password]"]').type(Cypress.env('CREDITSAFE_PASSWORD'));
    cy.get('input[name="subscription[additional_info][portfolio_id]"]').should('have.class', 'readonly');
    return this;
  }

  private fillBvDCredentials() {
    cy.get('#subscription_expires_at').type('31.12.2050{Enter}');
    cy.get('#subscription_credit_count_limit').type('1');

    cy.get('input[id="subscription_credentials_token"]').type(Cypress.env('BVD_V2_RESELLER_TOKEN'));
    cy.get('input[name="subscription[additional_info][pdf_login]"]').type(Cypress.env('BVD_PDF_USERNAME'));
    cy.get('input[name="subscription[additional_info][pdf_password]"]').type(Cypress.env('BVD_PDF_PASSWORD'));
    cy.get('input[name="subscription[additional_info][report_book_name]"').type('riskmethods');
    return this;
  }

  private fillEcovadisCredentials() {
    cy.get('#subscription_credentials_user').type(Cypress.env('ECOVADIS_USERNAME'));
    cy.get('#subscription_credentials_password').type(Cypress.env('ECOVADIS_PASSWORD'));
    return this;
  }

  addSubscription(dataSource: DataSourceType, { credentials = true } = {}) {
    cy.visit('/admins/subscriptions/new');
    this.selectSubscriptionOwner(dataSource);
    if (credentials) {
      this.fillCredentials(dataSource);
    }
    cy.get('input[name="commit"]').click();

    cy.contains('Subscription successfully created').should('exist');
  }

  activateSubscription(dataSource: string, { initialFetch = true, credentials = true } = {}) {
    cy.visit(`admins/subscriptions?query=${this.customerName}`);

    cy.get('tbody tr td:nth-child(5)')
      .filter(`td:contains(${dataSource})`)
      .siblings()
      .find('a[title="Activate"]')
      .click();
    // Should existing risk objects be populated? initialFetch = true for yes || false for no
    cy.on('window:confirm', () => initialFetch);

    if (credentials) {
      cy.get('.active > td > .badge-success > .icon-thumbs-up').should('exist');
    } else {
      cy.contains('Credentials are missing').should('exist');
    }
  }
}
