// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Get SAP Token
Cypress.Commands.add('Save_SAP_Access_Token', () => {
    cy.request({
        method: 'POST',
        url: Cypress.env('TOKENURL'),
        form: true,
        body: {
            "client_id": Cypress.env('SAP_CLIENT_ID'),
            "client_secret": Cypress.env('SAP_CLIENT_SECRET'),
            "grant_type": Cypress.env('GRANT_TYPE'),
            "scope": Cypress.env('SAP_SCOPE'),
            "username": Cypress.env('TOKEN_EMAIL'),
            "password": Cypress.env('TOKEN_PASSWORD')
        }
    }).then(response => {
        cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
            supportInfo.SapToken = response.body.access_token
            cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
        })
    })
})

//Sort
Cypress.Commands.add('Sort', (key) => {
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.get('td').then(function ($elem) {
            supportInfo[key] = $elem.text()
            cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
        })
    })
})


//Get IQ details
Cypress.Commands.add('Get_Iq_Details', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId,
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.Uid = response.body.uid
                supportInfo.IqName = response.body.customer_reference
                supportInfo.IqOnline = response.body.is_online
                supportInfo.SyncState = response.body.sync_state
                supportInfo.IqProvider = response.body.operator
                supportInfo.TenantId = response.body.tenant_id
                supportInfo.CollectionId = response.body.collection.id
                supportInfo.CollectionName = response.body.collection.customer_reference
                supportInfo.CollectionCountryCode = response.body.collection.country_code
                supportInfo.DigitalkeySync = response.body.mkey_sync
                supportInfo.IqSubscription = response.body.is_subscribed

                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})


//Get IQ Restore data
Cypress.Commands.add('Restore_Required_Check', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId,
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            if (response.body.restore_required == true) {
                //Restore the IQ back
                cy.Restore_IQ()

        }
        else if (response.body.restore_required == false && response.body.is_online == true) {
            cy.wait(100000)
            cy.Restore_Required_Check()
        }
    })
})
})


//Get IQ overview
Cypress.Commands.add('Get_Iq_Overview', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + 'overview?skip=0&take=20&search=' + supportInfo.IqMac,
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.RTO = response.body.items[0].rejected_tag_offline_events
                supportInfo.OA = response.body.items[0].offline_access_events
                supportInfo.LE = response.body.items[0].lock_connection_lost_events
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})


//Get IQ connection details
Cypress.Commands.add('Get_Iq_Connections', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId + '/details',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.CCC = response.body.connection_details.ccc
                supportInfo.IqTimeZone = response.body.connection_details.ggsn
                supportInfo.M2M_ICCID = response.body.iccid
                supportInfo.EthernetMac = response.body.network_details.ethernet.mac_address
                supportInfo.WifiMac = response.body.network_details.wifi.mac_address
                supportInfo.EthernetStatus = response.body.network_details.ethernet.status
                supportInfo.WifiStatus = response.body.network_details.wifi.status
                supportInfo.M2MStatus = response.body.network_details.m2m.status
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})

//Get IQ tree
Cypress.Commands.add('Get_Iq_Tree', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId + '/tree',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.LockId = response.body[0].id
                supportInfo.LockName = response.body[0].customer_reference
                supportInfo.LockMac = response.body[0].mac
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})


//Get IQ versions
Cypress.Commands.add('Get_Iq_Versions', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId + '/versions',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.IqFirmwareVersion = response.body.modem_application
                supportInfo.IqBootloaderVersion = response.body.bootloader_hash
                supportInfo.IqNodeFirmwareversion = response.body.node
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})

//Get current IQ Rf channel
Cypress.Commands.add('Get_Rf_Data', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId + '/rfchannel',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.IqRfChannel = response.body.rf_channel
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})

//Get IQ Rf channel history
Cypress.Commands.add('Get_Rf_Data_History', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL') + supportInfo.IqId + '/rfchannellog?skip=0&take=20',
            auth: {
                bearer: supportInfo.SapToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
                supportInfo.NewIqRfChannel = response.body.items[0].new_channel
                supportInfo.OldIqRfChannel = response.body.items[0].old_channel
                cy.writeFile('cypress/fixtures/data_repo.json', supportInfo)
            })
        })
    })
})

//Transfer Installations
Cypress.Commands.add('Transfer_Installations', () => {
    cy.Save_SAP_Access_Token()
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
        cy.request({
            method: 'PATCH',
            url: Cypress.env('SAP_URL') + 'companies/' + supportInfo.TransferInstallerCompanyBID + '/company-installations',
            auth: {
                bearer: supportInfo.SapToken
            },
            body: {
                "destination_installer_company_id": supportInfo.TransferInstallerCompanyAID,
                "destination_installer_id": supportInfo.TransferCompanyInstaller
            }
        }).then(response => {
            expect(response.status).to.eq(200)
        })
    })
})

//Data-cy
Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`)
})

//Data-testid
Cypress.Commands.add('dataTestId', (value) => {
    return cy.get(`[data-testid=${value}]`)
})