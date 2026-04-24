import { render } from '@testing-library/react';
import React from 'react';

import Root from './implementer-tools.component';

describe('ImplementerTools', () => {
  it('renders without dying', () => {
    render(<Root />);
  });
});
