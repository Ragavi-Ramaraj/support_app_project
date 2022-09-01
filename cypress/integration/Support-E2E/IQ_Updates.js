///<reference types="cypress" />

describe('IQ_Updates', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Filtering with all update statuses and update type', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Navigate to Rf channel page
        cy.contains('span', 'Updates').click()
        cy.url().should('include', '/updates')
        cy.get('td p').should('exist').should('be.visible')

        //Filter with different update status and update type
        //Succeeded + Firmware
        cy.contains('[role="button"]', 'Status').should('exist').click()
        cy.contains('[role="option"]', 'Succeeded').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.contains('[role="button"]', 'Type').should('exist').click()
        cy.contains('[role="option"]', 'Firmware').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Succeeded')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Succeeded')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
                        cy.get('td').find('p').should('exist').should('contain', 'Firmware')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })



        //Failed + Bootloader
        cy.contains('[role="button"]', 'Succeeded').should('exist').click()
        cy.contains('[role="option"]', 'Failed').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.contains('[role="button"]', 'Firmware').should('exist').click()
        cy.contains('[role="option"]', 'Bootloader').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Failed')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Failed')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
                        cy.get('td').find('p').should('exist').should('contain', 'Bootloader')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Cancelled + Lock firmware
        cy.contains('[role="button"]', 'Failed').click()
        cy.contains('[role="option"]', 'Cancelled').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.contains('[role="button"]', 'Bootloader').click()
        cy.contains('[role="option"]', 'Lock firmware').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Cancelled')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Cancelled')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
                        cy.get('td').find('p').should('exist').should('contain', 'Lock firmware')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Cancelled + Node firmware
        cy.contains('[role="button"]', 'Lock firmware').click()
        cy.contains('[role="option"]', 'Node firmware').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Node firmware')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Cancelled')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')
                        cy.get('td').find('p').should('exist').should('contain', 'Node firmware')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Downloading
        cy.contains('[role="button"]', 'Cancelled').click()
        cy.contains('[role="option"]', 'Downloading').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.contains('[role="button"]', 'Node firmware').click()
        cy.contains('[role="option"]', 'Type').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Downloading')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Downloading')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Memory Issues
        cy.contains('[role="button"]', 'Downloading').click()
        cy.contains('[role="option"]', 'Memory issues').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Memory issues')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Memory issues')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Preparing
        cy.contains('[role="button"]', 'Memory issues').click()
        cy.contains('[role="option"]', 'Preparing').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Preparing')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Preparing')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Installing
        cy.contains('[role="button"]', 'Preparing').click()
        cy.contains('[role="option"]', 'Installing').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Installing')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Installing')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })

        //Cannot update
        cy.contains('[role="button"]', 'Installing').click()
        cy.contains('[role="option"]', 'Cannot update').click()
        cy.get('tbody td').should('include.text','a')  //Add random text assertion for loading to finish instead of wait time
        cy.get('tbody td')
            .then(($td) => {
                if ($td.text().includes('Cannot update')) {
                    cy.get('tbody').find('tr').each(($el) => {
                        cy.get('td').find('p').should('exist').should('contain', 'Cannot update')
                        cy.get('td').find('[data-testid="expandable-text-wrapper"]').should('exist')

                    })
                }
                else {
                    cy.get('td').should('contain', 'No updates found')
                }

            })
    })

    it('Schedule update', () => {

        cy.visit('/' + 'iqs/' + supportInfo.IqId + '/details')

        //Navigate to RF channel page
        cy.contains('span', 'Updates').click()
        cy.url().should('include', '/updates')
        cy.get('td p').should('exist').should('be.visible')

        //Schedule update
        cy.contains('button', 'Schedule update').click()
        cy.contains('#GenericModalTitle', 'Schedule update').should('exist')
        cy.get('[placeholder="Select an update type"]').click().type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select the target version"]').click().type('{downArrow}'.repeat(4)).type('{enter}')
        cy.get('[placeholder="Select the specific version"]').click().wait(4000).type('{downArrow}'.repeat(5)).type('{enter}')
        cy.contains('button', 'Verify update').click()
        cy.get('div').contains('span', 'Target version')
        cy.get('p').should('contain', supportInfo.FirmwareVersion1)
        cy.get('[placeholder="Select when to update"]').click().type('{downArrow}').type('{enter}')
        cy.get('#ModalButton').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQ firmware update to 21.0.3-ACCEPT.20220124.447bbf96 scheduled for midnight (customer).')

        //Filter the Scheduled update
        cy.get('td p').should('exist')
        cy.contains('[role="button"]', 'Status').click()
        cy.get('[data-value="not_started"]').click()
        cy.get('td p').should('contain', 'Scheduled')
        cy.get('td').find('p').should('contain', 'Firmware')
        cy.get('td').find('p').should('contain', supportInfo.FirmwareVersion1)
        cy.get('td button').find('span').should('exist').click()

        //Cancel update 
        cy.contains('ul>li', 'Cancel update').click()
        cy.contains('#GenericModalTitle', 'Cancel scheduled update').should('exist')
        cy.contains('#confirm', 'Yes, cancel update').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'The selected scheduled update was cancelled')
   })
})