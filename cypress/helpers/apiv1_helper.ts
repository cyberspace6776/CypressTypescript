import { Buffer } from 'buffer';

function getUserTokenByAPI() {
  cy.task<string>('getMasterToken').then((masterToken: string) => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_V1_URL')}tokens`,
      headers: {
        Authorization: `Basic ${Buffer.from(masterToken).toString('base64')}`,
      },
    })
      .then((resp) => {
        expect(resp.status).to.eq(200);
        return resp.body.users[0].token;
      })
      .as('userToken');
  });
}

export default function apiCreateSupplier(
  supplierName: string,
  address: string,
  city: string,
  zipCode: string,
  countryCode: string,
) {
  getUserTokenByAPI();
  cy.get<string>('@userToken').then((userToken) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_V1_URL')}suppliers`,
      headers: {
        Authorization: `Basic ${Buffer.from(userToken).toString('base64')}`,
      },
      body: {
        supplier: {
          name: supplierName,
          address: {
            address1: address,
            city,
            zip_code: zipCode,
            country_code: countryCode,
          },
        },
      },
    })
      .its('status')
      .should('eq', 201);
  });
}
