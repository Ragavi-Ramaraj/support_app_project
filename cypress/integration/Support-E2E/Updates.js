///<reference types="cypress" />

describe('Updates', () => {

  let supportInfo

  beforeEach(() => {
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Filter with all update statuses', () => {

    cy.visit('/')

    cy.contains('span', 'Menu').click()
    cy.contains('h2', 'Updates').click()

    //Filter on Updates
    //Succeeded
    cy.contains('[role="button"]', 'Status').click()
    cy.get('[data-value="succeeded"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Succeeded')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Failed
    cy.contains('[role="button"]', 'Succeeded').click()
    cy.get('[data-value="failed"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Failed')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Cancelled
    cy.contains('[role="button"]', 'Failed').click()
    cy.get('[data-value="cancelled"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Cancelled')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Downloading
    cy.contains('[role="button"]', 'Cancelled').click()
    cy.get('[data-value="downloading"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Downloading')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Memory Issues
    cy.contains('[role="button"]', 'Downloading').click()
    cy.get('[data-value="memory_issues"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Memory issues')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Preparing
    cy.contains('[role="button"]', 'Memory issues').click()
    cy.get('[data-value="preparing"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Preparing')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Installing
    cy.contains('[role="button"]', 'Preparing').click()
    cy.get('[data-value="installing"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Installing')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Cannot update
    cy.contains('[role="button"]', 'Installing').click()
    cy.get('[data-value="cannot_update"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('td')
      .then(($td) => {
        if ($td.text().includes('Cannot update')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })
  })
})