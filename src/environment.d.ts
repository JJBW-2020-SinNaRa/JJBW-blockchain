/// <reference types="node" />
declare module NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: "production" | "staging" | "development" | "local";
    KAS_ID: string;
    KAS_SECRET: string;
    KAS_URL: string;
    NETWORK_ID: 1001 | 8217;
    CONTRACT_ADDRESS: string;
    PRI_KEY: string;
    API_ENDPOINT: string;
    GAS_LIMIT: string;
  }
}
