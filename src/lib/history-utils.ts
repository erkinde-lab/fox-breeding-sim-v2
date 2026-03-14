import { Fox } from "./genetics";

export function appendHistory(fox: Fox, event: string, details: string): Fox {
  return {
    ...fox,
    history: [
      ...(fox.history || []),
      {
        date: new Date().toISOString(),
        event,
        details
      }
    ]
  };
}
