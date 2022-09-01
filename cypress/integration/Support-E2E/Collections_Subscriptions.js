///<reference types="cypress" />

describe('Collections_Subscriptions', () => {

  let supportInfo

  beforeEach(() => {
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Collections subscriptions validations', () => {

    //Navigate to subscriptions page
    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')
    cy.contains('span', 'Subscriptions').click()
    cy.url().should('include', '/subscriptions')

    //Create a manual subscription
    cy.dataTestId('expandable-text-wrapper').should('contain', 'Active')
    cy.contains('button', 'Create manual subscription').should('exist').click()
    cy.contains('#GenericModalTitle', 'Subscription details').should('exist')
    cy.get('[placeholder="Number of users"]').click().type(supportInfo.SubscriptionUsers)
    cy.contains('span', 'Unlimited IQs').click()
    cy.get('[placeholder="End date"]').click()
    cy.get('button').find('h6').contains('2022').click()
    cy.get('div[role="button"]').contains('2024').type('{enter}')
    cy.contains('button', 'Next').click()
    cy.contains('p', 'Long subscription warning').should('exist')
    cy.contains('#ModalButton', 'Create').click({ force: true })
    cy.get('#client-snackbar').should('exist').should('have.text', 'Subscription successfully created')
    cy.dataTestId('expandable-text-wrapper').should('contain', 'Active')
  })
})
