// @ts-expect-error TS(6133): 'React' is declared but its value is never read.
import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/spaceBetweenMainSectionsOnTheCanvasData";
// @ts-expect-error TS(6133): 'Finding1Design4' is declared but its value is nev... Remove this comment to see the full error message
import { Finding1Design4, Finding1Design5, Finding1Design6, Finding2Design2, TwoHorizontalLines20x20 } from "../../designs/figuras";
import './SpaceBetweenStyles.css'
const SpaceBetweenFinding31 = ({
  id
}: any) => {
  // Store useDentalFormStore
  // @ts-expect-error TS(6133): 'isComplete' is declared but its value is never re... Remove this comment to see the full error message
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  // @ts-expect-error TS(6133): 'selectedSuboption' is declared but its value is n... Remove this comment to see the full error message
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  // @ts-expect-error TS(6133): 'selectedColor' is declared but its value is never... Remove this comment to see the full error message
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [31]; // Opciones que activan la selección

  // Store useSpaceBetweenLegendsDataStore CAMBIA
  const intermediateSpaceOnTheCanvasOfFinding31 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding31);
  // @ts-expect-error TS(6133): 'toggleColorSpaceBetweenFinding31' is declared but... Remove this comment to see the full error message
  const toggleColorSpaceBetweenFinding31 = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenFinding31);

  // Obtener el color guardado para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding31.find((item: any) => item.id === id);
  const storedColor = legend?.color;
  //console.log("storedColor space 31: " + JSON.stringify(storedColor))
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;
  /* const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding31({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  }; */

  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg
      width="20"
      height="20"
      //onClick={handleClick}
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

export default SpaceBetweenFinding31;