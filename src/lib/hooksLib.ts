import { useState, ChangeEvent } from "react";

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

// export const useMediaQuery = (mediaQueryString) => {
//   const [matches, setMatches] = useState(null)

//   useEffect(() => {
//     const mediaQueryList = window.matchMedia(mediaQueryString)
//     const listener = () => setMatches(!!mediaQueryList.matches)
//     listener()
//     mediaQueryList.addEventListener('change', listener)
//     return () => mediaQueryList.removeEventListener('change', listener)
//   }, [mediaQueryString])

//   return matches
// }
