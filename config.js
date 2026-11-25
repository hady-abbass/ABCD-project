// config.js: the only file you need to edit for settings.
const CONFIG = {
  // Your local emergency number. It is shown on every page.
  emergencyNumber: "[your local emergency number]",

  ai: {
    enabled: true,
    // Option A (quick test): put your Gemini key in apiKey and keep this Gemini endpoint.
    // Option B (public site, recommended): put your Worker URL in endpoint and set apiKey to "".
    endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    apiKey: "AQ.Ab8RN6JEPbqkCITylc6bOGcG5ubAvh_mbMXAvK0g8nIEkMEr2Q",
    model: "gemini-2.5-flash",
    maxTokens: 500,
    temperature: 0.3
  }
};
