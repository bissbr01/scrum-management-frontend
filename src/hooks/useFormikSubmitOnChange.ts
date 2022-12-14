import { useFormikContext } from 'formik'
import { isEqual, debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export function useFormikSubmitOnChange() {
  const formik = useFormikContext()
  const [lastValues, updateState] = useState(formik.values)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submitForm = useCallback(
    debounce(
      (): void => {
        formik.submitForm()
      },
      500,
      { maxWait: 1500 }
    ),
    []
  )

  useEffect(() => {
    const valuesEqualLastValues = isEqual(lastValues, formik.values)
    if (!valuesEqualLastValues) {
      updateState(formik.values)
    }

    if (!valuesEqualLastValues && formik.isValid) {
      formik.setSubmitting(true)
      submitForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values,
    formik.isValid,
    lastValues,
    formik.initialValues,
    formik.setSubmitting,
    submitForm,
  ])

  return { formik }
}
