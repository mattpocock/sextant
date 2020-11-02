import { Database } from '@sextant-tools/core';
import { useHistory } from 'react-router-dom';
import { getDatabaseSaveMode } from './getDatabaseSaveMode';
import { getSearchParams } from './useSearchParams';

const SEARCH_PARAMS_KEY = 'd';

export const getBase64StringOfDatabase = (database: Database) => {
  return btoa(JSON.stringify(database));
};

export const getSearchParamsWithSavedDatabase = (database: Database) => {
  return assignToSearchParams(window.location.search, {
    [SEARCH_PARAMS_KEY]: getBase64StringOfDatabase(database),
  });
};

export const assignToSearchParams = (search: string, toAppend: {}) => {
  const searchParams = getSearchParams(search);
  return new URLSearchParams({
    ...searchParams,
    ...toAppend,
  }).toString();
};

export const clientSaveToDatabase = (
  database: Database,
  history: ReturnType<typeof useHistory>,
) => {
  switch (getDatabaseSaveMode()) {
    case 'localStorage':
      const newUrl = `/?${getSearchParamsWithSavedDatabase(database)}`;
      history.replace(newUrl);

      break;
    default:
      return fetch(`/api/saveToDatabase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(database),
      });
  }
};

export const clientLoadDatabase = (): Promise<Database | undefined> => {
  switch (getDatabaseSaveMode()) {
    case 'localStorage':
      try {
        return Promise.resolve(
          JSON.parse(
            atob(
              getSearchParams<{ [SEARCH_PARAMS_KEY]: string }>(
                window.location.search || '',
              )?.[SEARCH_PARAMS_KEY] || '',
            ),
          ),
        );
      } catch (e) {
        return Promise.resolve(undefined);
      }
    default:
      return fetch('/api/getDatabase').then((res) => res.json());
  }
};
