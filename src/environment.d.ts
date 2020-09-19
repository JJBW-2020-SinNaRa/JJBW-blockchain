/// <reference types="node" />
declare module NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: "production" | "staging" | "development" | "local";
    KAS_ID: string;
    KAS_SECRET: string;
    KAS_URL: string;
    KAS_CHAIN: 1001 | 8217;
    CONTRACT_ADDRESS: string;
  }
}
