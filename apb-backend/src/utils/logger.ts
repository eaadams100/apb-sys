export class Logger {
  static info(message: string, meta?: any) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || '');
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
  }

  static warn(message: string, meta?: any) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || '');
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta || '');
    }
  }

  static audit(action: string, userId: string, resource: string, details?: any) {
    console.log(`[AUDIT] ${new Date().toISOString()}: User ${userId} ${action} ${resource}`, details || '');
  }
}