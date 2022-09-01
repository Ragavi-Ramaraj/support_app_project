///<reference types="cypress" />

describe('IQ_Actions', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Restart, Reload & Refresh IQ', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Restart IQ
        cy.contains('[type="button"]', 'Restart IQ').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ restarted successfully')
        cy.log("The IQ is restarting, setting wait time for 2 minutes")
        cy.wait(120000)
        cy.Get_Iq_Details()

        //Reload IQ details
        cy.contains('[type="button"]', 'Reload IQ details').should('be.enabled').click()

        //Refresh IQ data
        cy.contains('[type="button"]', 'Refresh IQ data').should('be.enabled').click()
        cy.get('#client-snackbar', { timeout: 80000 }).should('exist').should('have.text', 'IQ refreshed successfully')
    })

    it('Refresh lock firmware', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Refresh locks firmware
        cy.contains('[type="button"]', 'Refresh locks firmware').should('be.enabled').click()
        cy.get('#GenericModalTitle').contains('Refresh locks firmware').should('exist')
        cy.get('#ModalButton').contains('Yes, refresh firmware').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Successfully sent the request to refresh the firmware information for the locks attached to the "' + supportInfo.IqName + '"')

    })

    it('Sync Digital key', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Sync Digital Key
        cy.contains('[type="button"]', 'Sync Digital Key').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Digital Key synced successfully')

    })


    it('Set LED colour', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Set LED
        cy.contains('[type="button"]', 'Set LED').should('be.enabled').click()
        cy.get('#GenericModalTitle').contains('Set LED').should('exist')
        cy.get('[placeholder="Select the LED pattern"]').click().type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').contains('Save').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'The selected LED pattern successfully applied.')

    })

    it('Decouple IQ', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Decouple IQ
        cy.contains('[type="button"]', 'Decouple IQ').should('be.disabled')

    })

    it('Upgarde bootloader & firmware to specific version', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Schedule update
        cy.contains('button', 'Schedule update').click()
        cy.contains('#GenericModalTitle', 'Schedule update').should('exist')

        //Bootloader
        //Schedule update to Specific version
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(4)).type('{enter}')
        cy.contains('button', 'Verify update').click()
        cy.get('#GenericModalFeedback').should('contain', 'A bootloader update is available.')
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.BootloaderVersion1)

        //Update scheduled for as soon as possible
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ bootloader update to ' + supportInfo.BootloaderVersion1 + ' scheduled for as soon as possible.')
        
        //Filter the scheduled update
        cy.get('td p').should('exist')
        cy.contains('[role="button"]', 'Status').click()
        cy.get('[data-value="not_started"]').click()
        cy.get('td p').should('contain', 'Scheduled')
        cy.get('td button').find('span').should('exist').click()

        //Cancel the scheduled update from updates page
        cy.contains('ul>li', 'Cancel update').click()
        cy.contains('#GenericModalTitle', 'Cancel scheduled update').should('exist')
        cy.contains('#confirm', 'Yes, cancel update').click()
        cy.contains('Details').click()
        cy.contains('button', 'Schedule update').click()

        //Firmware
        //Schedule update to Specific version
        cy.get('[placeholder="Select an update type"]').click().wait(3000).type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().wait(3000).type('{downArrow}'.repeat(4)).type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(5)).type('{enter}')
        cy.contains('button', 'Verify update').click()
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.FirmwareVersion1)
        cy.get('[placeholder="Select when to update"]').click().wait(3000).type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ firmware update to 21.0.3-ACCEPT.20220124.447bbf96 scheduled for midnight (customer).')

        //Filter the scheduled update
        cy.get('td p').should('exist')
        cy.contains('[role="button"]', 'Status').click()
        cy.get('[data-value="not_started"]').click()
        cy.get('td p').should('exist').should('contain', 'Scheduled')
        cy.get('td').find('p').should('contain', 'Firmware')
        cy.get('td').find('p').should('contain', supportInfo.FirmwareVersion1)
        cy.get('td button').find('span').should('exist').click()

        //Cancel update
        cy.contains('ul>li', 'Cancel update').click()
        cy.contains('#GenericModalTitle', 'Cancel scheduled update').should('exist')
        cy.contains('#confirm', 'Yes, cancel update').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'The selected scheduled update was cancelled')

    })

    it('Update validation for IQ with wifi module and RFnet module validation to below 20.x version', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Schedule update
        cy.contains('button', 'Schedule update').click()
        cy.contains('#GenericModalTitle', 'Schedule update').should('exist')

        //Choose firmware version to below 21
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(4)).type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}').type('{enter}')
        cy.contains('button', 'Verify update').click()

        //Check error message
        cy.get('p').should('contain', 'Validation failed: IQ (ID: "136bd072-b97d-11eb-b9e0-000d3a46a880") does not have an RF Net module and cannot be downgraded below version "21.x.x", IQ (ID: "136bd072-b97d-11eb-b9e0-000d3a46a880") has an USB WiFi dongle and cannot be downgraded below version "21.x.x"')
    })

    it('Downgrade bootloader to specific version', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Schedule update
        cy.contains('button', 'Schedule update').click()
        cy.contains('#GenericModalTitle', 'Schedule update').should('exist')

        //Downgrade the bootloader update
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(5)).type('{enter}')
        cy.contains('button', 'Verify update').click()

        //Check message
        cy.get('p').should('contain', 'A bootloader update is available.')

    })

})
