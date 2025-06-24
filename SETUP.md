Docusign App Setup Instructions
===

To install the Docusign app, you'll need to create OAuth credentials. Follow these steps to set it up.

## Create a Docusign Developer Account

Start by visiting the [Docusign Developer Center](https://developers.docusign.com/) and signing in. If you don’t already have a developer account, click “Create Account” and complete the sign up process to access the developer sandbox environment.

![Docusign developer account unauthenticated dropdown"](/docs/setup/setup-guide-screenshot-01.png)

## Create An App
Once logged in, navigate to the "My Apps & Keys" section under your account settings. Click "Add App & Integration Key" and enter a name for your app, such as “Deskpro DocuSign App.” After creating the app, you’ll be taken to its settings page where the integration key, also known as the client ID, is displayed.

![Docusign developer account authenticated dropdown"](/docs/setup/setup-guide-screenshot-02.png)

![Create a Docusign app screen"](/docs/setup/setup-guide-screenshot-03.png)

## Retrieve OAuth Credentials
Still on the app settings page, copy the integration key being shown and paste it in the `Integration Key` field in the settings drawer in Deskpro.

In the "Authentication" section in Docusign, select `Yes` for "Is your application able to securely store a client secret?" and ensure `Require Proof Key for Code Exchange (PKCE)` is not checked.

Click the "Add Secret Key" button and copy the key into the `Secret Key` field in the Deskpro settings drawer.

In the "Additional settings" section, click "Add URI and paste the callback URL from the Deskpro settings drawer.

![Docusign OAuth app credentials"](/docs/setup/setup-guide-screenshot-04.png)

Once you're done click save.

⚠️ To view the setup guide after installing the app, click on the Docusign app from the "Available". tab

## Prepare Your App For Review (For Production Accounts)
To use the Docusign integration in a production environment, your app must first be reviewed and approved by Docusign. At this stage, your app’s `Go Live Status` will likely show as `Not Started`.

![Docusign OAuth app with status of `Not Started`"](/docs/setup/setup-guide-screenshot-05.png)

To prepare your app for review, begin by opening the settings drawer in Deskpro. Enable the `Sandbox Account` & `Send 20 Requests After Next Login` options, then click Save/Install to apply the changes.

![Deskpro Docusign app settings drawer"](/docs/setup/setup-guide-screenshot-06.png)

Next, open any ticket in Deskpro and launch the Docusign app from the user sidebar. Log in to your Docusign developer account. After a successful login, the app will automatically send 20 API requests in the background. This may take a few moments to complete. During this process, you will be prompted to choose which account you'd like to use with the integration. If you're only preparing the app for review, you can skip this step.

![Trigged requests confirmation callout"](/docs/setup/setup-guide-screenshot-07.png)

Once a message appears confirming that the requests have been successfully sent, return to your DocuSign Apps and Integration Keys dashboard. After a short wait, your app’s `Go Live Status` should change to `Submit for Review`.

![Docusign OAuth app with status of `Submit for review`"](/docs/setup/setup-guide-screenshot-08.png)

Click the status link and then click the `Submit for Review` button. The status will update to `Review Pending`. Once your app passes review, click the `Actions` dropdown, select `Select Go-Live Account`, accept the terms and conditions, and choose your production account.

![Docusign OAuth app `Actions` dropdown"](/docs/setup/setup-guide-screenshot-09.png)

To complete the transition to production, return to Deskpro and disable the Sandbox Account option. Your the Docusign app will now operate using your production credentials.

## Configure Permissions & Install the App

Finally, configure who can access the app by going to the "Permissions" tab. Select the users and/or groups that should have access. Once you’re satisfied with the settings, click "Install" to complete the setup.