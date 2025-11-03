<template>
  <div class="google-recaptcha-v3">
    <div v-if="showDebugInfo" class="debug-info">
      <div class="status">Status: {{ scriptStatus }}</div>
      <div class="token">Token: {{ token ? (token.substring(0, 10) + '...') : 'None' }}</div>
      <div v-if="error" class="error">Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  props: {
    content: { 
      type: Object, 
      required: true 
    },
    uid: { 
      type: String, 
      required: true 
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Editor state
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Component state
    const scriptStatus = ref('initializing');
    const scriptLoaded = ref(false);
    const error = ref(null);
    const recaptchaId = ref(null);
    const refreshTimerId = ref(null);

    // Internal variable for the token
    const { value: token, setValue: setToken } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'token',
      type: 'string',
      defaultValue: ''
    });

    const { value: valid, setValue: setValid } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'valid',
      type: 'boolean',
      defaultValue: false,
    });

    // Computed properties
    const siteKey = computed(() => props.content?.siteKey || '');
    const action = computed(() => props.content?.action || 'homepage');
    const autoRefresh = computed(() => props.content?.autoRefresh !== false);
    const refreshInterval = computed(() => {
      const interval = parseInt(props.content?.refreshInterval || 110, 10);
      // Google tokens expire after 2 minutes, so ensure refresh happens before that
      return Math.min(Math.max(interval, 60), 110) * 1000;
    });
    const showDebugInfo = computed(() => props.content?.showDebugInfo === true);

    // Load the reCAPTCHA script
    const loadRecaptchaScript = () => {
      if (!siteKey.value) {
        scriptStatus.value = 'error';
        error.value = 'Site key is required';
        emit('trigger-event', {
          name: 'error',
          event: { error: 'Site key is required' }
        });
        return;
      }

      scriptStatus.value = 'loading';
      error.value = null;

      // Check if script is already loaded
      if (window.grecaptcha && window.grecaptcha.ready) {
        scriptLoaded.value = true;
        scriptStatus.value = 'loaded';
        initializeRecaptcha();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey.value)}`;
      script.async = true;
      script.defer = true;

      // Handle script load events
      script.onload = () => {
        scriptLoaded.value = true;
        scriptStatus.value = 'loaded';
        initializeRecaptcha();
      };

      script.onerror = () => {
        scriptStatus.value = 'error';
        error.value = 'Failed to load reCAPTCHA script';
        emit('trigger-event', {
          name: 'error',
          event: { error: 'Failed to load reCAPTCHA script' }
        });
      };

      // Add script to document
      document.head.appendChild(script);
    };

    // Initialize reCAPTCHA and get token
    const initializeRecaptcha = () => {
      if (!window.grecaptcha || !window.grecaptcha.ready) {
        scriptStatus.value = 'error';
        error.value = 'reCAPTCHA not available';
        return;
      }

      window.grecaptcha.ready(() => {
        executeRecaptcha();
        
        // Set up auto-refresh if enabled
        if (autoRefresh.value) {
          setupTokenRefresh();
        }
      });
    };

    // Execute reCAPTCHA to get a token
    const executeRecaptcha = async () => {
      if (!window.grecaptcha || !siteKey.value) return;

      try {
        scriptStatus.value = 'executing';
        const newToken = await window.grecaptcha.execute(siteKey.value, { action: action.value });
        setToken(newToken);
        setValid(true); // ✅ mark as valid

        scriptStatus.value = 'success';
        emit('trigger-event', {
          name: 'tokenGenerated',
          event: { token: newToken }
        });
      } catch (err) {
        scriptStatus.value = 'error';
        error.value = err.message || 'Failed to execute reCAPTCHA';
        setValid(false); // ❌ mark as invalid
        emit('trigger-event', {
          name: 'error',
          event: { error: error.value }
        });
      }
    };


    // Set up token refresh
    const setupTokenRefresh = () => {
      // Clear any existing timer
      if (refreshTimerId.value) {
        clearInterval(refreshTimerId.value);
      }

      // Set new timer
      refreshTimerId.value = setInterval(() => {
        executeRecaptcha();
      }, refreshInterval.value);
    };

    // Reset the component
    const reset = () => {
      setToken('');
      setValid(false);
      executeRecaptcha();
    };


    // Watch for changes to key properties
    watch([siteKey, action], () => {
      if (scriptLoaded.value) {
        executeRecaptcha();
      } else if (siteKey.value) {
        loadRecaptchaScript();
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      if (siteKey.value) {
        loadRecaptchaScript();
      } else {
        scriptStatus.value = 'waiting';
      }
    });

    onBeforeUnmount(() => {
      if (refreshTimerId.value) {
        clearInterval(refreshTimerId.value);
      }
    });

    return {
      token,
      valid,
      scriptStatus,
      error,
      showDebugInfo,
      reset,
      executeRecaptcha
    };
  }
};
</script>

<style lang="scss" scoped>
  .google-recaptcha-v3 {
    width: 100%;
    min-height: 20px;
    position: relative;

    .debug-info {
      padding: 8px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      background-color: #f5f5f5;

      .status {
        margin-bottom: 4px;
      }

      .token {
        word-break: break-all;
        margin-bottom: 4px;
      }

      .error {
        color: #d32f2f;
      }
    }
  }
</style>