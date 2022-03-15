export interface IServerTimingState {
  timeStart: (key: string) => void;
  timeEnd: (key: string) => void;
  time: (key: string, f: () => Promise<unknown>) => Promise<unknown>;
  timeSync: (key: string, f: () => unknown) => unknown;
}

export function createServerTimingMiddleware(opts?: { log: boolean }) {
  return async (context: any, next: () => Promise<unknown>) => {
    const timingValues = {} as Record<string, number>;
    context.state.timeStart = (key: string) => {
      timingValues[key] = Date.now();
    };
    context.state.timeEnd = (key: string) => {
      timingValues[key] = Date.now() - timingValues[key];
    };
    context.state.time = async (key: string, f: () => Promise<unknown>) => {
      context.state.timeStart(key);
      const res = await f();
      context.state.timeEnd(key);
      return res;
    };
    context.state.timeSync = (key: string, f: () => unknown) => {
      context.state.timeStart(key);
      const res = f();
      context.state.timeEnd(key);
      return res;
    };
    await next();
    const result = Object.keys(timingValues).reduce(
      (acc: string, key: string) => {
        const timing = timingValues[key];
        return acc + `${key};dur=${timing}, `;
      },
      "",
    );
    context.response.headers.set("Server-Timing", result);
    if (opts?.log) {
      console.log("Server-Timing:", result);
    }
  };
}
