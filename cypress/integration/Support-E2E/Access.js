///<reference types="cypress" />

describe('Access', () => {

  let supportInfo

  beforeEach(() => {
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Tag with access', () => {

    cy.visit('/')

    cy.contains('span', 'Menu').click()
    cy.contains('h2', 'Access').click()
    cy.url().should('include', '/access')

    //Tag with access
    cy.get('[placeholder="Tag number"]').click().type(supportInfo.CateTag)
    cy.get('[placeholder="MAC or ID number"]').click().type(supportInfo.LockMac)
    cy.get('[type="submit"]').contains('Check').click()
    cy.get('p').should('contain', 'Access is provided.')
    cy.contains('a', 'Go to the IQ event page to analyze the events.').click()
    cy.url().should('include', '/events')

  })

  it('Tag without access', () => {

    //Navigate to access page
    cy.visit('/'+ 'access')

    //Tag without access
    cy.get('[placeholder="Tag number"]').click().type(supportInfo.CateTag)
    cy.get('[placeholder="MAC or ID number"]').click().type(supportInfo.EventsRfnetLockmac)
    cy.get('[type="submit"]').contains('Check').click()
    cy.get('p').should('contain', 'Access is not provided.')
  })

  it('Invalid Tag format', () => {

    //Navigate to access page
    cy.visit('/'+ 'access')

    //Tag without access
    cy.get('[placeholder="Tag number"]').click().type(supportInfo.InvalidTag)
    cy.get('[placeholder="MAC or ID number"]').click().type(supportInfo.LockMac)
    cy.get('[type="submit"]').contains('Check').click()
    cy.get('p').should('contain', 'Validation failed: Tag number format is invalid')
  })

})
