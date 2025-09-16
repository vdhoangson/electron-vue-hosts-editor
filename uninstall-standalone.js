#!/usr/bin/env node

/**
 * Standalone uninstall script for Hosts Editor
 * Run with: node uninstall-standalone.js
 */

const { app } = require('electron')
const { uninstall, getUninstallInfo } = require('./uninstall')

async function main() {
  console.log('Hosts Editor - Standalone Uninstaller')
  console.log('=====================================')

  try {
    // Get uninstall information
    const info = getUninstallInfo()
    console.log('Application Information:')
    console.log(`- Platform: ${info.platform}`)
    console.log(`- App Path: ${info.appPath}`)
    console.log(`- App Data: ${info.appDataPath}`)
    console.log(`- User Data: ${info.userDataPath}`)
    console.log()

    // Confirm uninstall
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Are you sure you want to uninstall Hosts Editor? (y/N): ', async answer => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('Starting uninstall process...')

        const result = await uninstall()

        if (result.success) {
          console.log('✅ Uninstall completed successfully!')
          console.log('The application has been removed from your system.')
        } else {
          console.error('❌ Uninstall failed:', result.message)
          process.exit(1)
        }
      } else {
        console.log('Uninstall cancelled.')
      }

      rl.close()
      process.exit(0)
    })
  } catch (error) {
    console.error('Error during uninstall process:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { main }
