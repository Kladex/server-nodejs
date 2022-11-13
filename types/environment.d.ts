declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      PORT?: string;
      SECRET_KEY: string;
    }
  }
}
export {};
