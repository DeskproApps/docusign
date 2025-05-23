# Docusign Setup Instructions

To set up Docusign API access, follow these steps:

Head over to https://developers.docusign.com/ and create an account.

Enter https://admindemo.docusign.com/apps-and-keys, click on Add App and Integration key, give your App a name and click on Create App.

[![](/docs/assets/setup/apps_and_keys_page.png)](/docs/assets/setup/apps_and_keys_page.png)

Now, on the Authentication section, under "Is your application able to securely store a client secret?" select Yes.

Click on the Add Secret Key Button, and copy its content, and the Integration Key on top of the page, and paste them into the fields under the settings tab in Deskpro's drawer for Docusign.

[![](/docs/assets/setup/app_page.png)](/docs/assets/setup/app_page.png)

[![](/docs/assets/setup/deskpro_sign_in.png)](/docs/assets/setup/deskpro_sign_in.png)

Copy the Redirect URI in Deskpro's settings tab and paste it into the Redirect URIs field in Docusign when you click Add URI.

[![](/docs/assets/setup/redirect_uri_field.png)](/docs/assets/setup/redirect_uri_field.png)

Still on the Docusign page, click "Save" to save the changes.

On the Deskpro Docusign settings tab, click "Sign In".

Approve all the scopes, and if there are no errors you should get an Authorization Complete page.

https://developers.docusign.com/docs/esign-rest-api/go-live/

If your app has yet to be authorized, click on the Not Authorized button, and the Docusign Deskpro App will make 20 requests, as it's needed to ask for a review to use production account (it may take up to 15 minutes for the requests to be registered).

Once done, click on Submit for review, and wait until the review has been approved. (might need to wait a few minutes for this to appear).

[![](/docs/assets/setup/submit_for_review.png)](/docs/assets/setup/submit_for_review.png)

Once this has been approved, go click on Actions -> Select Go-Live Account, accept the terms and conditions and login with your production Docusign account on the pop up page.

[![](/docs/assets/setup/go_live.png)](/docs/assets/setup/go_live.png)

Once done, select your account and click on Select.

You should now have access to the production account, so head back to Deskpro and click on Authorized.

You will now be able to see the list of production accounts. You can select your desired production account and proceed to click on the "Install" button to complete the installation process.

[![](/docs/assets/setup/select_account.png)](/docs/assets/setup/select_account.png)
