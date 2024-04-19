# Shield3 React SDK Examples

This repository contains example applications demonstrating how to integrate and use the Shield3 React SDK in various scenarios. The examples are designed to showcase the SDK's capabilities, including policy simulation and transaction analysis within React applications. Each example is self-contained and provides a practical guide to implementing specific features of the Shield3 React SDK.

## Examples Included
**Any examples starting with WIP are not considered complete or production ready**

- **Dynamic Integration**: Example applications that integrates the Shield3 React SDK with Dynamic's SDK. This demonstrates how to use Shield3 for transaction policy simulation in an application that also utilizes Dynamic for enhanced blockchain interactions.
- **Privy Integration**: Example applications that integrate the Shield3 React SDK with Privy's SDK. This demonstrates how to use Shield3 for transaction policy simulation in an application that also utilizes Privy embedded wallets.

## Getting Started

To get started with the example applications, you'll first need to clone this repository to your local machine.

```bash
git clone https://github.com/0xshield3/examples.git
cd examples
```

Each example is located in its own directory within the repository. Navigate to the example you're interested in and follow the README.md instructions specific to that example.

## Prerequisites

Before running any of the example applications, ensure you have the following installed:

- Node.js (version 12 or higher recommended)
- npm or Yarn

Additionally, you'll need an API key from Shield3 to interact with their policy simulation engine. Sign up at Shield3's platform to obtain your API key.

## Installation

Navigate to the example directory of your choice and install the dependencies:

```bash
cd examples/Dynamic # or any other example directory
npm install
```

or if you're using Yarn:

```bash
yarn install
```

## Running the Examples

Each example can be run locally to see it in action. To start an example application, use the start script defined in its `package.json`:

```bash
npm start
```

or with Yarn:

```bash
yarn start
```

This will launch the application in your default web browser.

## Support and Contributions

For issues, questions, or contributions regarding the example applications, please refer to the GitHub repository or contact support through the Shield3 support channels.

---

These examples are provided to help developers understand how to integrate and use the Shield3 React SDK in their applications. For more detailed documentation on the SDK itself, including API references and advanced configurations, please refer to the official Shield3 documentation.