///<reference types="cypress" />

describe('IQ_Entries', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Filter on IQ entries', () => {

        cy.visit('/' + 'iqs/' + supportInfo.EventsIqId + '/details')

        //Navigate to entries page
        cy.contains('span', 'Events').click()
        cy.url().should('include', '/events')
        cy.get('td div').should('exist').should('be.visible')

        //Filtering with event details
        //Easy office mode started
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('h2', 'Filters').should('exist')
        cy.contains('[role="button"]', 'All entry types').should('exist').click()
        cy.get('ul>li').contains('Office mode started').click()
        cy.get('[type="submit"]').should('be.enabled').click()
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
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').each(($el) => {
            cy.get('p').should('contain', 'No entries found')
        })

        //Clear all
        cy.get('path').eq(4).click({ force: true })

        //Access rejected + Access by - Digital key
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All entry types').should('exist').click()
        cy.get('ul>li').contains('Access rejected low batteries').click()
        cy.contains('[role="button"]', 'All access types').should('exist').click()
        cy.get('[data-value="tag"]').click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').find('td').each(($el) => {
            cy.get('p').should('contain', 'Access rejected')
                .should('contain', 'Low batteries')
            cy.get('td').should('contain', 'Tag 00021736')
        })
        cy.get('path').eq(4).click({ force: true })

        //Direct filter actions

        //Filter on Lock
        
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All entry types').should('exist').click()
        cy.get('ul>li').contains('Access granted').click()
        cy.get('[type="submit"]').click()
        cy.get('[data-testid="closeFiltersIcon"]').click().wait(2000)
        cy.contains('h4', 'Date & time').click().click()
        cy.url().should('include','sortBy=local_date_time&sortDirection=desc')

        cy.get('td button').find('svg').eq(1).should('exist').click({ force: true })
        cy.get('ul>li').contains('p', 'Filter on Lock').click({ force: true })
        cy.get('[title="Locks"]').then(($name) => {
            const lock = $name.text()
            cy.get('tbody').find('td').each(($el) => {
                cy.contains('td div', lock).should('exist')
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

        //Clear all
        cy.get('td').should('exist')
        cy.get('path').eq(4).click({ force: true })

        //Seach with Lock mac
        cy.get('[placeholder="Search"]').click().type(supportInfo.EventsBlunetLockmac)
        cy.get('td div').should('contain', supportInfo.EventsBlunetLockmac)
        cy.get('[placeholder="Search"]').click()
        cy.get('[title="Clear"]').click()

        //Search with Lock name
        cy.get('[placeholder="Search"]').click().type(supportInfo.EventsBlunetLockNameSearch)
        cy.get('td div').should('contain', supportInfo.EventsBlunetLockmac)
        cy.get('[placeholder="Search"]').click()
        cy.get('[title="Clear"]').click()

        //Search with unknown data
        cy.get('[placeholder="Search"]').click().type(supportInfo.UnknownName)
        cy.get('td p').should('contain', 'No entries found')
        cy.get('[placeholder="Search"]').click()
        cy.get('[title="Clear"]').click()
        cy.get('td div').should('exist').should('be.visible')

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
