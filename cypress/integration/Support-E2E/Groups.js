///<reference types="cypress" />

describe('Groups', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Create,Edit & Remove groups', () => {

        cy.visit('/')

        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'Groups').click()
        cy.url().should('include', '/groups')

        //Create IQ group
        cy.contains('button', 'Create group').should('exist').click()
        cy.get('[data-cy="generic-modal-header"]').should('exist')
        cy.get('input[name="name"]').click().type('Au')
        cy.get('[type="submit"]').should('be.disabled')
        cy.get('input[name="name"]').click().type('tomation group')
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist')

        //Add IQ to group
        cy.contains('button', 'Add/Remove IQs to Group').click()
        cy.get('[data-testid="list-item-checkbox"]').should('exist')
        cy.get('[placeholder="Search for IQ name, mac or ID"]').should('exist').click().type(supportInfo.IqMac)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', 1)
            .should('contain', supportInfo.IqName).click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', "1 IQ has been added to 'Automation group'")

        //Remove IQ from group
        cy.get('td a').should('exist')
        cy.contains('button', 'Add/Remove IQs to Group').click()
        cy.get('[placeholder="Search for IQ name, mac or ID"]').should('exist').click().type(supportInfo.IqMac)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', 1)
            .should('contain', supportInfo.IqName).click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', " 1 IQ has been removed from 'Automation group'")

        //Rename group
        cy.contains('button', 'Rename group').click()
        cy.get('input[name="name"]').click().type(' - Test')
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', "The group has been renamed to 'Automation group - Test'")

        //Add IQ to group
        cy.contains('button', 'Add/Remove IQs to Group').click()
        cy.get('[data-testid="list-item-checkbox"]').should('exist')
        cy.get('[placeholder="Search for IQ name, mac or ID"]').should('exist').click().type(supportInfo.IqMac)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', 1)
            .should('contain', supportInfo.IqName).click()
        cy.get('[type="submit"]').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist')

        //Delete IQ from group
        cy.get('td a').should('exist').should('contain', supportInfo.IqName)
        cy.get('td').find('input[type="checkbox"]').click()
        cy.contains('button', 'Delete 1 IQ from group').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Selected IQs have been removed.')

        //Delete group
        cy.contains('button', 'Delete group').click()
        cy.get('[data-cy="generic-modal-header"]').should('exist')
        cy.contains('[type="submit"]', 'Yes, remove group').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist')

    })

    it('Schedule update for group', () => {

        cy.visit('/' + 'groups')

        //Search group
        cy.get('[placeholder="Search a group name"]').click().type(supportInfo.IqMac)
        cy.get('[data-testid="expandable-text-wrapper"]').should('have.length', 1).should('include.text', supportInfo.IqMac).click({ force: true })

        //Schedule Update
        cy.contains('button', 'Schedule update').click()

        //Bootloader//
        //Schedule update to Specific version
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(4)).type('{enter}')
        cy.get('#ModalButton').click()
        //Update scheduled for midnight
        cy.get('#GenericModalFeedback').should('contain', '1 IQ can be updated')
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.BootloaderVersion1)
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', '1 IQ bootloader update to ' + supportInfo.BootloaderVersion1 + ' scheduled for midnight (customer).')
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

        //Firmware//
        //Schedule update to Specific version
        cy.get('[placeholder="Select the IQ type"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(2)).type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(3000).type('{downArrow}'.repeat(5)).type('{enter}')
        cy.get('#ModalButton').click()
        //Update scheduled for midnight
        cy.get('#GenericModalFeedback').should('contain', '1 IQ can be updated')
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.FirmwareVersion1)
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', '1 IQ firmware update to ' + supportInfo.FirmwareVersion1 + ' scheduled for midnight (customer).')
        //Cancel all not started updates
        cy.contains('button', 'Cancel all not started').click()
        cy.get('#GenericModalTitle').should('exist')
        cy.contains('button', 'Yes, cancel update').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'All not started updates have successfully been canceled.')
        cy.contains('[role="button"]', 'Status').click()
        cy.get('[data-value="not_started"]').click()
        cy.get('td').should('contain', 'No updates found')
        cy.contains('span', 'Details').click()

        //Delete IQ from group
        cy.get('td a').should('exist').should('contain', supportInfo.IqName)
        cy.get('td').find('input[type="checkbox"]').click()
        cy.contains('button', 'Delete 1 IQ from group').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Selected IQs have been removed.')
    })
})
