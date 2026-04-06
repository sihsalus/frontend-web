// @ts-expect-error TS(6133): 'React' is declared but its value is never read.
import React from "react";

const FormComponent = () => {
  return (
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <div style={{ width: "1000px", fontFamily: "Arial, sans-serif", marginTop: "10px" }}>
      {/* Resumen */}
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div style={styles.container}>
        // @ts-expect-error TS(2339): Property 'label' does not exist on type 'JSX.Intri... Remove this comment to see the full error message
        <label style={styles.label}><strong>Resumen</strong></label>
        // @ts-expect-error TS(2339): Property 'textarea' does not exist on type 'JSX.In... Remove this comment to see the full error message
        <textarea style={styles.input}></textarea>
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>

      {/* Especificaciones */}
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div style={styles.container}>
        // @ts-expect-error TS(2339): Property 'label' does not exist on type 'JSX.Intri... Remove this comment to see the full error message
        <label style={styles.label}><strong>Especificaciones:</strong></label>
        // @ts-expect-error TS(2339): Property 'textarea' does not exist on type 'JSX.In... Remove this comment to see the full error message
        <textarea style={styles.input}></textarea>
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>

      {/* Observaciones */}
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div style={styles.container}>
        // @ts-expect-error TS(2339): Property 'label' does not exist on type 'JSX.Intri... Remove this comment to see the full error message
        <label style={styles.label}><strong>Observaciones:</strong></label>
        // @ts-expect-error TS(2339): Property 'textarea' does not exist on type 'JSX.In... Remove this comment to see the full error message
        <textarea style={styles.input}></textarea>
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </div>
  );
};

// Estilos en línea para replicar la apariencia
const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    height: "80px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "14px",
  }
};

export default FormComponent;
