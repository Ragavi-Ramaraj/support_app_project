///<reference types="cypress" />

describe('IQ_Incidents', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Filter on IQ incidents', () => {

        cy.visit('/' + 'iqs/' + supportInfo.EventsIqId + '/details')

        //Navigate to incidents page
        cy.contains('span', 'Events').click()
        cy.contains('span', 'Incidents').click()
        cy.url().should('include', '?activeTab=incidents')
        cy.get('td div').should('exist').should('be.visible')

        //Filtering with incident details
        //IQ connection restored
        cy.contains('[type="button"]', 'Filters').click()
        cy.get('h2').should('contain', 'Filters')
        cy.get('p').should('contain', 'Please select the filters that you would like to apply.')
        cy.contains('[role="button"]', 'All incident types').should('exist').click()
        cy.get('ul>li').contains('Iq connection restored').click()
        cy.get('[type="submit"]').should('be.enabled').click({ force: true })
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').find('td').each(($el) => {
            cy.get('p').should('contain', 'IQ connection')
            cy.get('td').should('contain', 'Restored')
        })
        cy.get('path').eq(5).click({ force: true })

        //Lock low battery + Lock
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All incident types').should('exist').click()
        cy.get('ul>li').contains('Low battery warning').click()
        cy.contains('[role="button"]', 'All Locks').should('exist').click()
        cy.get('[data-value="04.96.74"]').click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').find('td').each(($el) => {
            cy.get('p').should('contain', 'Lock state change')
            cy.get('td').should('contain', 'Low batteries')
        })
        cy.get('path').eq(4).click({ force: true })

        //Lock + start date + End date
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All Locks').should('exist').click()
        cy.get('[data-value="02.A2.92"]').click()
        cy.get('input[placeholder="Select start date"]').click()
        cy.get('button').find('h6').contains('2022').click()
        cy.get('div[role="button"]').contains('2020').click()
        cy.get('button').find('p').contains('1').click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').find('td').each(($el) => {
            cy.get('td').should('exist').should('contain', supportInfo.EventsRfnetLockmac)
        })

        //Add event category - Lock PPD connected to the current filterset
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All incident types').should('exist').click()
        cy.get('ul>li').contains('Lock ppd connected').click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('tbody').each(($el) => {
            cy.get('p').should('contain', 'No incidents found')
        })

        //Clear all
        cy.get('path').eq(4).click({ force: true })
        cy.get('tbody').each(($el) => {
            cy.get('p').contains('No incidents found').should('not.exist')
        })

        //Direct filter actions

        //Filter on Lock

        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All incident types').should('exist').click()
        cy.get('ul>li').contains('Door left open alarm start').click()
        cy.get('[type="submit"]').click()
        cy.get('[data-testid="closeFiltersIcon"]').click().wait(2000)

        cy.get('td button').find('svg').eq(1).should('exist').click({ force: true })
        cy.get('ul>li').contains('p', 'Filter on Lock').click({ force: true })
        cy.get('[title="Locks"]').then(($name) => {
            const lock = $name.text()
            cy.get('tbody').find('td').each(($el) => {
                cy.contains('td div', lock).should('exist')
            })
        })

        //Search
        cy.get('[placeholder="Search"]').click().type(supportInfo.EventsRfnetLockNameSearch)
        cy.get('td').should('contain', supportInfo.EventsLockName)
        cy.get('[placeholder="Search"]').click()
        cy.get('[title="Clear"]').click()
        cy.get('td div').should('exist').should('be.visible')

        //Sort events
        cy.contains('h4', 'Incident').click()
        cy.wait(3000)
        cy.get('td p').should('exist')
        cy.Sort('ascend')
        cy.contains('h4', 'Incident').click()
        cy.wait(3000)
        cy.get('td p').should('exist')
        cy.Sort('descend')

        //Verify the sorted order
        cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
            expect(supportInfo.ascend).to.not.equal(supportInfo.descend)
        })
    })

    it('Incidents filterset actions', () => {

        //Navigate to entries tab
        cy.visit('/collections/' + supportInfo.EventsCollectionId + '/hardware?page=1')
        cy.contains('span', 'Events').click()
        cy.contains('span', 'Incidents').click()
        cy.url().should('include', '?activeTab=incidents')

        //Create new filterset
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('[role="button"]', 'All incident types').should('exist').click()
        cy.get('ul>li').contains('Tamper alarm started').click()
        cy.contains('[role="button"]', 'All Locks').should('exist').click()
        cy.get('[data-value="02.A2.92"]').click()
        cy.contains('button', 'Create new').should('exist').click()
        cy.get('[name="name"]').click().type('Filter A')
        cy.contains('[type="submit"]', 'Save filter set').should('be.enabled').click()
        cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Filter A')
        cy.get('[type="submit"]').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('td').should('contain', 'Tamper alarm')
            .should('contain', 'Start')
            .should('contain', 'WR 08')
            .should('contain', '06.CC.24')

        //Reset filterset
        cy.contains('[type="button"]', 'Filters').click()
        cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Filter A')
        cy.contains('button', 'Reset filter').should('be.enabled').click()
        cy.get('[id="mui-component-select-filterSetSelect"]').should('not.contain', 'Filter A')

        //Rename filterset
        cy.get('[id="mui-component-select-filterSetSelect"]').click()
        cy.contains('[role="option"]', 'Filter A').should('exist').click()
        cy.contains('button', 'Rename filter set').should('be.enabled').click()
        cy.get('[name="name"]').click().clear().type('Incidents filterset')
        cy.contains('[type="submit"]', 'Save filter set').should('be.enabled').click()
        cy.get('[id="mui-component-select-filterSetSelect"]').should('contain', 'Incidents filterset')

        //Update filterset
        cy.get('#mui-component-select-incidentsCategory').click()
        cy.get('ul>li').contains('Intrusion alarm started').click()
        cy.get('#mui-component-select-lockMac').click()
        cy.get('[data-value="04.96.74"]').click()
        cy.contains('[type="button"]', 'Update current').click()
        cy.get('[type="submit"]').click()
        cy.get('[data-testid="closeFiltersIcon"]').click()
        cy.get('td').should('contain', 'Intrusion alarm')
            .should('contain', 'Start')
            .should('contain', 'Lock with Priv functionality')
            .should('contain', '06.CC.24')

        //Remove filterset
        cy.contains('[type="button"]', 'Filters').click()
        cy.contains('button', 'Remove filter set').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Remove from saved').should('exist')
        cy.contains('[type="submit"]', 'Yes, remove').click()
        cy.get('[id="mui-component-select-filterSetSelect"]').click()
        cy.get('[role="option"]').should('not.contain', 'Incidents filterset')
    })
})
