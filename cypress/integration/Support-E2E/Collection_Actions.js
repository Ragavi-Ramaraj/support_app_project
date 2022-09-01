///<reference types="cypress" />

describe('Collection_Actions', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Enable & Sync Digital key', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Enable Digital key
        cy.contains('button', 'Enable Digital Key').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Digital Key successfully enabled.')

        //Sync Digital key
        cy.contains('button', 'Sync Digital Key').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Digital Key successfully synced.')

    })

    it('Sync tenant certificate & LAM', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Sync tenant certificate
        cy.contains('button', 'Sync tenant certificate').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Tenant certificate successfully synced.')

        //Sync LAM
        cy.contains('button', 'Sync LAM').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'LAM successfully synced.')

    })

    it('Mastermind', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Mastermind
        cy.contains('button', 'Mastermind').should('be.disabled')
        cy.get('div').find("[title='This collection\\'s tenant does not have integration with Mastermind.']").should('exist')

    })

    it('Export hardware list', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Export hardware list
        cy.contains('button', 'Export hardware list').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Hardware successfully exported.')

    })

    it('Lock settings', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Lock settings
        cy.contains('button', 'Set locks settings').should('be.enabled').click()
        cy.get('#GenericModalTitle').should('have.text', 'Set parameters for all locks in this collection')
        cy.get('#openTime').click()
        cy.get('[data-value="2"]').click()
        cy.get('#offlineAccessByAuditTrailDayAmount').click()
        cy.get('[data-value="3"]').click()
        cy.get('#responseTimeout').click()
        cy.get('[data-value="8"]').click()
        cy.get('#wallReaderNearOpening').click()
        cy.get('[data-value="true"]').click()
        cy.get('#ModalButton').click()
        cy.get('button').contains('Apply to all locks').click()
        cy.get('#client-snackbar', { timeout: 80000 }).should('exist').should('have.text', 'Locks settings applied successfully.')

    })

    it('Upgrade to align & Upgrade to specific version', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Schedule update
        cy.contains('button', 'Schedule update').should('be.enabled').click()
        cy.get('#GenericModalTitle').should('have.text', 'Schedule update')

        //Bootloader
        //Upgrade to Align
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#GenericModalFeedback').should('contain', 'All the IQs are up-to-date.')
        cy.get('#GenericModalBackButton').click()

        ////Firmware////
        //Schedule update to Specific version
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(5)).type('{enter}')
        cy.get('form').within(($form) => {
            cy.get('div').contains('span', 'Important for firmware updates')
            cy.get('ol>li').should('contain', 'Updates can not skip major versions.')
                .should('contain', 'i.e. 9.x.x <=> 10.x.x <=> 20.x.x.')
                .should('contain', '20.x.x builds require bootloader version "ceef1b8fbdb1863a6610167eec650a65c9f1a42c" or newer.')
                .should('contain', 'Bootloader version “ceef1b8fbdb1863a6610167eec650a65c9f1a42c” or newer can be applied on IQs with version v10.1.4 or higher.”')
                .should('contain', 'Bootloader version cannot be downgraded.')
                .should('contain', '20.x.x can only rollback to 10.5.x.')
                .should('contain', 'IQs can not be downgraded to version v10.4.33 or lower.')
        })
        cy.get('#ModalButton').click()
        cy.get('#GenericModalFeedback').should('contain', '1 IQ can be updated')
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.FirmwareVersion1)
        //Update scheduled for midnight
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', '1 IQ firmware update to ' + supportInfo.FirmwareVersion1 + ' scheduled for midnight (customer).')
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
        cy.contains('Hardware').click()
        cy.contains('button', 'Schedule update').click()

        //Upgrade to Align
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(3)).type('{enter}')
        cy.get('form').within(($form) => {
            cy.get('div').contains('span', 'About upgrade to align')
            cy.get('p').should('contain', 'When you upgrade to align, the system will set the highest version of all the available IQs as the target version for the others.')
            cy.get('#ModalButton').click()
            cy.get('#GenericModalFeedback').should('contain', 'All the IQs are up-to-date.')
            cy.get('[type=button]').contains('View').click()
            cy.get('div').should('contain', '0B.7E.2B')
        })
        cy.get('#GenericModalBackButton').click()
        cy.get('#GenericModalBackButton').click()


        ////Node Firmware////
        //Schedule update to Specific version
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(3)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#GenericModalFeedback').should('contain', '1 IQ can be updated')
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.NodefirmwareVersion1)
        //Update scheduled for custome date
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}'.repeat(3)).type('{enter}')
        cy.get('input[name="date"]').click()
        cy.get('button').find('h6').contains('2022').click()
        cy.get('div[role="button"]').contains('2024').click()
        cy.get('button').find('p').contains('24').click()
        cy.get('div[role="menu"]').click()
        cy.get('div[role="menu"]').click()
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist')
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
        cy.contains('Hardware').click()
        cy.contains('button', 'Schedule update').click()

        //Upgrade to Align
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(3)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#GenericModalFeedback').should('contain', 'All the IQs are up-to-date.')
        cy.get('#ModalButton').click()
    })

    it('Unassign Masterkey', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Unassign masterkey in collections page
        cy.get('[data-cy="unassign-tag-masterkey"]').should('exist').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Unassign tag from Master Key').should('exist')
        cy.get('[data-cy="modal-unconfirm-button"]').should('exist').should('be.enabled')
        cy.get('[data-cy="modal-confirm-button"]').should('contain', 'Yes, unassign').should('exist').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Master Key has been unassigned successfully.')

    })
})
