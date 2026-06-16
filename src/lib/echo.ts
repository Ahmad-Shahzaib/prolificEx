import Echo from "laravel-echo";
import Pusher from "pusher-js";

export function createEcho(token: string) {
  if (typeof window === "undefined") {
    return null;
  }

  (window as any).Pusher = Pusher;
  Pusher.logToConsole = true;

  const apiUrl = process.env.VITE_REVERB_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const key = process.env.VITE_REVERB_APP_KEY || process.env.NEXT_PUBLIC_REVERB_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "";
  const host = process.env.VITE_REVERB_HOST || process.env.NEXT_PUBLIC_REVERB_HOST || process.env.NEXT_PUBLIC_PUSHER_HOST || "";
  const scheme = process.env.VITE_REVERB_SCHEME || process.env.NEXT_PUBLIC_REVERB_SCHEME || process.env.NEXT_PUBLIC_PUSHER_SCHEME || "https";
  const envCluster = process.env.VITE_REVERB_CLUSTER || process.env.NEXT_PUBLIC_REVERB_CLUSTER || process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  const cluster = envCluster ?? (host ? "local" : undefined);
  const port = Number(process.env.VITE_REVERB_PORT || process.env.NEXT_PUBLIC_REVERB_PORT || process.env.NEXT_PUBLIC_PUSHER_PORT || (scheme === "https" ? "443" : "80"));
  const useTLS = scheme === "https";
  const transport = useTLS ? "wss" : "ws";
  const authEndpoint = apiUrl ? new URL("/api/broadcasting/auth", apiUrl).toString() : "/api/broadcasting/auth";
  const websocketUrl = host ? `${transport}://${host}:${port}/app/${key}` : "";

  const echoConfig: any = {
    broadcaster: "reverb",
    key,
    cluster,
    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
    enableStats: false,
    forceTLS: useTLS,
    encrypted: useTLS,
    enabledTransports: [transport],
  };

  if (host) {
    echoConfig.wsHost = host;
    echoConfig.wssHost = host;
    echoConfig.wsPort = port;
    echoConfig.wssPort = port;
    echoConfig.httpHost = host;
    echoConfig.httpsHost = host;
    echoConfig.httpPort = port;
    echoConfig.httpsPort = port;
  }

  if (!key) {
    console.error("Echo config missing key. Set VITE_REVERB_APP_KEY, NEXT_PUBLIC_REVERB_APP_KEY or NEXT_PUBLIC_PUSHER_APP_KEY.");
    return null;
  }

  if (!host && !envCluster) {
    console.error("Echo config missing host and cluster. Set VITE_REVERB_HOST, NEXT_PUBLIC_REVERB_HOST or NEXT_PUBLIC_REVERB_CLUSTER.");
    return null;
  }

  console.info("Echo config:", {
    apiUrl,
    key: key ? "***" : "",
    host,
    scheme,
    port,
    useTLS,
    transport,
    cluster: host ? undefined : envCluster,
    authEndpoint,
    websocketUrl,
    broadcaster: echoConfig.broadcaster,
  });

  return new Echo(echoConfig);
}
