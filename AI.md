---
name: google-recaptcha-v3
description: Integrates Google reCAPTCHA v3 for invisible bot protection on forms with automatic token generation and management
keywords: recaptcha, captcha, google, security, form, bot protection, spam prevention
---

#### Google reCAPTCHA v3

***Purpose:***
Adds invisible Google reCAPTCHA v3 protection to your forms without requiring user interaction. The component loads the reCAPTCHA script, generates verification tokens, and exposes them for use in form submissions.

***Features:***
- Invisible protection with no user interaction required
- Automatic token refresh before expiration
- Exposes token as an internal variable for form submissions
- Configurable action name for context-specific risk analysis
- Debug mode for development

***Properties:***
- siteKey: string - Your Google reCAPTCHA v3 site key from the Google reCAPTCHA admin console
- action: string - The action name to associate with this verification (e.g., "login", "contact")
- autoRefresh: boolean - Whether to automatically refresh the token before it expires (default: true)
- refreshInterval: number - How often to refresh the token in seconds (60-110, default: 110)
- showDebugInfo: boolean - Whether to display debug information in the component (default: false)

***Events:***
- tokenGenerated: Triggered when a new reCAPTCHA token is generated. Payload: { "token": "generated-token-string" }
- error: Triggered when an error occurs during script loading or token generation. Payload: { "error": "error message" }

***Exposed Actions:***
- `executeRecaptcha`: Manually generate a new reCAPTCHA token
- `reset`: Reset the component and generate a new token

***Exposed Variables:***
- token: The current reCAPTCHA verification token (path: variables['current_element_uid-token'])

***Notes:***
- You must obtain a site key from the Google reCAPTCHA admin console (https://www.google.com/recaptcha/admin)
- To use the token in form submissions, reference the token variable in your form's submission logic
- Tokens are valid for 2 minutes, so the default refresh interval is set to 110 seconds
- For optimal security, use different action names for different forms or contexts
- The component is invisible to users and requires no interaction