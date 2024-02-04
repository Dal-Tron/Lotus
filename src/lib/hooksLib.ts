import { useState, ChangeEvent, useEffect } from "react";

type FormField = {
  [key: string]: string;
};

type FormFieldsHook = [
  FormField,
  (event: ChangeEvent<HTMLInputElement>) => void
];

export const useFormFields = (initialState: FormField): FormFieldsHook => {
  const [fields, setValues] = useState(initialState);
  return [
    fields,
    function (event) {
      setValues({
        ...fields,
        [event.target.name]: event.target.value,
      });
      return;
    },
  ];
};
