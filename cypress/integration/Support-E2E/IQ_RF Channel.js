///<reference types="cypress" />

describe('IQ_RF Channel', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Change RF channel with optimal option', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Navigate to Rf channel page
        cy.contains('span', 'RF channels').click()
        cy.url().should('include', '/rf-channels')
        cy.get('td div').should('exist').should('be.visible')

        //Verify the current active RF data
        cy.get('h4').should('contain', 'RF channel ' + supportInfo.NewIqRfChannel + ' is active.')

        //Change to optimal
        cy.contains('button', 'Change RF channel').click()
        cy.get('#GenericModalTitle').should('contain', 'Do you have your maintenance card?')
        cy.get('p').should('contain', 'When you change the RF channel of ' + supportInfo.IqName + ', all the attached RFNet locks and repeaters will be disconnected until you present your maintenance card to reconnect.')
        cy.get('button').contains('Continue').click()
        cy.get('#GenericModalTitle').should('contain', 'Change RF channel')
        cy.get('ul>li').contains('RF channel 11').click()
        cy.get('ul>li').contains('RF channel 12').click()

        //Deselect
        cy.contains('span', 'Deselect all (2)').click()
        cy.get('#ModalButton').should('be.disabled')

        //Select channels again
        cy.get('ul>li').contains('RF channel 11').click()
        cy.get('ul>li').contains('RF channel 12').click()
        cy.get('ul>li').contains('RF channel 13').click()
        cy.get('button').contains('Change to most optimal').click()
        cy.get('#ModalButton').contains('Confirm').click()

        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ RF channel successfully updated')

        //Wait for the new RF channel to be updated in the database
        cy.wait(1000)
        //Get the new optimal RF data from RF channel history
        cy.Get_Rf_Data_History()
        cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
            cy.get('h4').should('contain', 'RF channel ' + supportInfo.NewIqRfChannel + ' is active.')
            cy.get('tbody tr').eq(0).find('td').eq(1).should('exist').should('contain', supportInfo.NewIqRfChannel)
            cy.get('tbody tr').eq(0).find('td').eq(2).should('exist').should('contain', supportInfo.OldIqRfChannel)
        })
    })

    it('Choose single RF channel and update', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Navigate to RF channel page
        cy.contains('span', 'RF channels').click()
        cy.url().should('include', '/rf-channels')
        cy.get('td div').should('exist').should('be.visible')

        //Change with one RF channel selection
        cy.contains('button', 'Change RF channel').click()
        cy.get('button').contains('Continue').click()
        cy.get('ul>li').contains('RF channel 14').click()
        cy.get('button').contains('Change to RF channel 14').click()
        cy.get('#ModalButton').contains('Confirm').click()

        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ RF channel successfully updated')

        //Wait for the new RF channel to be updated in the database
        cy.wait(1000)
        //Get the new RF data from RF channel history
        cy.Get_Rf_Data_History()
        cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
            cy.get('h4').should('contain', 'RF channel ' + supportInfo.NewIqRfChannel + ' is active.')
            cy.get('tbody tr').eq(0).find('td').eq(1).should('exist').should('contain', supportInfo.NewIqRfChannel)
            cy.get('tbody tr').eq(0).find('td').eq(2).should('exist').should('contain', supportInfo.OldIqRfChannel)
        })
    })
})