export const getDatabaseSaveMode = (): 'cli' | 'localStorage' => {
  return (process.env.REACT_APP_DATABASE_SAVE_MODE as any) || 'cli';
};
