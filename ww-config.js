export default {
  editor: {
    label: {
      en: "Google reCAPTCHA v3",
    },
    icon: "shield-check",
  },
  properties: {
    /* wwEditor:start */
    form: {
      editorOnly: true,
      hidden: true,
      defaultValue: false,
    },
    formInfobox: {
      type: "InfoBox",
      section: "settings",
      options: (_, sidePanelContent) => ({
        variant: sidePanelContent.form?.name ? "success" : "warning",
        icon: "pencil",
        title: sidePanelContent.form?.name || "Unnamed form",
        content:
          !sidePanelContent.form?.name && "Give your form a meaningful name.",
      }),
      hidden: (_, sidePanelContent) => !sidePanelContent.form?.uid,
    },
    /* wwEditor:end */

    fieldName: {
      label: "Field name",
      section: "settings",
      type: "Text",
      defaultValue: "",
      bindable: true,
      hidden: (_, sidePanelContent) => !sidePanelContent.form?.uid,
    },

    customValidation: {
      label: "Custom validation",
      section: "settings",
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      hidden: (_, sidePanelContent) => !sidePanelContent.form?.uid,
    },

    validation: {
      label: "Validation",
      section: "settings",
      type: "Formula",
      defaultValue: "",
      bindable: false,
      hidden: (content, sidePanelContent) =>
        !sidePanelContent.form?.uid || !content.customValidation,
    },
    siteKey: {
      label: { en: "Site Key" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          "Your Google reCAPTCHA v3 site key from the Google reCAPTCHA admin console",
      },
      propertyHelp: {
        tooltip:
          "Enter your Google reCAPTCHA v3 site key. You can get one from the Google reCAPTCHA admin console.",
      },
      /* wwEditor:end */
    },
    action: {
      label: { en: "Action Name" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "homepage",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          'The action name to associate with this reCAPTCHA verification (e.g., "login", "contact", "submit")',
      },
      propertyHelp: {
        tooltip:
          "Specify an action name that identifies the form or page where this reCAPTCHA is used. This helps Google provide more accurate risk analysis.",
      },
      /* wwEditor:end */
    },
    autoRefresh: {
      label: { en: "Auto Refresh Token" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip:
          "Whether to automatically refresh the reCAPTCHA token before it expires",
      },
      propertyHelp: {
        tooltip:
          "When enabled, the component will automatically refresh the token before it expires (tokens are valid for 2 minutes).",
      },
      /* wwEditor:end */
    },
    refreshInterval: {
      label: { en: "Refresh Interval (seconds)" },
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: 110,
      options: {
        min: 60,
        max: 110,
        step: 1,
      },
      hidden: (content) => !content.autoRefresh,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip:
          "The interval in seconds to refresh the token (60-110 seconds)",
      },
      propertyHelp: {
        tooltip:
          "Set how often the token should be refreshed. Google reCAPTCHA tokens expire after 2 minutes, so this should be less than 120 seconds.",
      },
      /* wwEditor:end */
    },
    showDebugInfo: {
      label: { en: "Show Debug Info" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Whether to display debug information in the component",
      },
      propertyHelp: {
        tooltip:
          "When enabled, shows the current status and token information. Useful during development but should be disabled in production.",
      },
      /* wwEditor:end */
    },
  },
  triggerEvents: [
    {
      name: "tokenGenerated",
      label: { en: "On token generated" },
      event: { token: "" },
    },
    {
      name: "error",
      label: { en: "On error" },
      event: { error: "" },
    },
  ],
  actions: [
    {
      action: "executeRecaptcha",
      label: { en: "Generate new token" },
    },
    {
      action: "reset",
      label: { en: "Reset" },
    },
  ],
};
