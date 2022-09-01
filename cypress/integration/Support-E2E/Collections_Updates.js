///<reference types="cypress" />

describe('Collections_Updates', () => {

  let supportInfo

  beforeEach(() => {
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Filtering with all update statuses', () => {

    //Navigate to updates page
    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')
    cy.contains('span', 'Updates').click()
    cy.url().should('include', '/updates')

    //Filter with different update status
    //Succeeded
    cy.contains('[role="button"]', 'Status').should('exist').click()
    cy.get('[data-value="succeeded"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Succeeded')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Succeeded')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Failed
    cy.contains('[role="button"]', 'Succeeded').should('exist').click()
    cy.get('[data-value="failed"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Failed')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Failed')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Cancelled
    cy.contains('[role="button"]', 'Failed').should('exist').click()
    cy.get('[data-value="cancelled"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Cancelled')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Cancelled')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Downloading
    cy.contains('[role="button"]', 'Cancelled').should('exist').click()
    cy.get('[data-value="downloading"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Downloading')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Downloading')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Memory Issues
    cy.contains('[role="button"]', 'Downloading').should('exist').click()
    cy.get('[data-value="memory_issues"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Memory issues')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Memory issues')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Preparing
    cy.contains('[role="button"]', 'Memory issues').should('exist').click()
    cy.get('[data-value="preparing"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Preparing')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Preparing')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Installing
    cy.contains('[role="button"]', 'Preparing').should('exist').click()
    cy.get('[data-value="installing"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Installing')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Installing')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })

    //Cannot update
    cy.contains('[role="button"]', 'Installing').should('exist').click()
    cy.get('[data-value="cannot_update"]').click()
    cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
    cy.get('tbody td')
      .then(($td) => {
        if ($td.text().includes('Cannot update')) {
          cy.get('tbody').find('tr').each(($el) => {
            cy.get('td').find('p').should('exist').should('contain', 'Cannot update')
            cy.get('td').find('a').should('have.attr', 'href').and("contain", '/iqs')
            cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
          })
        }
        else {
          cy.get('td').should('contain', 'No updates found')
        }
      })
  })

  it('Schedule update', () => {

    //Navigate to updates page
    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')
    cy.contains('span', 'Updates').click()
    cy.url().should('include', '/updates')

    //Schedule update
    cy.contains('button', 'Schedule update').click()
    cy.contains('#GenericModalTitle', 'Schedule update').should('exist')
    cy.get('[placeholder="Select the IQ type"]').click()
    cy.contains('[role="option"]', 'IQ 2').click()
    cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
    cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
    cy.get('[placeholder="Select the specific version"]').click().wait(10000).type('{downArrow}'.repeat(5)).type('{enter}')
    cy.contains('button', 'Verify update').click()
    cy.get('div').contains('span', 'Target version')
    cy.get('p').should('contain', supportInfo.FirmwareVersion1)
    cy.get('[placeholder="Select when to update"]').click().type('{downArrow}').type('{enter}')
    cy.get('#ModalButton').click()
    cy.get('#client-snackbar').should('exist').should('have.text', '1 IQ firmware update to ' + supportInfo.FirmwareVersion1 + ' scheduled for midnight (customer).')

    //Filter the scheduled update
    cy.contains('[role="button"]', 'Status').click()
    cy.get('[data-value="not_started"]').click()
    cy.get('p').should('contain', 'Scheduled')
    cy.get('td').find('a').should('contain', supportInfo.IqMac)

    //Cancel update
    cy.contains('button', 'Cancel all not started').click()
    cy.get('#GenericModalTitle').should('exist')
    cy.contains('button', 'Yes, cancel update').click()
    cy.get('#client-snackbar').should('exist').should('have.text', 'All not started updates have successfully been canceled.')

  })
})
