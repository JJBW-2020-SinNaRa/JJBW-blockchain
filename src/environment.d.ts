/// <reference types="node" />
declare module NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: "production" | "staging" | "development" | "local";
  }
}
