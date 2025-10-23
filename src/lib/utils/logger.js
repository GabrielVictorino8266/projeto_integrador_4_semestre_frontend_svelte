export const logger = {
  info(message, ...optional) {
    console.info(`[INFO] ${formatMessage(message)}`, ...optional);
  },

  warn(message, ...optional) {
    console.warn(`[WARN] ${formatMessage(message)}`, ...optional);
  },

  debug(message, ...optional) {
    console.debug(`[DEBUG] ${formatMessage(message)}`, ...optional);
  },

  error(error, ...optional) {
    if (error instanceof Error) {
      console.error(
        `[ERROR] ${error.stack}`,
        ...optional
      );
    } else {
      console.error(`[ERROR] ${formatMessage(error)}`, ...optional);
    }
  },
};

// helper to format messages with line info if available
function formatMessage(message) {
  try {
    const err = new Error();
    const stackLine = err.stack?.split('\n')[3]?.trim(); // caller line
    const location = stackLine?.replace(/^at\s+/, '') || 'unknown';
    return `${message} (${location})`;
  } catch {
    return message;
  }
}
