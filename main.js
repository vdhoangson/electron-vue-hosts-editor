const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')
const { readHostsFile, writeHostsFile } = require('./hosts')
const { createApplicationMenu } = require('./menu')
const { uninstall, getUninstallInfo } = require('./uninstall')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Create application menu
  createApplicationMenu(win)

  const startUrl = process.env.ELECTRON_START_URL
  if (startUrl) {
    win.loadURL(startUrl)
  } else {
    const indexPath = path.resolve(__dirname, 'dist', 'index.html')
    const fileUrl = pathToFileURL(indexPath).href
    win.loadURL(fileUrl)
  }

  // When the renderer finishes loading, push the current hosts file content
  win.webContents.on('did-finish-load', async () => {
    try {
      const hosts = await readHostsFile()
      win.webContents.send('hosts-loaded', hosts)
    } catch (err) {
      console.error('Failed to load hosts file on startup:', err)
      win.webContents.send('hosts-loaded', null)
    }
  })
}

app.on('ready', createWindow)

ipcMain.handle('read-hosts', async () => {
  try {
    return await readHostsFile()
  } catch (error) {
    console.error('Error reading hosts file:', error)
    throw error
  }
})

ipcMain.handle('write-hosts', async (event, content) => {
  try {
    await writeHostsFile(content)
    return true
  } catch (error) {
    console.error('Error writing hosts file:', error)
    throw error
  }
})

// Uninstall functionality
ipcMain.handle('uninstall-app', async event => {
  try {
    const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      type: 'warning',
      title: 'Uninstall Application',
      message: 'Are you sure you want to uninstall Hosts Editor?',
      detail:
        'This will remove all application files, settings, and data. This action cannot be undone.',
      buttons: ['Cancel', 'Uninstall'],
      defaultId: 0,
      cancelId: 0,
    })

    if (result.response === 1) {
      // Uninstall button clicked
      const uninstallResult = await uninstall()

      if (uninstallResult.success) {
        await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
          type: 'info',
          title: 'Uninstall Complete',
          message: 'Hosts Editor has been successfully uninstalled.',
          detail: 'The application will now close.',
          buttons: ['OK'],
        })

        // Close the application
        app.quit()
        return uninstallResult
      } else {
        throw new Error(uninstallResult.message)
      }
    }

    return { success: false, message: 'Uninstall cancelled by user' }
  } catch (error) {
    console.error('Uninstall error:', error)
    await dialog.showErrorBox(
      'Uninstall Failed',
      `Failed to uninstall application: ${error.message}`
    )
    throw error
  }
})

ipcMain.handle('get-uninstall-info', () => {
  return getUninstallInfo()
})
