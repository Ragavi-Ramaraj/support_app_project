///<reference types="cypress" />

describe('IQ_details', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.Get_Iq_Connections()
        cy.Get_Iq_Versions()
        cy.login()
    })

    it('IQ Status validation', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Iqname
        cy.get('h2').should('contain', 'IQ ' + supportInfo.IqMac + ' (' + supportInfo.IqName + ')')

        //IQ status
        cy.get('p').should('contain', 'Online')

        //IQ sync state
        cy.get('p').should('contain', 'Synced')

        //IQ subscription state
        cy.get('p').should('contain', 'Active')

        //Sitename
        cy.get('a').should('contain', supportInfo.CollectionName)
        cy.get('div').find('a').contains(supportInfo.CollectionName).should('have.attr', 'href').then((href) => {
            cy.visit(href)
        })

        cy.url().should('include', supportInfo.CollectionId + '/hardware')

        cy.go('back')
    })

    it('IQ Connection details validation', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Check wifi mac address is displayed
        cy.get('p[title="MAC Address"]').should('contain', supportInfo.EthernetMac)
        //Check Ethernet mac address is displayed
        cy.get('p[title="MAC Address"]').should('contain', supportInfo.WifiMac)
        //Check M2M data is displayed
        cy.get('p').should('contain', ': ' + supportInfo.M2M_ICCID)

        //CCC
        cy.get('p').should('contain', supportInfo.CCC)

        //IQ versions
        cy.get('p').should('contain', supportInfo.IqFirmwareVersion)
        cy.get('p').should('contain', supportInfo.IqBootloaderVersion)
        cy.get('p').should('contain', supportInfo.IqNodeFirmwareversion)

    })

    it('IQ RF channel change', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //RF channel
        cy.get('div').should('contain', supportInfo.IqRfChannel)
        cy.contains('button', 'Change').should('exist').click()

        //Change with one RF channel selection
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
            cy.get('div').should('contain', supportInfo.NewIqRfChannel)
        })
    })



})
