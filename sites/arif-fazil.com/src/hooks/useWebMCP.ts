import { useEffect } from 'react';

export type WebMCPTool = {
  name: string;
  description: string;
  inputSchema?: any;
  execute: (input: any) => any;
  readonly?: boolean;
};

declare global {
  interface Window {
    arifosWebMCP?: {
      registerReadonly: (name: string, description: string, schema: any, execute: Function) => void;
      registerStateful: (name: string, description: string, schema: any, execute: Function) => void;
      getRegisteredTools?: () => Array<{ name: string; description: string; readonly: boolean }>;
    };
  }
}

export function useWebMCP(tools: WebMCPTool[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const arifosWebMCP = window.arifosWebMCP;
    if (!arifosWebMCP) return;

    const registeredNames: string[] = [];
    const existingTools = arifosWebMCP.getRegisteredTools?.() || [];

    tools.forEach((t) => {
      const alreadyRegistered = existingTools.some((rt) => rt.name === t.name);

      if (!alreadyRegistered) {
        const registerFn = t.readonly === false 
          ? arifosWebMCP.registerStateful 
          : arifosWebMCP.registerReadonly;

        if (registerFn) {
          registerFn(
            t.name,
            t.description,
            t.inputSchema || { type: 'object', properties: {}, required: [] },
            t.execute
          );
          registeredNames.push(t.name);
        }
      }
    });

    if (registeredNames.length > 0) {
      console.log(`[WebMCP Dynamic] Registered tools: ${registeredNames.join(', ')}`);
    }
  }, [tools]);
}
