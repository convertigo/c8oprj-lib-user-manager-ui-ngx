


# lib_UserManager_ui_ngx

The lib_UserManager enables your projects to include user management and authentication in your apps. This library will handle :

- user login with user/password using a salted password security
- user login using OpenID




For more technical informations : [documentation](./project.md)

- [Installation](#installation)
- [Mobile Library](#mobile-library)
    - [Shared Actions](#shared-actions)
        - [guardPages](#guardpages)
        - [isAuthenticatedSession](#isauthenticatedsession)
        - [SignIn](#signin)
        - [SignOut](#signout)
    - [Shared Components](#shared-components)
        - [ConfirmAccount](#confirmaccount)
        - [DeleteAccount](#deleteaccount)
        - [ForgotPassword](#forgotpassword)
        - [LoginComponent](#logincomponent)


## Installation

1. In your Convertigo Studio use `File->Import->Convertigo->Convertigo Project` and hit the `Next` button
2. In the dialog `Project remote URL` field, paste the text below:
   <table>
     <tr><td>Usage</td><td>Click the copy button</td></tr>
     <tr><td>To contribute</td><td>

     ```
     lib_UserManager_ui_ngx=git@github.com:convertigo/c8oprj-lib-user-manager-ui-ngx.git:branch=8.0.0
     ```
     </td></tr>
     <tr><td>To simply use</td><td>

     ```
     lib_UserManager_ui_ngx=git@github.com:convertigo/c8oprj-lib-user-manager-ui-ngx/archive/8.0.0.zip
     ```
     </td></tr>
    </table>
3. Click the `Finish` button. This will automatically import the __lib_UserManager_ui_ngx__ project


## Mobile Library

### Shared Actions

#### guardPages

Handles access control and redirection based on the user's authentication status and the page they are attempting to access.

This shared action should be invoked from an AppGuard component.

<ins>Behavior:</ins>


 - If the user is **not authenticated** and tries to access a page listed in `authorizedPagesOnlyWithAuthentication`, they will be redirected to `unauthenticatedAccessRedirectPage`.
 - If the user is **authenticated** and tries to access a page listed in `authorizedPagesOnlyWithoutAuthentication`, they will be redirected to `authenticatedAccessRedirectPage`.
 - If the current page is not restricted based on the user's authentication status, no redirection occurs.

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>authenticatedAccessRedirectPage</td><td>Type: String | Specifies the page to redirect users to when they attempt to access a page that should not be accessible after they have already logged in (e.g., login or registration pages).</td>
</tr>
<tr>
<td>authorizedPagesOnlyWithAuthentication</td><td>Type: Array of String | Specifies the list of pages that are only accessible to authenticated users. These pages should not be available to users who are not logged in (e.g., dashboard or profile pages).</td>
</tr>
<tr>
<td>authorizedPagesOnlyWithoutAuthentication</td><td>Type: Array of String | Specifies the list of pages that are only accessible to users who are **not** authenticated. These pages should be hidden or restricted once the user is logged in (e.g., login or registration pages).</td>
</tr>
<tr>
<td>unauthenticatedAccessRedirectPage</td><td>Type: String | Specifies the page to redirect users to when they attempt to access a restricted page without being authenticated. (e.g., dashboard or profile pages).</td>
</tr>
</table>

#### isAuthenticatedSession

Returns true if current session is authenticated

#### SignIn

The `SignIn` function handles user authentication and remember me feature

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>password</td><td>The user's password</td>
</tr>
<tr>
<td>rememberMe</td><td>Stay logged in for an extended period, even after closing the browser</td>
</tr>
<tr>
<td>user</td><td>The userID (user's email)</td>
</tr>
</table>

#### SignOut

The `SignOut` function handles user signout and remember me feature

### Shared Components

#### ConfirmAccount

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td></td>
</tr>
<tr>
<td>imgUrl</td><td></td>
</tr>
<tr>
<td>resetKey</td><td></td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td></td>
</tr>
<tr>
<td>PasswordChangedOk</td><td></td>
</tr>
</table>

#### DeleteAccount

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td></td>
</tr>
<tr>
<td>imgUrl</td><td></td>
</tr>
<tr>
<td>moretext</td><td></td>
</tr>
<tr>
<td>resetKey</td><td></td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td></td>
</tr>
<tr>
<td>PasswordChangedOk</td><td></td>
</tr>
</table>

#### ForgotPassword

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td></td>
</tr>
<tr>
<td>imgUrl</td><td></td>
</tr>
<tr>
<td>resetKey</td><td></td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td></td>
</tr>
<tr>
<td>PasswordChangedOk</td><td></td>
</tr>
</table>

#### LoginComponent

This component handle a login / password form.
And uses the lib_UserManager

The component will check user / password and if successful will autenticate the user. When the user is authenticated, the component will fire a 'login' event that you can handle with a SubscribeHandler. use this event to close a modal page or to push/root a new page when the user is authenticated




**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>enableAzureADLogin</td><td>Set to false to disable login with AzureAD</td>
</tr>
<tr>
<td>enableCancelDismiss</td><td>Set to true if you want a cancel button to be displayed causing a Modal Page dismiss</td>
</tr>
<tr>
<td>enableGoogleLogin</td><td>Set to false to disable loggin with google</td>
</tr>
<tr>
<td>enableLinkedInLogin</td><td>Set to false to disable login with LinkedIn</td>
</tr>
<tr>
<td>logoImage</td><td>A logo image to be displayed over the login form (64x64)</td>
</tr>
<tr>
<td>logoWidth</td><td></td>
</tr>
<tr>
<td>scope</td><td>Additional Scope to be added to the standard Scope. This will be concatenated to to the scopr string. For Azure AD start with a + sign
</td>
</tr>
<tr>
<td>tenantid</td><td>The tenant ID you want to restrict to, leave blank for no tenant.
</td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>login</td><td>This event will be fired when a login occurs :
	Check out.error and out.message  for login errors
	The out.user will be user logged in
</td>
</tr>
</table>



