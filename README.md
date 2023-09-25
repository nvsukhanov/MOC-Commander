# webPoweredApp

[![GitHub license](https://img.shields.io/github/license/nvsukhanov/webPoweredApp)](https://github.com/nvsukhanov/webPoweredApp/blob/main/LICENSE.md)
[![CI Status](https://github.com/nvsukhanov/webPoweredApp/actions/workflows/ci.yml/badge.svg)](https://github.com/nvsukhanov/webPoweredApp/actions)

An open-source serverless web application designed for controlling LEGO Powered Up MOCs using a variety of physical input devices.

[Demo](https://webpoweredapp.pages.dev)

# Disclaimer

LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this application.

# Features

- ## Input
    - Supported input devices:
        - Keyboard
        - Up to 4 gamepads
        - [LEGO 88010 Remote Control](https://www.lego.com/en-us/product/remote-control-88010)
        - PoweredUP Hub green button (god knows why you would want to use it, but it's there)
    - Any number of input devices can be used to control any number of outputs
    - Input devices can be configured: gamepad axes active zones, input gain (liner/log/exp) etc

- ## Output
    - Supports [LEGO Powered Up](https://www.lego.com/en-us/themes/powered-up/about) hubs (compliant with [LEGO Wireless Protocol v3.0.00](https://lego.github.io/lego-ble-wireless-protocol-docs/index.html))
    - Utilizes dynamic IO capabilities discovery to determine supported IO operations by the device.
    - Supports connection to multiple hubs simultaneously

- ## Operation Modes
    - Supports the following device operation modes:
        - Set speed
        - Set angle
        - Servo
        - Stepper
        - Speed shift (train control)
        - Angle shift (gearbox control)
    - Allows fine-tuning of operation mode parameters such as speed limits, power output, angle limits, etc.
    - Supports acceleration and deceleration profiles (slow start and slow stop, especially useful for trains).

- ## Misc
    - Import/export of control bindings configuration
    - Supports small screen devices

# Limitations

- Due to the nature of the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) used for hub connections, the application is compatible only with the latest versions of Chrome and Chromium-based browsers (Edge, Opera, Brave, etc). Check [here](https://caniuse.com/web-bluetooth) for the full list of supported browsers.
- iOS devices are not supported due to the lack of support for the Web Bluetooth API.
