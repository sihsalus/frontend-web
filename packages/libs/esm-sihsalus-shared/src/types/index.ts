export interface OpenmrsResource {
  uuid: string;
  display?: string;
  [anythingElse: string]: unknown;
}

export interface OpenmrsEncounter extends OpenmrsResource {
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  patient: string;
  location: string;
  encounterProviders?: Array<{
    encounterRole: string;
    provider: { uuid: string; person: { uuid: string; display: string }; name: string };
    display?: string;
  }>;
  obs: Array<OpenmrsResource>;
  form?: { name: string; uuid: string };
  visit?: {
    visitType: {
      uuid: string;
      display: string;
    };
  };
  diagnoses?: Array<{
    uuid: string;
    diagnosis: { coded: { display: string } };
  }>;
}

export interface Observation {
  uuid: string;
  concept: {
    uuid: string;
    display?: string;
    conceptClass?: {
      uuid: string;
      display: string;
    };
    name?: {
      uuid: string;
      name: string;
    };
  };
  display?: string;
  groupMembers: null | Array<{
    uuid: string;
    concept: {
      uuid: string;
      display: string;
    };
    value: string | number | { uuid: string; display: string };
    display: string;
  }>;
  value:
    | string
    | number
    | { uuid: string; display: string; names?: Array<{ uuid: string; conceptNameType: string; name: string }> }
    | null;
  obsDatetime?: string;
}
