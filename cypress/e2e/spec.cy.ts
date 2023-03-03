import { AdminSubscriptionPage } from '../pages/admin_area/adminSubscriptionPage';
import { AdminCustomersPage } from '../pages/admin_area/adminCustomerPage';
import { AdminUsersPage } from '../pages/admin_area/adminUsersPage';
import apiCreateSupplier from '../helpers/apiv1_helper';
import { faker } from '@faker-js/faker/locale/pl';

describe('typescript poc', () => {
  it('tests part of e2e flow using typescript', () => {
    const randomNumber = `${Cypress._.random(0, 1e10)}`;
    const riskmethodsCustomer = `Autobot Customer_${randomNumber}`;
    const supplier1 = `Supplier1 for ${randomNumber}`;
    const adminCustomersPage = new AdminCustomersPage(riskmethodsCustomer);
    const subscriptionPage = new AdminSubscriptionPage(riskmethodsCustomer);
    const usersPage = new AdminUsersPage(riskmethodsCustomer);

    // checking quality of faker data here
    // faker.locale = 'pl';
    const supplierData = {
      address: faker.address.street(),
      city: faker.address.city(),
      zipCode: faker.address.zipCode(),
    };
    cy.log(supplierData.address, supplierData.city, supplierData.zipCode);

    cy.visit('admins').authenticate();
    adminCustomersPage.createClient();
    //use of static method here
    AdminCustomersPage.addFeatureFlag('powerbi');

    usersPage.setAPItoken();
    apiCreateSupplier(supplier1, supplierData.address, supplierData.city, supplierData.zipCode, 'pl');

    subscriptionPage.addSubscription('EcoVadis ©');
    subscriptionPage.activateSubscription('EcoVadis');
  });

  it('tests login command using wrong credentials', () => {
    cy.visit('admins').login(faker.internet.email(), faker.internet.password());
    cy.contains('Invalid credentials ').should('exist');
  });
});
