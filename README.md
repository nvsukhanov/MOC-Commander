<h1 align="center">
<img src="https://raw.githubusercontent.com/nvsukhanov/MOC-Commander/main/src/assets/favicon.svg" width="24" height="24"/>
MOC Commander: PWA for controlling LEGO® Powered Up devices
</h1>

<img src="https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/header.png?raw=True"/>

[![GitHub license](https://img.shields.io/github/license/nvsukhanov/MOC-Commander)](https://github.com/nvsukhanov/MOC-Commander/blob/main/LICENSE.md)
[![CI Status](https://github.com/nvsukhanov/MOC-Commander/actions/workflows/ci.yml/badge.svg)](https://github.com/nvsukhanov/MOC-Commander/actions)
![GitHub release](https://img.shields.io/github/v/release/nvsukhanov/MOC-Commander)

An open-source Progressive Web Application for controlling LEGO® Powered Up devices with physical controllers.

Deployment of the latest stable version is available at [https://moc-commander.com](https://moc-commander.com)

Staging version can be found at [https://main.moc-commander.pages.dev](https://main.moc-commander.pages.dev).

<img src="https://github.com/nvsukhanov/nvsukhanov.github.io/blob/main/moc-commander/sd-tracks.gif?raw=True"/>

## Features

### Input

- Supported input devices:
  - Keyboard
  - Up to 4 gamepads
  - [LEGO 88010 Remote Control](https://www.lego.com/en-us/product/remote-control-88010)
  - PoweredUP Hub green button
  - Steam Deck ([installation manual](https://moc-commander.com/steam-deck))
- Any number of input devices can be used to control any number of outputs
- Input devices can be configured: gamepad axes active zones, input gain (liner/log/exp) etc

### Output

- Supports [LEGO Powered Up](https://www.lego.com/en-us/themes/powered-up/about) hubs (compliant
  with [LEGO Wireless Protocol v3.0.00](https://lego.github.io/lego-ble-wireless-protocol-docs/index.html))
- Utilizes dynamic IO capabilities discovery to determine supported IO operations by the device.
- Supports connection to multiple hubs simultaneously

### Operation Modes

- Supports the following device operation modes:
  - Speed
  - Set angle
  - Servo w/ auto-calibration on start
  - Stepper
  - Train
  - Gearbox
- Allows fine-tuning of operation mode parameters such as speed limits, power output, angle limits, etc.
- Supports acceleration and deceleration profiles (slow start and slow stop, especially useful for trains)
- Allows reading and adjusting of motor position during the configuration of control schemes

### Misc

- Supports reading of sensor data (voltage, pitch, yaw, etc) and displaying it during operation
- Import/export of control schemes
- Backup/restore application state
- Supports small screen devices
- Supports dark theme
- Installable as a PWA

### Supported platforms

- Windows
- macOS
- Linux
- Android

## Limitations

- Due to the nature of the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) used
  for hub connections, the application is compatible only with the latest versions of Chrome and Chromium-based
  browsers (Edge, Opera, Brave, etc). Check [here](https://caniuse.com/web-bluetooth) for the full list of supported
  browsers.
- iOS devices are not supported due to the lack of support for the Web Bluetooth API.

## Disclaimer

LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this application.

## Screenshots

|                                                                                                                                            |                                                                                                                               |                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Running control scheme                                                                                                                     | Gamepad settings                                                                                                              | Hubs list                                                                                                                                      |
| ![Running control scheme](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/cs-run-sensors.png?raw=True)           | ![Gamepad settings](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/gamepad-full.png?raw=True)      | ![Hubs list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/hubs-full.png?raw=True)                                 |
| Hub view                                                                                                                                   | Control scheme view                                                                                                           | Control scheme view (dark theme)                                                                                                               |
| ![Hub view](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/hub-full.png?raw=True)                               | ![Control scheme view (full)](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/cs-full.png?raw=True) | ![Control scheme view (full, dark theme)](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/cs-dark-full.png?raw=True) |
| Control scheme export (dark theme)                                                                                                         | Control scheme edit                                                                                                           | Controllers list                                                                                                                               |
| ![Control scheme view small screen](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/cs-export-dark.png?raw=True) | ![Control scheme edit](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/cs-edit-full.png?raw=True)   | ![Controllers list](https://raw.github.com/nvsukhanov/nvsukhanov.github.io/main/moc-commander/controllers-full.png?raw=True)                   |
