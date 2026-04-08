import LoggerInterface from './LoggerInterface.js';

class NoopLogger implements LoggerInterface {
  log(): void {}

  logSingleLine(): void {}

  clearSingleLine(): void {}
}

export default NoopLogger;
