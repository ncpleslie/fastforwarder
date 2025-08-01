import { NAME } from "../constants";

/**
 * Custom logger that prefixes logs with the application name.
 */
export const logger = {
  debug: (...args: unknown[]) => console.debug(`[${NAME}]`, ...args),
  info: (...args: unknown[]) => console.info(`[${NAME}]`, ...args),
  warn: (...args: unknown[]) => console.warn(`[${NAME}]`, ...args),
  error: (...args: unknown[]) => console.error(`[${NAME}]`, ...args),
};
