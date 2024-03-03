# Custom Logger Package

## Overview

This Custom Logger package is designed to provide a comprehensive logging solution for Node.js applications. It supports various logging levels, customizable styling for terminal output, and a structured approach to managing main processes and subprocesses logging. It's structured to encourage modularity and ease of use, making it a suitable choice for both small and large-scale applications.

## Features

- Logging Levels: Supports multiple logging levels (e.g., TRACE, DEBUG, INFO, WARN, ERROR).
- Styling: Customizable styling options for terminal output, including color coding, to enhance readability.
- Main and Subprocess Management: Facilitates structured logging by distinguishing between main processes and subprocesses, enabling better traceability and organization.


# To use the Custom Logger in your project, follow these steps:

## Installation

First, add the Custom Logger package to your project using npm: npm install custom-logger-package-name

## Usage

- Initialize the Main Process Logger:

Before logging from any part of your application, you must initialize the Main Process Logger. This step sets up the logging service and applies the initial configuration. You can either inject logger or extend it.

import { LoggerClient, LoggerMode, MainProcessLoggerConfig, LogLevel } from "custom-logging-module";

class MyApp extends LoggerClient {
    constructor() {
        super(new MainProcessLoggerConfig("MyApp", LoggerMode.COLORED, LogLevel.INFO));
    }
}

const app = new MyApp();
app.log(LogLevel.INFO, "Application started.");


- Logging from a Subprocess:

For logging in a submodule or subprocess, instantiate a LoggerClient with a SubProcessLoggerConfig. Ensure to specify the name of the main process it belongs to for proper association.


import { LoggerClient, SubProcessLoggerConfig, LogLevel } from "custom-logging-module";

class DataService extends LoggerClient {
    constructor(mainProcessName: string) {
        super(new SubProcessLoggerConfig("DataService", mainProcessName));
    }

    fetchData() {
        this.log(LogLevel.INFO, "Fetching data...");
        // Data fetching logic...
    }
}

const dataService = new DataService("MyApp");
dataService.fetchData();

# Configuration

The Custom Logger allows for detailed configuration of logging behavior and styles. Modify the logging level, mode (classic, colored, or docker), and terminal output styles using the LoggerConfig and LoggerStylesConfig classes.

# Documentation
TO DO

# Contributing
Contributions are welcome! If you'd like to improve the Custom Logger package, please feel free to fork the repository, make your changes, and submit a pull request.

# License
This project is licensed under the MIT License - see the LICENSE file for details.