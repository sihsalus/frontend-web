// @ts-expect-error TS(6133): 'React' is declared but its value is never read.
import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/spaceBetweenMainSectionsOnTheCanvasData";
import { TwoHorizontalLines20x20 } from "../../designs/figuras";
import './SpaceBetweenStyles.css'
const SpaceBetweenFinding32 = ({
  id
}: any) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [32]; // Opciones que activan la selección

  // Store useSpaceBetweenLegendsDataStore CAMBIA
  const intermediateSpaceOnTheCanvasOfFinding32 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding32);
  const toggleColorSpaceBetweenFinding32 = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenFinding32);

  // Obtener el color guardado para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding32.find((item: any) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding32({
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
      height="20"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className="interactive-svg"
    >
      {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
      // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
      <rect
        width="20"
        height="20"
        fill={predefinedMarkedOptions.includes(selectedOption) ? "lightgray" : "white"}
      />

      {/* Si tiene un color guardado, dibuja el diseño correspondiente */}
      {storedColor && intermediateSpaceOnTheCanvasOfFinding1DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 1 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
        </>
      )}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default SpaceBetweenFinding32;