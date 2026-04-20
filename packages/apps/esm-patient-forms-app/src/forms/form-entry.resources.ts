import { type HtmlFormEntryForm } from '@openmrs/esm-patient-common-lib';

import { type Form } from '../types';

const formEngineResourceName = 'formEngine';
const htmlformentryFormEngine = 'htmlformentry';
const uiStyleResourceName = 'uiStyle';
const uiStyleSimple = 'simple';

export function toHtmlForm(form: Form, htmlFormEntryForms: Array<HtmlFormEntryForm>): HtmlFormEntryForm | null {
  const isHtmlForm =
    htmlFormEntryForms?.some((hfeForm) => hfeForm.formUuid === form.uuid) ||
    form.resources?.some(
      (resource) => resource.name === formEngineResourceName && resource.valueReference === htmlformentryFormEngine,
    );

  if (!isHtmlForm) {
    return null;
  }

  const hfeForm = htmlFormEntryForms?.find((entry) => entry.formUuid === form.uuid);
  const simple = form.resources?.some((resource) => {
    return resource.name === uiStyleResourceName && resource.valueReference === uiStyleSimple;
  });

  return {
    formUuid: form.uuid,
    formName: hfeForm?.formName ?? form.display ?? form.name,
    formUiResource: hfeForm?.formUiResource,
    formUiPage: hfeForm?.formUiPage ?? (simple ? 'enterHtmlFormWithSimpleUi' : 'enterHtmlFormWithStandardUi'),
    formEditUiPage: hfeForm?.formEditUiPage ?? (simple ? 'editHtmlFormWithSimpleUi' : 'editHtmlFormWithStandardUi'),
  };
}
