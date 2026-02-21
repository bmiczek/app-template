export function formatErrors(errors: readonly unknown[]): string {
  return errors
    .map((e) => {
      if (typeof e === 'string') return e;
      if (typeof e === 'object' && e !== null && 'message' in e) {
        return String((e as { message: unknown }).message);
      }
      return String(e);
    })
    .join(', ');
}

export function formatFormError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return formatErrors(error);
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An error occurred.';
}
