export type HttpLogger = {
  info(fields: Record<string, unknown>, message: string): void;
};
