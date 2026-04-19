import { LogLevel, PublicClientApplication, type Configuration } from "@azure/msal-browser";

export function isAzureAdConfigured(): boolean {
  return Boolean(import.meta.env.VITE_AZURE_CLIENT_ID && import.meta.env.VITE_AZURE_TENANT_ID);
}

let pca: PublicClientApplication | null = null;
let initPromise: Promise<void> | null = null;

export async function getAzureMsal(): Promise<PublicClientApplication | null> {
  if (!isAzureAdConfigured()) return null;
  if (!pca) {
    const cfg: Configuration = {
      auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID as string}`,
        redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
      },
      cache: { cacheLocation: "sessionStorage" },
      system: {
        loggerOptions: { logLevel: LogLevel.Error },
      },
    };
    pca = new PublicClientApplication(cfg);
    initPromise = pca.initialize();
  }
  if (initPromise) await initPromise;
  return pca;
}
