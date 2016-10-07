# Steps to Register a new GitHub Application

## 1 - Open Your GitHub Account Settings

> Visit: https://github.com/settings/developers

![github-auth-01-register-new-app](https://cloud.githubusercontent.com/assets/12045918/19191651/4ae8c678-8c9b-11e6-9a10-12c8a5d30999.png)

## 2 - Define the details for your applications

Ensure that you set the `callback URL` to something obvious like `/githubauth`

![github-auth-02-new-app-register](https://cloud.githubusercontent.com/assets/194400/11226514/62975d2a-8d78-11e5-83f7-96f78c0d3d25.png)

*Note: You can edit/change any of these values later*.

Click on **Register Application**

## 3 - Copy the Client ID & Secret for the App

Once you've successfully created your GitHub App,
copy the Client ID and Secret and save them as environment variables
`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` respectively.

![github-auth-03-app](https://cloud.githubusercontent.com/assets/194400/11236484/fcf9c3a4-8dd1-11e5-8489-5c43781ac59b.png)


Copy the two keys and export them in your project
see: Step 3 of the Readme.
