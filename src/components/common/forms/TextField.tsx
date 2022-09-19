import { TextInput } from '@mantine/core'
import { FieldProps } from 'formik'

export interface TextProps extends FieldProps {
  label: string
  placeholder: string
  required?: boolean
}

export default function TextField({
  field,
  label,
  placeholder,
  form,
  required = false,
}: TextProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      {...field}
    />
  )
}