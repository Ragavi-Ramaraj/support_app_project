//Get Average IQ Reconnect counts
Cypress.Commands.add('Average_Iq_reconnect_Events', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_URL') + 'collections/' + supportInfo.CollectionId + '/average_iq_reconnects',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then((response) => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo["iq_reconnect_events24h"] = response.body.iq_reconnects24h
                supportInfo["iq_reconnect_events7d"] = response.body.iq_reconnects7d
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
                cy.wait(5000, { log: false })
            })
        })
    })
})

//Online Offline Access counts
Cypress.Commands.add('Get_Iq_Online_Offline_Events', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_URL') + 'collections/' + supportInfo.CollectionId + '/online_offline_access_count',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then((response) => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo["online_access_count24h"] = response.body.online_access_count24h
                supportInfo["online_access_count7d"] = response.body.online_access_count7d
                supportInfo["offline_access_count24h"] = response.body.offline_access_count24h
                supportInfo["offline_access_count7d"] = response.body.offline_access_count7d
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
                cy.wait(5000, { log: false })
            })
        })
    })
})

//Rejected Tag Access counts
Cypress.Commands.add('Rejected_Tag_Access_Events', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_URL') + 'collections/' + supportInfo.CollectionId + '/rejected_tag_offline_count',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then((response) => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo["rejected_tag_offline_events24h"] = response.body.rejected_tag_offline_count24h
                supportInfo["rejected_tag_offline_events7d"] = response.body.rejected_tag_offline_count7d
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
                cy.wait(5000, { log: false })
            })
        })
    })
})
