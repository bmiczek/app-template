import type { FormValidateOrFn } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';

interface FormSubmitError {
  fields?: { [key: string]: string | undefined };
  form?: string;
}

interface UseAuthFormOptions<TValues> {
  defaultValues: TValues;
  schema: FormValidateOrFn<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
  mapError: (message: string) => FormSubmitError;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAuthForm<TValues>({
  defaultValues,
  schema,
  onSubmit,
  mapError,
}: UseAuthFormOptions<TValues>) {
  return useForm({
    defaultValues,
    validators: {
      onBlur: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred.';
        const mapped = mapError(message);
        if (mapped.fields) {
          const fields: Record<string, string> = {};
          for (const [k, v] of Object.entries(mapped.fields)) {
            if (v !== undefined) fields[k] = v;
          }
          return { fields };
        }
        return { form: mapped.form ?? message };
      }
    },
  });
}
