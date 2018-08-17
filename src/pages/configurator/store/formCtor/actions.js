export const FORM_CTOR_EXIT = "FORM_CTOR_EXIT";
export const FORM_CTOR_SET_STEP = "FORM_CTOR_SET_STEP";

export function formCtorExit() {
  return {
    type: FORM_CTOR_EXIT
  };
};

export function formCtorSetStep(step) {
  return {
    type: FORM_CTOR_SET_STEP,
    data: step
  };
}