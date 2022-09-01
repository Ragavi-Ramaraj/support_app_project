///<reference types="cypress" />

describe('Collections_Entries', () => {

  let supportInfo

  beforeEach(() => {
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Filter on collections entries', () => {

    //Navigate to entries tab
    cy.visit('/collections/' + supportInfo.EventsCollectionId + '/hardware?page=1')
    cy.contains('span', 'Events').click()
    cy.url().should('include', '/events')

    //Filtering with event details
    //Office mode started
    cy.contains('[type="button"]', 'Filters').click()
    cy.contains('h2', 'Filters').should('exist')
    cy.contains('[role="button"]', 'All entry types').should('exist').click()
    cy.get('ul>li').contains('Office mode started').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click()
    cy.get('tbody').find('td').each(($el) => {
      cy.get('p').should('contain', 'Office mode')
        .should('contain', 'Start')
    })
    cy.get('path').eq(5).click({ force: true })

    //Access granted + IQ + Lock + Start date + End date
    cy.contains('[type="button"]', 'Filters').click()
    cy.contains('[role="button"]', 'All entry types').should('exist').click()
    cy.get('ul>li').contains('Access granted').click()
    cy.contains('[role="button"]', 'All access types').should('exist').click()
    cy.get('[data-value="tag"]').click()
    cy.contains('[role="button"]', 'All IQs').should('exist').click()
    cy.get('[data-value="06.CC.24"]').click()
    cy.contains('[role="button"]', 'All Locks').should('exist').click()
    cy.get('[data-value="01CF6D0100005D"]').click()
    cy.get('input[placeholder="Select start date"]').click()
    cy.get('button').find('h6').contains('2022').click()
    cy.get('div[role="button"]').contains('2020').click()
    cy.get('button').find('p').contains('1').click()
    cy.wait(1000)
    cy.get('input[placeholder="Select end date"]').click()
    cy.get('button').find('h6').contains('2022').click()
    cy.get('div[role="button"]').contains('2021').click()
    cy.get('button').find('p').contains('25').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click()
    cy.get('tbody').each(($el) => {
      cy.get('p').should('contain', 'No entries found')
    })

    //Clear all filters
    cy.get('path').eq(4).click({ force: true })

    //Access rejected offline + Access by - Digital key
    cy.contains('[type="button"]', 'Filters').click()
    cy.contains('[role="button"]', 'All entry types').should('exist').click()
    cy.get('ul>li').contains('Access rejected offline').click()
    cy.contains('[role="button"]', 'All access types').should('exist').click()
    cy.get('[data-value="mobile_key"]').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click()
    cy.get('tbody').find('td').each(($el) => {
      cy.get('p').should('contain', 'Access rejected')
        .should('contain', 'Offline')
      cy.get('td').should('contain', 'Digital Key')
    })
    cy.get('path').eq(4).click({ force: true })

    //Direct filter actions

    //Filter on IQ

    cy.contains('[type="button"]', 'Filters').click()
    cy.contains('[role="button"]', 'All entry types').should('exist').click()
    cy.get('ul>li').contains('Access granted').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click().wait(2000)
    cy.contains('h4', 'Date & time').click().click()
    cy.url().should('include','sortBy=local_date_time&sortDirection=desc')

    cy.get('td button').find('svg').eq(1).should('exist').click({ force: true })
    cy.get('ul>li').contains('p', 'Filter on IQ').click({ force: true }).wait(2000)
    cy.get('[title="IQs"]').then(($name) => {
      const iq = $name.text()
      cy.get('tbody').find('td').each(($el) => {
        cy.get('td a').should('include.text', iq).should('exist')
      })
    })

    //Filter on Lock

    cy.get('td button').find('svg').eq(1).should('exist').click({ force: true })
    cy.get('ul>li').contains('p', 'Filter on Lock').click({ force: true }).wait(2000)
    cy.get('[title="Locks"]').then(($name) => {
      const lock = $name.text()
      cy.get('tbody').find('td').each(($el) => {
        cy.get('td div').should('include.text', lock).should('exist')
      })
    })

    //Tag Analysis
    cy.contains('[type="button"]', 'Filters').should('exist').click({ force: true })
    cy.contains('[role="button"]', 'All access types').should('exist').click()
    cy.get('[data-value="tag"]').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click().wait(2000)
    cy.get('tbody').find('td').each(($el) => {
      cy.get('td').should('include.text', 'Tag ' + supportInfo.EventsTag).should('be.visible')
    })
    cy.get('td').find('svg').eq(1).should('exist').click({ force: true })
    cy.get('ul>li').contains('a', 'Tag analysis').click({ force: true })
    cy.url().should('include', '/tag-analysis')

    cy.go('back')

    //Tag has access to lock
    cy.get('td button').find('svg').eq(1).should('exist').click({ force: true })
    cy.get('ul>li').contains('a', 'Verify tag access').click({ force: true })
    cy.url().should('include', '/access')

    cy.go('back')

    //Clear all filters
    cy.get('td').should('exist')
    cy.get('path').eq(4).click({ force: true })

    //Search with IQ mac
    cy.get('[placeholder="Search"]').click().type(supportInfo.EventsIqMacSearch)
    cy.get('td').should('contain', supportInfo.EventsIqMac)
    cy.get('[placeholder="Search"]').click()
    cy.get('[title="Clear"]').click()

    //Seach with Lock mac
    cy.get('[placeholder="Search"]').click().type(supportInfo.EventsRfnetLockMacSearch)
    cy.get('td').should('contain', supportInfo.EventsRfnetLockmac)
    cy.get('[placeholder="Search"]').click()
    cy.get('[title="Clear"]').click()

    //Search with IQ name
    cy.get('[placeholder="Search"]').click().type(supportInfo.EventsIqNameSearch)
    cy.get('td').should('contain', supportInfo.EventsIqName)
    cy.get('[placeholder="Search"]').click()
    cy.get('[title="Clear"]').click()

    //Search with Lock name
    cy.get('[placeholder="Search"]').click().type(supportInfo.EventsRfnetLockNameSearch)
    cy.get('td').should('contain', supportInfo.EventsLockName)
    cy.get('[placeholder="Search"]').click()
    cy.get('[title="Clear"]').click()

    //Search with unknown data
    cy.get('[placeholder="Search"]').click().type(supportInfo.UnknownName)
    cy.get('p').should('contain', 'No entries found')
    cy.get('[placeholder="Search"]').click()
    cy.get('[title="Clear"]').click()

    //Sort entries
    cy.contains('h4', 'Event').click()
    cy.wait(3000)
    cy.get('td p').should('exist')
    cy.Sort('ascend')
    cy.contains('h4', 'Event').click()
    cy.wait(3000)
    cy.get('td p').should('exist')
    cy.Sort('descend')

    //Verify the sorted order
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
      expect(supportInfo.ascend).to.not.equal(supportInfo.descend)
    })


  })

  it('Entries filterset actions', () => {

    //Navigate to entries tab
    cy.visit('/collections/' + supportInfo.EventsCollectionId + '/hardware?page=1')
    cy.contains('span', 'Events').click()
    cy.url().should('include', '/events')

    //Create new filterset
    cy.contains('[type="button"]', 'Filters').click()
    cy.get('#mui-component-select-entriesCategory').click()
    cy.get('ul>li').contains('Easy office mode started').click()
    cy.get('#mui-component-select-accessType').click()
    cy.get('[data-value="tag"]').click()
    cy.contains('[role="button"]', 'All IQs').should('exist').click()
    cy.get('[data-value="06.CC.24"]').click()
    cy.contains('[role="button"]', 'All Locks').should('exist').click()
    cy.get('[data-value="04.96.74"]').click()
    cy.contains('button', 'Create new').should('exist').click()
    cy.get('[name="name"]').click().type('Filter A')
    cy.contains('[type="submit"]', 'Save filter set').should('be.enabled').click()
    cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Filter A')
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click()
    cy.get('td').should('contain', 'Easy office mode')
      .should('contain', 'Start')
      .should('contain', 'Lock with Priv functionality')
      .should('contain', '06.CC.24')
      .should('include.text', 'Tag ')

    //Reset filterset
    cy.contains('[type="button"]', 'Filters').click()
    cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Filter A')
    cy.contains('button', 'Reset filter').should('be.enabled').click()
    cy.get('[id="mui-component-select-filterSetSelect"]').should('not.contain', 'Filter A')

    //Rename filterset
    cy.get('[id="mui-component-select-filterSetSelect"]').click()
    cy.contains('[role="option"]', 'Filter A').should('exist').click()
    cy.contains('button', 'Rename filter set').should('be.enabled').click()
    cy.get('[name="name"]').click().clear().type('Entries filterset')
    cy.contains('[type="submit"]', 'Save filter set').should('be.enabled').click()
    cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Entries filterset')

    //Update filterset
    cy.get('#mui-component-select-entriesCategory').click()
    cy.get('ul>li').contains('Access rejected suspended').click()
    cy.get('#mui-component-select-accessType').click()
    cy.get('[data-value="mobile_key"]').click()
    cy.get('#mui-component-select-iqMac').should('be.visible').click({ force: true })
    cy.contains('[role="option"]', 'All IQs').click()
    cy.get('#mui-component-select-lockMac').click()
    cy.contains('[role="option"]', 'All Locks').click()
    cy.contains('[type="button"]', 'Update current').click()
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="closeFiltersIcon"]').click()
    cy.get('td').should('contain', 'Access rejected')
      .should('contain', 'Suspended')
      .should('contain', 'Digital Key')

    //Remove filterset
    cy.contains('[type="button"]', 'Filters').click()
    cy.contains('button', 'Remove filter set').should('be.enabled').click()
    cy.get('[data-cy="generic-modal-title"]').should('contain', 'Remove from saved').should('exist')
    cy.contains('[type="submit"]', 'Yes, remove').click()
    cy.get('[id="mui-component-select-filterSetSelect"]').click()
    cy.get('[role="option"]').should('not.contain', 'Entries filterset')
  })
})

