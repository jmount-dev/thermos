# Thermos

Thermos is a simple command-line application for gathering system temperature readings. This project provides a lightweight tool that prints temperatures to your terminal and can optionally watch sensor values over time.

## Overview

The goal of Thermos is to offer an easy-to-run script for demonstrating how to work with hardware temperature sensors in Python. It polls your system's available sensors and shows the current reading. While small, the project serves as a starting point for learning about sensor monitoring and building CLI programs.

## Setup

1. Clone this repository.
2. Create and activate a Python 3 virtual environment.
3. (Optional) Install future dependencies listed in `requirements.txt`.

```
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt  # if the file exists
```

## Basic Usage

After completing setup, run the script from the repository root:

```
python thermos.py
```

By default, the program prints a single temperature reading. To continuously monitor temperatures, use the `--watch` option with a delay in seconds:

```
python thermos.py --watch 2
```

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests to improve the project.
