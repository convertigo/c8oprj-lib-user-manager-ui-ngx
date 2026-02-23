


# lib_UserManager_ui_ngx

The lib_UserManager enables your projects to include user management and authentication in your apps. This library will handle :

- user login with user/password using a salted password security
- user login using OpenID




For more technical informations : [documentation](./project.md)

- [Installation](#installation)
- [Mobile Library](#mobile-library)
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
     lib_UserManager_ui_ngx=git@github.com:convertigo/c8oprj-lib-user-manager-ui-ngx.git:branch=8.4.0
     ```
     </td></tr>
     <tr><td>To simply use</td><td>

     ```
     lib_UserManager_ui_ngx=git@github.com:convertigo/c8oprj-lib-user-manager-ui-ngx/archive/8.4.0.zip
     ```
     </td></tr>
    </table>
3. Click the `Finish` button. This will automatically import the __lib_UserManager_ui_ngx__ project


## Mobile Library

### Shared Components

#### ConfirmAccount

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td>Provides the application name shown in account emails</td>
</tr>
<tr>
<td>imgUrl</td><td>Provides the logo URL shown in account emails</td>
</tr>
<tr>
<td>resetKey</td><td>Provides the reset token used by this flow</td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td>Emits an error event when the operation fails</td>
</tr>
<tr>
<td>PasswordChangedOk</td><td>Emits a success event when the operation completes</td>
</tr>
</table>

#### DeleteAccount

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td>Provides the application name shown in account emails</td>
</tr>
<tr>
<td>imgUrl</td><td>Provides the logo URL shown in account emails</td>
</tr>
<tr>
<td>moretext</td><td>Provides additional text shown in account emails</td>
</tr>
<tr>
<td>resetKey</td><td>Provides the reset token used by this flow</td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td>Emits an error event when the operation fails</td>
</tr>
<tr>
<td>PasswordChangedOk</td><td>Emits a success event when the operation completes</td>
</tr>
</table>

#### ForgotPassword

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>appName</td><td>Provides the application name shown in account emails</td>
</tr>
<tr>
<td>imgUrl</td><td>Provides the logo URL shown in account emails</td>
</tr>
<tr>
<td>resetKey</td><td>Provides the reset token used by this flow</td>
</tr>
</table>

**events**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>PasswordChangedError</td><td>Emits an error event when the operation fails</td>
</tr>
<tr>
<td>PasswordChangedOk</td><td>Emits a success event when the operation completes</td>
</tr>
</table>

#### LoginComponent

This component handles a login / password form.
And uses the lib_UserManager.

When a user is authenticated, the component fires the ''login'' event.
Use this event to close a modal page or route to an authenticated page.

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>enableAzureADLogin</td><td>Enable this to hide the Microsoft sign in option when needed</td>
</tr>
<tr>
<td>enableCreateAccount</td><td>Enable this to show the create account flow to users without an account</td>
</tr>
<tr>
<td>enableForgotPassword</td><td>Enable this to show the forgot password flow on the login screen</td>
</tr>
<tr>
<td>enableGoogleLogin</td><td>Enable this to hide the Google sign in option when needed</td>
</tr>
<tr>
<td>enableLDAPLogin</td><td>Enable this to show LDAP sign in on the login card</td>
</tr>
<tr>
<td>enableLinkedInLogin</td><td>Enable this to hide the LinkedIn sign in option when needed</td>
</tr>
<tr>
<td>enableOpenIDLogin</td><td>Enable this to show OpenID sign in on the login card</td>
</tr>
<tr>
<td>logoImage</td><td>Sets the logo shown above the authentication forms</td>
</tr>
<tr>
<td>logoWidth</td><td>Provides a configurable input for this shared component</td>
</tr>
<tr>
<td>openidAuthorizationEndpoint</td><td>Sets the OpenID authorization endpoint used during sign in</td>
</tr>
<tr>
<td>openidCallbackUrl</td><td>Defines the callback URL where the OpenID provider returns the user</td>
</tr>
<tr>
<td>openidClientID</td><td>Sets the OpenID client identifier used for authentication</td>
</tr>
<tr>
<td>openidResponseType</td><td>Defines the OpenID response type expected from the provider</td>
</tr>
<tr>
<td>openidScope</td><td>Defines the OpenID scopes requested for the user session</td>
</tr>
<tr>
<td>scope</td><td>Additional Scope to be added to the standard Scope. This will be concatenated to the scope string.
For Azure AD, start with a + sign.
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
<td>login</td><td>This event will be fired when a login occurs:
	Check out.error and out.message for login errors
	The out.user will be the logged-in user
</td>
</tr>
</table>



