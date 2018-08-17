export const FORMS_REFRESH = "FORMS_REFRESH";

export function refreshForms(forms) {
  return {
    type: FORMS_REFRESH,
    forms
  };
};