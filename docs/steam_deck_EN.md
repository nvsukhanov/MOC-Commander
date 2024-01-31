# Installation manual for Steam Deck

## Install Google Chrome

1. Press Steam button to bring up the Steam Deck menu and select "Power" -> "Switch to Desktop"
2. Open the Discover app on taskbar

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/discover-app.png?raw=True)

3. Select "Internet" -> "Web browsers"
4. Find "Google Chrome" and press "Install"
5. After installation is complete, close the Discover app

## Enable Web Bluetooth support in Google Chrome

1. Open Application Launcher on taskbar, select "Internet" -> "Google Chrome"
  
![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/app-launcher.png?raw=True)

2. Open URL [chrome://flags/#enable-experimental-web-platform-features](chrome://flags/#enable-experimental-web-platform-features) and toggle the flag to "Enabled"

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/enable-web-bluetooth.png?raw=True)

3. Relaunch Google Chrome and open URL [https://moc-commander.pages.dev](https://moc-commander.pages.dev)

Now you can use MOC Commander in desktop mode and use Steam Input in keyboard mode to control your MOCs.

However, I highly recommend to take a few more steps that will allow you to use MOC Commander in the game mode with a full support of Steam Input.

## Allow Google Chrome to install PWA & access gamepad devices

1. Close Google Chrome and open Konsole app (Application Launcher -> "System" -> "Konsole")
2. Enter the following command and press Enter

```
flatpak --user override --filesystem=/run/udev:ro --filesystem=~/.local/share/applications --filesystem=~/.local/share/icons com.google.Chrome
```

3. Close Konsole app

## Install MOC Commander as PWA and add it to Steam Client Library

1. Open Google Chrome
2. Open URL [https://moc-commander.pages.dev](https://moc-commander.pages.dev)
3. Press "Install" button in the top right corner

![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/sd-manual/install-pwa.png?raw=True)

4. Press "Install" button in the popup window. The app will be launched automatically.
5. Close both Google Chrome and MOC Commander app
6. Open Steam Client, select "Library" and press "Add a game" -> "Add a Non-Steam game"
7. Find "MOC Commander" in the list and press "Add selected programs"
8. Return to the gaming mode by double tapping "Return To Gaming Mode" icon on the desktop

The app should appear in the Steam Client Library under "Non-Steam" category.
It will work without Internet connection and will be updated automatically when you are online.

Also, it is worth to configure trackpad for mouse input in the Steam Controller Settings.   

## Set starting resolution for MOC Commander PWA
By default, Chrome launches PWA apps at a lower resolution than the screen resolution of the Steam Deck and the app looks blurry.
Steps below will allow you to fix this.

1. Find "MOC Commander" in the Steam Client Library and open its properties ("Gear icon" -> "Manage" -> "Properties")
2. Find "Launch Options" and add a space at the end of the line and `--window-size=1200,800`
3. Press "Close" and launch the app.
