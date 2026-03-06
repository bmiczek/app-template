import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatErrors, formatFormError } from '@/lib/forms/utils';
import type { ReactElement } from 'react';

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
  const hasErrors = field.state.meta.errors.length > 0;
  return (
    <div className="mb-4 space-y-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={hasErrors}
      />
      {hasErrors && (
        <p className="text-sm text-destructive">{formatErrors(field.state.meta.errors)}</p>
      )}
    </div>
  );
}

interface FormErrorBannerProps {
  errorMap: { onSubmit?: unknown };
}

export function FormErrorBanner({ errorMap }: FormErrorBannerProps): ReactElement | null {
  if (!errorMap.onSubmit) return null;
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{formatFormError(errorMap.onSubmit)}</AlertDescription>
    </Alert>
  );
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
    <Button type="submit" disabled={isSubmitting} className="w-full">
      {isSubmitting ? loadingText : defaultText}
    </Button>
  );
}
