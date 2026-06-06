/* eslint-disable no-console */
/**
 * Centralized, dependency-free logger. There is no analytics and no remote sink
 * by design (see CLAUDE.md): logs are local and development-only. Everything in
 * the app logs through here so output is consistent and easy to silence.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function emit(level: LogLevel, scope: string, message: string, meta?: unknown): void {
  if (!__DEV__) return;
  const line = `[${scope}] ${message}`;
  const extra = meta === undefined ? '' : meta;
  if (level === 'error') console.error(line, extra);
  else if (level === 'warn') console.warn(line, extra);
  else console.log(line, extra);
}

export interface Logger {
  debug(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

export function createLogger(scope: string): Logger {
  return {
    debug: (message, meta) => emit('debug', scope, message, meta),
    info: (message, meta) => emit('info', scope, message, meta),
    warn: (message, meta) => emit('warn', scope, message, meta),
    error: (message, meta) => emit('error', scope, message, meta),
  };
}
