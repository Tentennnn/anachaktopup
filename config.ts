interface AppConfig {
  name: string;
  description: string;
  discordWebhookUrl: string;
  adminPassword: string;
  requestFramePermissions: string[];
}

export const config: AppConfig = {
  "name": "ANACHAK-MC Server Website",
  "description": "A website and webstore for the ANACHAK-MC Minecraft server, allowing players to view server information and purchase in-game ranks and coins.",
  "discordWebhookUrl": "https://discord.com/api/webhooks/1405196123727204352/-YXEOIk-Zr4Kw2E9llxk5QE1UZnE07B5IU5XGi19IJCSU6AXJSsVYRhzPQu5E2XmXmhH",
  "adminPassword": "kiminato855867",
  "requestFramePermissions": []
};
