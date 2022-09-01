///<reference types="cypress" />

describe('Tag analysis', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Check tag collections', () => {

        cy.visit('/')

        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'Tag analysis').click()
        cy.url().should('include', '/tag-analysis')

        //Check tag collections
        cy.get('[placeholder="Tag number"]').click().type(supportInfo.TagNumber)
        cy.get('[type="submit"]').should('be.enabled').click()

        cy.url().should('include', '/tag-analysis/' + supportInfo.TagNumber + '/sites')

        cy.get('tr').should('have.length', '21')

        cy.get('td').eq(0).click()
        cy.url().should('include', '/collections/')

    })

    it('Unassign masterkey from single & all collections', () => {

        cy.visit('/' + 'tag-analysis')

        //Check tag collections
        cy.get('[placeholder="Tag number"]').click().type(supportInfo.TagNumber)
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('tr').should('exist')

        //Unassign masterkey from single collection
        cy.get('[data-cy="sites-action-menu-button"]').eq(1).click({ force: true })
        cy.get('[data-cy="unassign-masterkey-action-menu-item"]').should('not.be.disabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Master Key has been unassigned successfully.')

        //Unassign masterkey from all collections
        cy.get('[data-cy="unassing-from-all-master-key"]').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Unassign from Master Key everywhere')
        cy.get('[data-cy="modal-unconfirm-button"]').should('exist').should('be.enabled')
        cy.get('[data-cy="modal-confirm-button"]').should('exist').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Master Key has been unassigned successfully.')

        //Wait time until the unassign finishes
        cy.wait(50000)
        cy.contains('tr', supportInfo.MasterkeyTagSite).find('[data-cy="sites-action-menu-button"]').should('exist').click({force:true})
        
        //Check if unassign button is disabled
        cy.get('[data-cy="unassign-masterkey-action-menu-item"]').should('not.be.enabled')

    })


    it('Tag entries', () => {

        cy.visit('/' + 'tag-analysis')

        //Check tag collections
        cy.get('[placeholder="Tag number"]').click().type(supportInfo.TagNumber)
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('tr').should('exist')

        //Tag events entries
        cy.contains('tr', supportInfo.MasterkeyTagSite).find('[data-cy="sites-action-menu-button"]').click({ force: true })
        cy.contains('[role="menuitem"]', 'Tag events').should('not.be.disabled').click()
        cy.url().should('include', '/tag-analysis/' + supportInfo.TagNumber + '/entries?siteId=')
        cy.get('tr').its('length').should('be.gte', 1)
        cy.get('tr').should('contain', supportInfo.MasterkeyTagLock)

        //Filtering start and end date
        cy.get('[name="startDate"]').click()
        cy.get('button').find('h6').contains('2022').click()
        cy.get('div[role="button"]').contains('2017').type('{enter}')
        cy.get('[name="endDate"]').click()
        cy.get('div[role="presentation"]').last().type('{enter}')
        cy.get('tr').its('length').should('be.gte', 1)
        cy.get('tr').should('contain', supportInfo.MasterkeyTagLock)

        cy.get('[name="endDate"]').click()
        cy.get('button').find('h6').contains('2022').click()
        cy.get('div[role="button"]').contains('2017').type('{enter}')

        cy.get('td').should('contain', 'No entries found')

        cy.contains('span', 'View site details').should('exist').click()
        cy.url().should('include', supportInfo.MasterkeyTagOriginSiteId)
        cy.go('back')

    })
})