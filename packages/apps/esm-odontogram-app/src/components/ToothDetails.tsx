// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React, { useState } from "react";
import "./ToothDetails.css";
import './spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenStyles.css'
import {
  // @ts-expect-error TS(6133): 'CircleDesign' is declared but its value is never ... Remove this comment to see the full error message
  CircleDesign, EllipseDesign, EllipseDesignLeft, EllipseDesignRight, EllipseDesignCenter,
  EllipseDesignLeftAndRight, Finding12Design1, Finding21Design1
} from "../designs/figuras";
import useDentalFormStore from "../store/dentalFormData";
import useDentalDataStore from "../store/dentalData";

// Se manejan los hallazgos 11 y 12
const ToothDetails = ({
  idTooth,
  initialText = "",
  legend = "Leyenda"
}: any) => {
  const [text, setText] = useState(initialText.toUpperCase());

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [11, 12, 21]; // Opciones que activan la selección

  // Store useDentalDataStore
  const teeth = useDentalDataStore((state: any) => state.teeth);
  const registerFinding = useDentalDataStore((state: any) => state.registerFinding);
  const removeFinding = useDentalDataStore((state: any) => state.removeFinding);

  // Obtener el diente
  const tooth = teeth.find((item: any) => item.id === idTooth);

  // Buscar los hallazgos específicos para cada opción
  const Finding11 = tooth?.findings.find((f: any) => f.optionId === 11);
  const Finding12 = tooth?.findings.find((f: any) => f.optionId === 12);
  const Finding21 = tooth?.findings.find((f: any) => f.optionId === 21);

  const handleTextChange = (e: any) => {
    // Convertir texto a mayúsculas y filtrar caracteres no permitidos
    const inputValue = e.target.value;
    const filteredValue = inputValue
      .replace(/[^a-zA-Z0-9\n]/g, '') // Solo permite letras, números y saltos de línea
      .toUpperCase(); // Convierte a mayúsculas
    
    setText(filteredValue);
  };

  const handleLegendClick = () => {
    // Verificar condiciones generales
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;

    // Obtener el hallazgo actual según la opción seleccionada usando switch
    let currentFinding;

    switch (selectedOption) {
      case 11:
        currentFinding = Finding11;
        break;
      case 12:
        currentFinding = Finding12;
        break;
      case 21:
        currentFinding = Finding21;
        break;
      default:
        return; // Salir si no hay un caso correspondiente
    }

    if (currentFinding) {
      // Si existe el hallazgo, lo eliminamos
      removeFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id
      });
    } else {
      // Si no existe, registramos uno nuevo
      registerFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id,
        color: selectedColor
      });
    }
  };

  // Determinar la clase CSS para el SVG
  const svgClassName = "tooth-details-legend interactive-svg";

  // Función auxiliar para renderizar diseños según el tipo de hallazgo
  const renderDesignForFinding = (optionId: any, finding: any) => {
    switch (optionId) {
      case 11:
        return (
          <>
            {finding.dynamicDesign === 1 && <EllipseDesignLeft strokeColor={finding.color.name} />}
            {finding.dynamicDesign === 2 && <EllipseDesignRight strokeColor={finding.color.name} />}
            {finding.dynamicDesign === 3 && <EllipseDesignLeftAndRight strokeColor={finding.color.name} />}
          </>
        );
      case 12:
        return (
          <>
            {finding.dynamicDesign === 1 && <Finding12Design1 strokeColor={finding.color.name} />}
          </>
        );
      case 21:
        return (
          <>
            {finding.dynamicDesign === 1 && <Finding21Design1 strokeColor={finding.color.name} />}
          </>
        );
      default:
        return null;
    }
  };

  return (
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <div className="tooth-details-container">
      {/* Findings - hallazgos */}
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div className="tooth-details-box">
        // @ts-expect-error TS(2339): Property 'textarea' does not exist on type 'JSX.In... Remove this comment to see the full error message
        <textarea
          value={text}
          onChange={handleTextChange}
          className="tooth-details-textarea"
          aria-label="Tooth details"
        />
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>

      {/* Legend - identificador de diente */}
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <svg
        width="60"
        height="30"
        onClick={handleLegendClick}
        className={svgClassName}
        style={{ cursor: "pointer" }}
        viewBox="0 0 60 30"
      >
        {/* Fondo con sombreado dependiendo de la opción seleccionada */}
        // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
        <rect
          width="60"
          height="30"
          fill={predefinedMarkedOptions.includes(selectedOption) ? "lightgray" : "white"}
        />

        // @ts-expect-error TS(2339): Property 'text' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
        <text
          x="30"
          y="20"
          fontSize="13"
          fill="black"
          textAnchor="middle"
          className="tooth-details-legend-text"
        >
          {legend}
        // @ts-expect-error TS(2339): Property 'text' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
        </text>

        {/* Renderiza los diseños de cada hallazgo usando un enfoque más modular */}

        {/* Hallazgo 11 */}
        {Finding11?.color && Finding11?.dynamicDesign && (
          <>
            {renderDesignForFinding(11, Finding11)}
          </>
        )}

        {/* Hallazgo 12 */}
        {Finding12?.color && Finding12?.dynamicDesign && (
          <>
            {renderDesignForFinding(12, Finding12)}
          </>
        )}
        {Finding21?.color && Finding21?.dynamicDesign && (
          <>
            {renderDesignForFinding(21, Finding21)}
          </>
        )}
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </svg>
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </div>
  );
};

export default ToothDetails;