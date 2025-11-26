export const logger = {
  info(message, ...optional) {
    console.info(
      `\x1b[36m[INFO]\x1b[0m ${formatMessage(message)}`,
      ...optional,
    );
  },

  warn(message, ...optional) {
    console.warn(
      `\x1b[33m[WARN]\x1b[0m ${formatMessage(message)}`,
      ...optional,
    );
  },

  debug(message, ...optional) {
    console.debug(
      `\x1b[35m[DEBUG]\x1b[0m ${formatMessage(message)}`,
      ...optional,
    );
  },

  error(error, ...optional) {
    if (error instanceof Error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${error.stack}`, ...optional);
    } else {
      console.error(
        `\x1b[31m[ERROR]\x1b[0m ${formatMessage(error)}`,
        ...optional,
      );
    }
  },

  success(message, ...optional) {
    console.log(
      `\x1b[32m[SUCCESS]\x1b[0m ${formatMessage(message)}`,
      ...optional,
    );
  },
};

function formatMessage(message) {
  try {
    const err = new Error();
    const stackLine = err.stack?.split("\n")[3]?.trim();
    const location = stackLine?.replace(/^at\s+/, "") || "unknown";
    return `${message} \x1b[90m(${location})\x1b[0m`;
  } catch {
    return message;
  }
}
