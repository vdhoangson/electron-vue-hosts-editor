const { app } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { exec } = require('child_process')
const util = require('util')

const execAsync = util.promisify(exec)

/**
 * Uninstall function to remove all application files and data
 */
async function uninstall() {
  try {
    console.log('Starting uninstall process...')

    const appDataPath = app.getPath('appData')
    const userDataPath = app.getPath('userData')
    const exePath = process.execPath
    const appPath = path.dirname(exePath)

    // 1. Remove application data
    const appDataDir = path.join(appDataPath, 'HostsEditor')
    await removeDirectory(appDataDir)

    // 2. Remove user data
    const userDataDir = path.join(userDataPath, 'HostsEditor')
    await removeDirectory(userDataDir)

    // 3. Remove desktop shortcut (Windows)
    if (process.platform === 'win32') {
      await removeWindowsShortcuts()
    }

    // 4. Remove start menu entries (Windows)
    if (process.platform === 'win32') {
      await removeStartMenuEntries()
    }

    // 5. Remove registry entries (Windows)
    if (process.platform === 'win32') {
      await removeRegistryEntries()
    }

    // 6. Remove application directory (schedule for deletion after exit)
    if (process.platform === 'win32') {
      await scheduleDirectoryDeletion(appPath)
    }

    console.log('Uninstall completed successfully!')
    return { success: true, message: 'Application uninstalled successfully' }
  } catch (error) {
    console.error('Uninstall failed:', error)
    return { success: false, message: `Uninstall failed: ${error.message}` }
  }
}

/**
 * Remove directory recursively
 */
async function removeDirectory(dirPath) {
  try {
    await fs.access(dirPath)
    console.log(`Removing directory: ${dirPath}`)
    await fs.rm(dirPath, { recursive: true, force: true })
    console.log(`Directory removed: ${dirPath}`)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(`Directory not found or already removed: ${dirPath}`)
    }
  }
}

/**
 * Remove Windows desktop and start menu shortcuts
 */
async function removeWindowsShortcuts() {
  try {
    const desktopPath = path.join(require('os').homedir(), 'Desktop')
    const desktopShortcut = path.join(desktopPath, 'HostsEditor.lnk')

    // Remove desktop shortcut
    await fs.unlink(desktopShortcut).catch(() => {
      console.log('Desktop shortcut not found or already removed')
    })

    console.log('Windows shortcuts removed')
  } catch (error) {
    console.error('Error removing Windows shortcuts:', error)
  }
}

/**
 * Remove Start Menu entries
 */
async function removeStartMenuEntries() {
  try {
    const startMenuPath = path.join(
      process.env.APPDATA,
      'Microsoft',
      'Windows',
      'Start Menu',
      'Programs'
    )
    const startMenuShortcut = path.join(startMenuPath, 'HostsEditor.lnk')

    // Remove start menu shortcut
    await fs.unlink(startMenuShortcut).catch(() => {
      console.log('Start menu shortcut not found or already removed')
    })

    console.log('Start menu entries removed')
  } catch (error) {
    console.error('Error removing start menu entries:', error)
  }
}

/**
 * Remove Windows registry entries
 */
async function removeRegistryEntries() {
  try {
    const regCommands = [
      // Remove uninstall entry
      `reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HostsEditor" /f`,
      // Remove application registry keys
      `reg delete "HKCU\\Software\\vdhoangson\\HostsEditor" /f`,
    ]

    for (const command of regCommands) {
      try {
        await execAsync(command)
        console.log(`Registry command executed: ${command}`)
      } catch (error) {
        console.log(`Registry command failed (may not exist): ${command}`)
      }
    }

    console.log('Registry entries removed')
  } catch (error) {
    console.error('Error removing registry entries:', error)
  }
}

/**
 * Schedule directory deletion after application exit (Windows)
 */
async function scheduleDirectoryDeletion(dirPath) {
  try {
    // Create a batch file to delete the directory after a delay
    const batchFile = path.join(require('os').tmpdir(), 'hosts_editor_uninstall.bat')
    const batchContent = `
@echo off
timeout /t 2 /nobreak > nul
rmdir /s /q "${dirPath}"
del "%~f0"
`

    await fs.writeFile(batchFile, batchContent, 'utf8')

    // Execute the batch file in the background
    exec(`cmd /c "${batchFile}"`, error => {
      if (error) {
        console.error('Error scheduling directory deletion:', error)
      } else {
        console.log('Directory deletion scheduled')
      }
    })
  } catch (error) {
    console.error('Error scheduling directory deletion:', error)
  }
}

/**
 * Get uninstall information
 */
function getUninstallInfo() {
  const exePath = process.execPath
  const appPath = path.dirname(exePath)

  return {
    appPath,
    appDataPath: path.join(app.getPath('appData'), 'HostsEditor'),
    userDataPath: path.join(app.getPath('userData'), 'HostsEditor'),
    platform: process.platform,
    exePath,
  }
}

module.exports = {
  uninstall,
  getUninstallInfo,
}
