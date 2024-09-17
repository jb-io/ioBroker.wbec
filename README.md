![Logo](admin/wbec.png)
# ioBroker.wbec

[![NPM version](https://img.shields.io/npm/v/iobroker.wbec.svg)](https://www.npmjs.com/package/iobroker.wbec)
[![Downloads](https://img.shields.io/npm/dm/iobroker.wbec.svg)](https://www.npmjs.com/package/iobroker.wbec)
![Number of Installations](https://iobroker.live/badges/wbec-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/wbec-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.wbec.png?downloads=true)](https://nodei.co/npm/iobroker.wbec/)

**Tests:** ![Test and Release](https://github.com/jb-io/ioBroker.wbec/workflows/Test%20and%20Release/badge.svg)

## wbec adapter for ioBroker

Integration of Heidelberg WallBox Energy Control ESP8266

## Description

The **ioBroker WBEC Adapter** allows you to regularly monitor and control the state of your WBEC Controller. This adapter provides the capability to query the controller at a configurable interval and to interact with certain important states. For example, you can monitor charging power and directly adjust the configuration for PV surplus charging.

## Features

- **Regular Queries**: The adapter queries the state of the WBEC Controller at an interval you specify, ensuring that you always have up-to-date information on its status.
- **Writable States**: You can directly adjust certain parameters, such as charging power and the configuration for PV surplus charging, through the ioBroker interface.

## Manufacturer Information

The WBEC Controller is developed by Stefan Ferstl [steff393](https://github.com/steff393/wbec). Many thanks for providing this excellent controller and for the support!

For more information and technical details, please visit the [Manufacturer’s website](https://steff393.github.io/wbec-site/).


## Changelog
<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**
* [TASK] Add error handling on external requests
* [TASK] Update dependencies from dependabot

### 0.1.0 (2024-09-08)
* [TASK] initial release

## License

[Licensed under GPLv3](LICENSE) Copyright (c) 2024 jb-io
