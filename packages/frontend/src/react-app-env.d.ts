/// <reference types="react-scripts" />

import { ClassNamesExport } from 'classnames/types';

declare global {
  const classNames: ClassNamesExport;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly TARGET_DIR: string;
    readonly DATABASE_SAVE_MODE: 'cli' | 'localStorage' | 'searchParam';
  }
}
