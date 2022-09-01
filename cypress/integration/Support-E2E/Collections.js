///<reference types="cypress" />

describe('Collections', () => {

  let supportInfo

  beforeEach(() => {
    cy.Get_Iq_Details()
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Collections table search', () => {
  
    cy.visit('/')
    //Check if the collections page contains correct number of data in table
    cy.dataTestId('expandable-text-wrapper').should('have.length', 20)

    //Collections search
    cy.get('[placeholder="Search a collection name or site ID').type(supportInfo.CollectionName)
    cy.dataTestId('expandable-text-wrapper').should('have.length', 1)
    cy.get('td').should('contain', supportInfo.CollectionName)
                .should('contain', supportInfo.CollectionCountryName)

    //Navigate inside searched collection page
    cy.get('td').eq(0).should('contain', supportInfo.CollectionName).click()
    cy.url().should('include', supportInfo.CollectionId+'/hardware?page=1')
    cy.get('h2').should('contain', supportInfo.CollectionName)
    cy.get('span').should('contain', 'Hardware')
               .should('contain', 'Events')
               .should('contain', 'Updates')
               .should('contain', 'Subscriptions')
    
    cy.go('back')

    //Search unknown collection
    cy.get('[placeholder="Search a collection name or site ID').clear().type(supportInfo.UnknownCollection)
    cy.get('tr').should('contain','No collections found').should('exist')

    //Search with partial name having more results
    cy.get('[placeholder="Search a collection name or site ID').clear().type(supportInfo.KnownCollection)
    cy.dataTestId('expandable-text-wrapper').should('have.length', 20)

  })

  it('Verify collections table pagination links', () => {

    cy.visit('/')

    //Check the pagination links
    cy.get('ul>li').find('button[aria-label="Go to page 2"]').click()
    cy.dataTestId('expandable-text-wrapper').should('have.length', 20)
    cy.get('ul>li').find('button[aria-label="Go to page 1"]').click()
    cy.dataTestId('expandable-text-wrapper').should('have.length', 20)

  })

  it('Sort collections', () => {

    cy.visit('/')

    cy.get('tbody td').should('exist').should('be.visible')

    //Sort ascending
    cy.get('th').contains('h4','Collection').click().wait(3000)
    cy.url().should('include','?sortBy=customerReference&sortDirection=desc')
    cy.dataTestId('expandable-text-wrapper').should('exist')
    cy.Sort('descend')
    //Sort descending
    cy.get('th').contains('h4','Collection').click().wait(3000)
    cy.url().should('include','?sortBy=customerReference&sortDirection=asc')
    cy.dataTestId('expandable-text-wrapper').should('exist')
    cy.Sort('ascend')

    //Verify the sorted order
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
      expect(supportInfo.ascend).to.not.equal(supportInfo.descend)
    })

  })
})
