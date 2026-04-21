import { renderHook } from '@testing-library/react';

import useFormSchema from './useFormSchema';

jest.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: jest.fn(),
  restBaseUrl: '/ws/rest/v1',
}));

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

import useSWR from 'swr';

const mockUseSWR = jest.mocked(useSWR);

describe('useFormSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.schema).toBeUndefined();
  });

  it('returns schema with encounterType UUID extracted', () => {
    mockUseSWR.mockReturnValue({
      data: {
        data: {
          uuid: 'form-uuid',
          name: 'Test Form',
          encounterType: { uuid: 'enc-type-uuid', display: 'Visit Note' },
          pages: [],
        },
      },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.schema).toBeDefined();
    expect(result.current.schema.encounterType).toBe('enc-type-uuid');
  });

  it('normalizes legacy concept UUIDs in nested schema questions', () => {
    mockUseSWR.mockReturnValue({
      data: {
        data: {
          uuid: 'form-uuid',
          name: 'Test Form',
          encounterType: { uuid: 'enc-type-uuid', display: 'Visit Note' },
          pages: [
            {
              label: 'Page 1',
              sections: [
                {
                  label: 'Section 1',
                  questions: [
                    {
                      id: 'chief-complaint',
                      type: 'obs',
                      label: 'Chief complaint',
                      questionOptions: {
                        rendering: 'text',
                        concept: '5219AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'subjective',
                      type: 'obs',
                      label: 'Subjective',
                      questionOptions: {
                        rendering: 'text',
                        concept: '160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'plan',
                      type: 'obs',
                      label: 'Plan',
                      questionOptions: {
                        rendering: 'text',
                        concept: '159615AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'lab-orders',
                      type: 'obs',
                      label: 'Lab orders',
                      questionOptions: {
                        rendering: 'text',
                        concept: '1271AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'procedures',
                      type: 'obs',
                      label: 'Procedures',
                      questionOptions: {
                        rendering: 'text',
                        concept: '1651AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'prescriptions',
                      type: 'obs',
                      label: 'Prescriptions',
                      questionOptions: {
                        rendering: 'text',
                        concept: '1282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                    {
                      id: 'referral',
                      type: 'obs',
                      label: 'Referral',
                      questionOptions: {
                        rendering: 'text',
                        concept: '1272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));

    expect(result.current.schema?.pages[0].sections[0].questions[0].questionOptions.concept).toBe(
      '71b58cff-879b-4358-98d5-2165434d4324',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[1].questionOptions.concept).toBe(
      '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[2].questionOptions.concept).toBe(
      'c4010006-0000-4000-8000-000000000006',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[3].questionOptions.concept).toBe(
      '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[4].questionOptions.concept).toBe(
      '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[5].questionOptions.concept).toBe(
      '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    );
    expect(result.current.schema?.pages[0].sections[0].questions[6].questionOptions.concept).toBe(
      '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    );
  });

  it('returns error on fetch failure', () => {
    const testError = new Error('Network error');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: testError,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.error).toBe(testError);
  });

  it('passes null URL when formUuid is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    renderHook(() => useFormSchema(''));
    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });
});
