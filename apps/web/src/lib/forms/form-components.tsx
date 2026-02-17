import type { ReactElement } from 'react';
import { formatErrors, formatFormError } from './form-utils';

interface FieldRenderApi {
  name: string;
  state: {
    value: string;
    meta: {
      errors: readonly unknown[];
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

interface FormFieldProps {
  field: FieldRenderApi;
  label: string;
  type?: string;
}

export function FormField({ field, label, type = 'text' }: FormFieldProps): ReactElement {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={field.name} style={{ display: 'block', marginBottom: '0.25rem' }}>
        {label}
      </label>
      <input
        id={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          boxSizing: 'border-box',
        }}
      />
      {field.state.meta.errors.length > 0 && (
        <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {formatErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}

interface FormErrorBannerProps {
  errorMap: { onSubmit?: unknown };
}

export function FormErrorBanner({ errorMap }: FormErrorBannerProps): ReactElement | null {
  if (!errorMap.onSubmit) return null;
  return <p style={{ color: 'red', marginBottom: '1rem' }}>{formatFormError(errorMap.onSubmit)}</p>;
}

interface SubmitButtonProps {
  isSubmitting: boolean;
  loadingText: string;
  defaultText: string;
}

export function SubmitButton({
  isSubmitting,
  loadingText,
  defaultText,
}: SubmitButtonProps): ReactElement {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      style={{
        width: '100%',
        padding: '0.5rem',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
      }}
    >
      {isSubmitting ? loadingText : defaultText}
    </button>
  );
}
