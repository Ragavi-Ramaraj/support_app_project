///<reference types="cypress" />

describe('IQ', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.Get_Iq_Overview()
        cy.login()
    })

    it('Valid & Invalid IQ search', () => {

        cy.visit('/')

        //Navigate to IQs page
        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'IQs').click()
        cy.get('td p').should('be.visible')

        //Search with valid IQ
        cy.get('[placeholder="Search mac address, customer reference"]').should('exist').click().type(supportInfo.IqMac)
        cy.get('td a').should('contain', supportInfo.IqName)
        cy.get('td span').should('contain', supportInfo.IqMac)
        cy.get('td span').should('contain', supportInfo.IqStatus)
        cy.get('Strong').should('contain', supportInfo.CollectionName)
        cy.get('td span').should('contain', supportInfo.IqRfChannel)
        cy.get('td span').should('contain', supportInfo.RTO)
        cy.get('td span').should('contain', supportInfo.OA)
        cy.get('td span').should('contain', supportInfo.LE)

        //Expand the IQ tree and verify the lock data
        cy.get('td').eq(1).find('svg').click()
        cy.get('td p').should('contain', supportInfo.LockName)
        cy.get('td strong').should('contain', supportInfo.LockMac)
        cy.get('td div').should('contain', supportInfo.IqName)

        //Navigate inside searched collection page
        cy.get('td').eq(2).find('p').should('contain', supportInfo.IqName).click()
        cy.url().should('include', 'iqs/' + supportInfo.IqId + '/details')
        cy.get('h2').should('contain', 'IQ ' + supportInfo.IqMac + ' (IQ)')
        cy.get('span').should('contain', 'Details')
            .should('contain', 'RF channels')
            .should('contain', 'Updates')
            .should('contain', 'Events')

        cy.go('back')

        //Search with invalid IQ
        cy.get('[placeholder="Search mac address, customer reference"]').click().clear().type(supportInfo.UnknownIq)
        cy.get('tbody').should('contain', 'No IQs found')

        //Clear
        cy.get('[placeholder="Search mac address, customer reference"]').click().clear()
        cy.get('tbody>tr').should('have.length', 20)

    })

    it('IQ table Filtering', () => {

        cy.visit('/' + 'iqs')

        cy.get('td a').should('be.visible')

        //Online IQ's
        cy.contains('[role="button"]', 'All').click()
        cy.contains('ul>li', 'Online').click()
        cy.get('tbody>tr').should('contain', 'Online').should('have.length', 20)

        //Offline IQ's
        cy.contains('[role="button"]', 'Online').click()
        cy.contains('ul>li', 'Offline').click()
        cy.get('tbody>tr').should('contain', 'Offline').should('have.length', 20)

        //All IQ's
        cy.contains('[role="button"]', 'Offline').click()
        cy.contains('ul>li', 'All').click()
        cy.get('tbody>tr').should('have.length', 20)

    })

    it('Verify IQ table pagination links', () => {

        cy.visit('/' + 'iqs')

        //Pagination
        cy.get('ul>li').find('button[aria-label="Go to page 2"]').click()
        cy.get('td a').should('exist')
        cy.get('ul>li').find('button[aria-label="Go to page 3"]').click()
        cy.get('td a').should('exist')
        cy.get('ul>li').find('button[aria-label="Go to page 1"]').click()
        cy.get('td a').should('exist')

    })

    it('Add IQ to group', () => {

        cy.visit('/' + 'iqs')

        cy.get('td a').should('be.visible')
        //Open group screen
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('contain', 'You can add these IQ’s to Group.')
            .should('contain', 'Groups are used for scheduling updates for IQs.')
        //Close group screen
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('not.contain', 'You can add these IQ’s to Group.')
            .should('not.contain', 'Groups are used for scheduling updates for IQs.')
        //Open group screen again
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('contain', 'You can add these IQ’s to Group.')
            .should('contain', 'Groups are used for scheduling updates for IQs.')
        cy.get('[placeholder="Search groups"]').type('Automation group')
        cy.get('ul>li[data-testid="list-item-checkbox"]').contains('Automation group').click()
        cy.contains('button', 'Add to selected groups').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQs successfully added.')

    })

    it('Sort IQ', () => {

        cy.visit('/' + 'iqs')

        //Sort
        cy.contains('h4', 'Device name').click().wait(1000)
        cy.get('td a').should('exist')
        cy.Sort('ascend')
        cy.contains('h4', 'Device name').click().wait(1000)
        cy.get('td a').should('exist')
        cy.Sort('descend')

        //Verify the sorted order
        cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
            expect(supportInfo.ascend).to.not.equal(supportInfo.descend)
        })

    })
})
