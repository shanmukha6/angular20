export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiKey: 'dev-api-key',
  appName: 'Angular Starter Pack',
  version: '1.0.0',
  enableDebug: true,
  aiChatbotConfig: {
    apiUrl: 'http://localhost:3000/api/chat',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000
  }
};