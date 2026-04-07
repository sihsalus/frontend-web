import React from 'react';
import AdultUpperTeeth from './components/AdultUpperTeeth';
import FormDentalClinicalFindings from './components/FormDentalClinicalFindings';

// TODO: implement lower and deciduous quadrants
// import AdultLowerTeeth from './components/AdultLowerTeeth';
// import KidUpperTeeth from './components/KidUpperTeeth';
// import KidLowerTeeth from './components/KidLowerTeeth';

const sectionLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#525252',
  marginBottom: '0.25rem',
  marginTop: '1rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const divider: React.CSSProperties = {
  borderTop: '1px dashed #c6c6c6',
  margin: '0.75rem 0',
};

export default function App() {
  return (
    <div style={{ padding: '1rem 0' }}>
      <FormDentalClinicalFindings />

      <div style={sectionLabel}>Dientes permanentes — arcada superior (11–28)</div>
      <AdultUpperTeeth />

      <div style={divider} />

      <div style={sectionLabel}>Dientes permanentes — arcada inferior (31–48)</div>
      {/* AdultLowerTeeth pendiente de implementación */}
      <div style={{ color: '#a8a8a8', fontSize: '0.875rem', padding: '0.5rem 0' }}>
        Cuadrantes 3 y 4 — próximamente
      </div>

      <div style={divider} />

      <div style={sectionLabel}>Dientes deciduos — superior (51–65) e inferior (71–85)</div>
      {/* KidUpperTeeth / KidLowerTeeth pendiente de implementación */}
      <div style={{ color: '#a8a8a8', fontSize: '0.875rem', padding: '0.5rem 0' }}>
        Dentición decidua — próximamente
      </div>
    </div>
  );
}
