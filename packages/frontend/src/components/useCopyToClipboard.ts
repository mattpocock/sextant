interface UseCopyToClipboardParams {
  onSuccess?: (name: string) => void;
  onError?: (name: string) => void;
}

/**
 * Use this hook to return a function which copies a string
 * to the user's clipboard
 */
export const useCopyToClipboard = ({
  onError,
  onSuccess,
}: UseCopyToClipboardParams) => {
  const copyToClipboard = (content: string) => {
    if (process.env.NODE_ENV === 'test') {
      onSuccess?.(content);
    } else {
      try {
        copyToUserClipboard(content);
        onSuccess?.(content);
      } catch (e) {
        console.error(e);
        onError?.(content);
      }
    }
  };
  return copyToClipboard;
};

export const copyToUserClipboard = (content: string) => {
  const dummyDiv = document.createElement('input');

  dummyDiv.value = content;

  document.body.appendChild(dummyDiv);

  dummyDiv.select();
  dummyDiv.setSelectionRange(0, 99999);

  document.execCommand('copy');
  document.body.removeChild(dummyDiv);
};
