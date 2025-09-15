const { Menu, dialog, app, shell } = require('electron')

function createApplicationMenu(mainWindow) {
  const template = [
    // File Menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Entry',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-entry')
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save')
          },
        },
        { type: 'separator' },
        {
          label: 'Reload Hosts',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('menu-reload')
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    },

    // Edit Menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
      ],
    },

    // View Menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // Window Menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { type: 'separator' },
        {
          label: 'Hosts Editor',
          click: () => {
            mainWindow.focus()
          },
        },
      ],
    },

    // Help Menu
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Hosts Editor',
          click: async () => {
            const result = await dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Hosts Editor',
              message: 'Hosts File Editor',
              detail:
                'A simple application to edit your system hosts file.\n\nVersion: 1.0.0\nAuthor: vdhoangson\nWebsite: https://vdhoangson.com\nElectron: ' +
                process.versions.electron,
              buttons: ['Visit Website', 'OK'],
              defaultId: 1,
              cancelId: 1,
            })

            if (result.response === 0) {
              // Visit Website button clicked
              shell.openExternal('https://vdhoangson.com')
            }
          },
        },
        {
          label: 'Check for Updates',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Check for Updates',
              message: 'Update Check',
              detail: 'This feature is not implemented yet.',
            })
          },
        },
      ],
    },
  ]

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

    // Window menu adjustments for macOS
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  return menu
}

module.exports = { createApplicationMenu }
