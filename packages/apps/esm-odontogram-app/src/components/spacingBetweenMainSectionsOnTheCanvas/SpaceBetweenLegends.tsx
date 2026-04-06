// @ts-expect-error TS(6133): 'React' is declared but its value is never read.
import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/spaceBetweenMainSectionsOnTheCanvasData";
import { EllipseDesignCenter, EllipseDesignLeftCenter, EllipseDesignRightCenter } from "../../designs/figuras";
import './SpaceBetweenStyles.css'

const SpaceBetweenLegends = ({
  id
}: any) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [11, 12]; // Opciones que activan la selección
  
  // Store useSpaceBetweenLegendsDataStore
  const spaceBetweenLegends = useSpaceBetweenLegendsDataStore((state: any) => state.spaceBetweenLegends);
  const toggleColorSpaceBetweenLegends = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenLegends);
  
  // Obtener el color guardado para este espacio
  const legend = spaceBetweenLegends.find((item: any) => item.id === id);
  const storedColor = legend?.color;
  const spaceBetweenLegendsDynamicDesign = legend?.dynamicDesign;
  
  // Determinar si debe aplicarse la clase interactive-svg
  const svgClassName = selectedOption === 12 ? "" : "interactive-svg";
  
  // Verificar si el componente está deshabilitado (cuando selectedOption es 12)
  const isDisabled = selectedOption === 12;
  
  const handleClick = () => {
    // No ejecutar la función si está deshabilitado o no cumple las condiciones
    if (isDisabled || !isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenLegends({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  };
  
  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg
      width="20"
      height="30"
      onClick={handleClick}
      style={{ cursor: isDisabled ? "default" : "pointer" }}
      className={svgClassName}
    >
      {/* Fondo siempre blanco si está deshabilitado, de lo contrario sigue la lógica original */}
      // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
      <rect
        width="20"
        height="30"
        fill={isDisabled ? "white" : (predefinedMarkedOptions.includes(selectedOption) ? "lightgray" : "white")}
      />
      
      {/* Si tiene un color guardado y no está deshabilitado, dibuja el diseño correspondiente */}
      {storedColor && spaceBetweenLegendsDynamicDesign  && (
        <>
          {spaceBetweenLegendsDynamicDesign === 1 && (
            <EllipseDesignLeftCenter strokeColor={storedColor.name} />
          )}
          {spaceBetweenLegendsDynamicDesign === 2 && (
            <EllipseDesignRightCenter strokeColor={storedColor.name} />
          )}
          {spaceBetweenLegendsDynamicDesign === 3 && (
            <EllipseDesignCenter strokeColor={storedColor.name} />
          )}
        </>
      )}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default SpaceBetweenLegends;