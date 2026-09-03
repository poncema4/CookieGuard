import { randomBytes } from "node:crypto";

export type Session = {
  id: string;
  username: string;
  createdAt: string;
};

const sessions = new Map<string, Session>();

export function createSession(username: string): Session {
  const session: Session = {
    id: randomBytes(32).toString("hex"),
    username,
    createdAt: new Date().toISOString(),
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string | undefined): Session | undefined {
  if (!sessionId) return undefined;
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string | undefined): boolean {
  if (!sessionId) return false;
  return sessions.delete(sessionId);
}

export function clearSessions(): void {
  sessions.clear();
}
