import MultipleSelector, { type Option } from '@/components/custom-ui/MultiSelect';
import { FieldContainer } from '@/components/forms/inputs/FieldContainer';
import { FieldError } from '@/components/forms/inputs/FieldError';
import { FieldLabel } from '@/components/forms/inputs/FieldLabel';
import { convertTagsToMultiselectOptions } from '@/lib/mutliselect';
import { type SelectOption } from '@/types';
import { type Tag } from '@/types/models/tag';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export interface MultiSelectFieldProps {
  required?: boolean;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  clearable?: boolean;
  value?: Option[];
  onChange?: (value: Option[]) => void;
  options: Tag[] | Option[] | SelectOption[];
}

export function MultiSelectField({ error, label, disabled, className, placeholder, options, value, onChange, required }: MultiSelectFieldProps) {
  const { t } = useLaravelReactI18n();
  const selectOptions = convertTagsToMultiselectOptions(options);
  return (
    <FieldContainer className={className}>
      <FieldLabel disabled={disabled} label={label} required={required} />
      <MultipleSelector
        badgeClassName="[&_svg]:cursor-pointer"
        value={value ?? []}
        onChange={onChange}
        disabled={disabled}
        defaultOptions={selectOptions}
        placeholder={placeholder}
        emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('No results')}</p>}
      />
      <FieldError error={error} />
    </FieldContainer>
  );
}
