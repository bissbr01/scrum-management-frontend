import { InputVariant, TextInput } from '@mantine/core'
import { FieldProps } from 'formik'

export interface TextProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
}

export default function TextField({
  label,
  placeholder,
  variant,
  required = false,
  field,
  form,
}: TextProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      {...field}
    />
  )
}
