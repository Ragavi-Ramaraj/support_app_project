///<reference types="cypress" />

describe('IQ_Hardware tree data check and Lock actions', () => {

    let supportInfo

    beforeEach(() => {
        cy.Get_Rf_Data()
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('IQ hardware table data check', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Verify hardware tree data
        cy.get('tbody>tr').should('contain', supportInfo.IqName)
        cy.get('tbody>tr').should('contain', supportInfo.IqMac)
        cy.get('tbody>tr').should('contain', supportInfo.LockName)
        cy.get('tbody>tr').should('contain', supportInfo.LockMac)
        cy.get('td>span').should('contain', supportInfo.IqStatus)
        cy.get('td>p').should('contain', supportInfo.ConnectedTo)
        cy.get('td').should('contain', supportInfo.NewIqRfChannel)
        cy.get('[title="The first number is last 24 hours, the second number is last 7 days. The last 24 hours is included in the last 7 days."]').should('have.length', 7)
    })

    it('Lock settings', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Lock settings
        cy.get('td button').find('span').click()
        cy.contains('li', 'Lock settings').should('exist').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Set lock parameters')
        cy.wait(1000)
        cy.get('div').find('#mui-component-select-openTime').click()
        cy.get('[data-value="4"]').click()
        cy.get('#mui-component-select-offlineMode').click()
        cy.get('[data-value="7"]').click()
        cy.get('#mui-component-select-responseTimeout').click()
        cy.get('[data-value="8"]').click()
        cy.get('#ModalButton').contains('Submit').click()
        cy.get('#client-snackbar', { timeout: 80000 }).should('exist').should('have.text', 'Lock settings applied successfully.')

    })

    it('Lock the Lock', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Lock the lock
        cy.get('td button').find('span').click()
        cy.contains('li', 'Lock now').should('exist').click()
        cy.get('#GenericModalTitle').contains('Lock now: ' + supportInfo.LockName).should('exist')
        cy.get('#ModalButton').contains('Lock').click()
        cy.get('#client-snackbar').should('exist').should('have.text', supportInfo.LockName + ' is successfully locked')

    })

    it('Verify Tag access', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Check lock + tag access
        cy.get('td button').find('span').click()
        cy.contains('li', 'Check access').should('exist').click()
        cy.url().should('include', '/access?lock=' + supportInfo.LockMac)
        cy.get('[placeholder="Tag number"]').click().type(supportInfo.CateTag)
        cy.get('[type="submit"]').contains('Check').click()
        cy.get('p').should('contain', 'Access is provided.')
        cy.contains('a', 'Go to the IQ event page to analyze the events.').click()
        cy.url().should('include', '/events')

        cy.go('back')
        cy.go('back')
        cy.go('back')

        cy.url().should('contain', 'iqs/' + supportInfo.IqId + '/details')

    })

    it('Refresh lock firmware', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Refresh locks firmware
        cy.get('tbody>tr').should('contain', supportInfo.LockName).should('be.visible')
        cy.get('td button').find('span').should('exist').click()
        cy.contains('li', 'Refresh lock firmware').should('exist').click()
        cy.get('#GenericModalTitle').contains('Refresh locks firmware').should('exist')
        cy.get('#ModalButton').contains('Yes, refresh firmware').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Successfully sent the request to refresh the lock "' + supportInfo.LockName + '" firmware information.')
    })
})
