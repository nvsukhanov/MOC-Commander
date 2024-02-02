# Installation manual for Steam Deck

Welcome to the MOC Commander installation guide for Steam Deck! This manual will walk you through the simple steps to get MOC Commander up and running on your device. Let's get started!

Estimated time to complete: 10 minutes

## Step 1. Install Google Chrome

1. Press the Steam button to bring up the Steam Deck menu and select "Power" -> "Switch to Desktop"
2. Open the Discover app on taskbar.

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/discover-app.png?raw=True)

3. Select "Internet" -> "Web browsers"
4. Find "Google Chrome" and press "Install"
5. After the installation is complete, close the Discover app

## Step 2. Enable Bluetooth support in Google Chrome
By default, Google Chrome does not support Bluetooth devices on Linux. To enable Bluetooth support, follow the steps below:

1. Open the Application Launcher on the taskbar, select "Internet" -> "Google Chrome"
  
![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/app-launcher.png?raw=True)

2. Open the URL `chrome://flags/#enable-experimental-web-platform-features` and toggle the flag to "Enabled"

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/enable-web-bluetooth.png?raw=True)

3. Relaunch Google Chrome and open the URL [https://moc-commander.com](https://moc-commander.com)

Now, you can use MOC Commander in desktop mode and use Steam Input in keyboard mode to control your MOCs.

However, I highly recommend taking a few more steps that will allow you to use MOC Commander in game mode with full support of Steam Input.

## Step 3. Allow Google Chrome to install PWA & access gamepad devices

1. Close Google Chrome and open the Konsole app (Application Launcher -> "System" -> "Konsole")
2. Enter the following command and press Enter:

```
flatpak --user override --filesystem=/run/udev:ro --filesystem=~/.local/share/applications --filesystem=~/.local/share/icons com.google.Chrome
```
This command will allow Google Chrome to install the MOC Commander app and access gamepad devices.

3. Close the Konsole app

## Step 4. Install MOC Commander and add it to Steam Client Library

1. Open Google Chrome
2. Open the URL [https://moc-commander.com](https://moc-commander.com)
3. Press "Install" button in the top right corner

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/install-pwa.png?raw=True)

4. Press the "Install" button in the popup window. The app will launch automatically
5. Close both Google Chrome and the MOC Commander app
6. Open the Steam Client, select "Library," and press "Add a Game" -> "Add a Non-Steam Game"
7. Find "MOC Commander" in the list and press "Add Selected Programs"
8. Return to gaming mode by double-tapping the "Return To Gaming Mode" icon on the desktop

The app should appear in the Steam Client Library under the "Non-Steam" category.
It will work without an Internet connection and will self-update when you are online.

## Step 5. Set starting resolution for MOC Commander
By default, Chrome launches PWA apps at a lower resolution than the screen resolution of the Steam Deck.
Follow the steps below to fix this:

1. Find "MOC Commander" in the Steam Client Library and open its properties ("Gear Icon" -> "Properties").
2. In "Launch Options," add a space at the end of the line and the `--kiosk` option.
3. Close the properties window and launch the app
