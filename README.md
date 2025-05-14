
<div align="center">
  <a target="_blank" href=""><img src="https://img.shields.io/github/contributors/deskproapps/docusign.svg?style=for-the-badge" alt="Contributors" /></a>
  <a target="_blank" href="https://github.com/deskproapps/docusign/issues"><img src="https://img.shields.io/github/issues/deskproapps/docusign.svg?style=for-the-badge" alt="Issues" /></a>
  <a target="_blank" href="https://github.com/deskproapps/docusign/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/deskproapps/docusign.svg?style=for-the-badge" alt="MIT License" /></a>
  <a target="_blank" href="https://github.com/deskproapps/docusign/releases"><img src="https://img.shields.io/github/v/release/deskproapps/docusign?style=for-the-badge" alt="GitHub Release" /></a>
  <a target="_blank" href="https://www.linkedin.com/company/deskpro"><img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555" alt="LinkedIn" /></a>

  <img src="readme.svg">
</div>

<div align="center">
  <h1>Docusign App</h1>
  <p>Send, sign and manage documents digitally, reduce paper waste, and improve the efficiency of your business processes with Docusign.</p>
  <a href="https://support.deskpro.com/ga/guides/developers/anatomy-of-an-app" target="_blank">Deskpro Apps Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://developers.docusign.com/docs/" target="_blank">Docusign API Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="./SETUP.md" target="_blank">Docusign App Setup Guide</a>
  <br />
  <hr />
  <br />
</div>



## **About the app**
Docusign is an eSignature platform that lets users securely send, sign, and manage documents online. Our DocuSign integration links Docusign contacts to Deskpro users, allowing agents to view the status of a contact’s envelopes directly within Deskpro without needing to switch between systems.

## **Setting up the app in Deskpro**
You can follow our [setup guide](./SETUP.md) for a step-by-step guide to setting up the Docusign app in Deskpro.

## Development

### With DevContainers (Recommended)
To make development easier and avoid version conflicts, we recommend using **DevContainers** for local development. This approach ensures that everyone on the team uses the same environment, reducing setup issues and version mismatches between dependencies.

#### Why use DevContainers?
- **Consistency:** All developers work in the same environment, with the same versions of dependencies, tools, and configurations.
- **Speed:** The DevContainer setup is quick to start, letting you focus on coding rather than environment setup.
- **Isolation:** Avoid conflicts between different versions of Node.js, PNPM, or other dependencies by using the predefined container setup.

#### Getting Started with DevContainers
1. Ensure that you have [Docker](https://www.docker.com/get-started) and [VS Code](https://code.visualstudio.com/) installed.
2. Open the project in [VS Code](https://code.visualstudio.com/).
3. If you have the **Remote - Containers** extension installed, [VS Code](https://code.visualstudio.com/) should automatically detect the `.devcontainer` configuration in this project and prompt you to reopen the folder in the container.
4. After opening the project in the DevContainer, run:
   ```bash
   pnpm start
   ```

You should now be able to view the app in your browser. For more information about developing [Deskpro apps](https://www.deskpro.com/apps), [Visit the docs](https://support.deskpro.com/ga/guides/developers/anatomy-of-an-app).

### Natively
_We recommend using the DevContainer mentioned above for Consistency, Speed and Isolation._

This app was developed primarily using **Typescript**, **React**, and **Vite**.

#### Setup
To run this project locally:

 ```bash
# Clone the repository
git clone https://github.com/DeskproApps/docusign.git

# Change to the project directory
cd docusign

# Install dependencies
pnpm install

# Run the development server.
pnpm start
```

You should now be able to view the app in your browser. For more information about developing [Deskpro apps](https://www.deskpro.com/apps), [Visit the docs](https://support.deskpro.com/ga/guides/developers/anatomy-of-an-app).

### Testing
We've included `jest` to run tests. It will look anywhere in `/src` for test suite files ending in `.test.tsx` or `.test.ts`.

You can run all tests using:

```bash
pnpm test
```

## Versioning
Every app deployment requires that the version property in the `manifest.json` file be updated to reflect the new app version. This is so Deskpro can detect changes and add/upgrade apps accordingly. As such, we've made altering versions easy by having CI make the actual version change for you. Here's what we do:

* We increment patch versions, i.e. 1.0.1, automatically. You don't need to do anything and this will happen
* Minor versions, i.e. 1.1.0, are incremented if you add the minor-version GitHub label to your PR
* Major versions, i.e. 2.0.0, are incremented if you add the major-version GitHub label to your PR

## Top contributors
[![Contributors](https://contrib.rocks/image?repo=deskproapps/docusign)](https://github.com/deskproapps/docusign/graphs/contributors)


## License
Distributed under the MIT License. See [LICENSE.md](LICENSE.md) for more information.

    