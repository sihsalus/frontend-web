// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/spaceBetweenMainSectionsOnTheCanvasData";
// @ts-expect-error TS(6133): 'Finding7Design1' is declared but its value is nev... Remove this comment to see the full error message
import { Finding6Design1, Finding7Design1, Finding7Design2 } from "../../designs/figuras";
import './SpaceBetweenStyles.css';

const SpaceBetweenTeeth = ({
  idIntermediateSpaceOnTheCanvasOfFinding7,
  idIntermediateSpaceOnTheCanvasOfFinding6
}: any) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  
  // Opciones que activan el sombreado
  const shadingOptions = [6, 7];
  // Opciones que permiten la selección con click
  const clickableOptions = [6];
  
  // Store useSpaceBetweenLegendsDataStore
  const intermediateSpaceOnTheCanvasOfFinding7 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding7);
  const intermediateSpaceOnTheCanvasOfFinding6 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding6);
  const toggleColorSpaceBetweenFinding6 = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenFinding6);
  
  // Obtener los datos guardados para este espacio (opción 7)
  const legend7 = intermediateSpaceOnTheCanvasOfFinding7.find((item: any) => item.id === idIntermediateSpaceOnTheCanvasOfFinding7);
  const storedColor7 = legend7?.color;
  const dynamicDesign7 = legend7?.dynamicDesign;
  
  // Obtener los datos guardados para este espacio (opción 6)
  const legend6 = intermediateSpaceOnTheCanvasOfFinding6.find((item: any) => item.id === idIntermediateSpaceOnTheCanvasOfFinding6);
  const findings6 = legend6?.findings || [];
  
  const handleClick = () => {
    // Solo permitir el click si la opción seleccionada está en clickableOptions (solo el 6)
    if (!isComplete || !clickableOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenFinding6({
      idIntermediateSpaceOnTheCanvasOfFinding6,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id,
    });
  };

  // Determinar si se debe sombrear (opción 6 o 7)
  const shouldShade = shadingOptions.includes(selectedOption);
  // Determinar si es interactivo (solo opción 6)
  const isInteractive = clickableOptions.includes(selectedOption);

  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg
      width="20"
      height="60"
      onClick={handleClick}
      style={{ cursor: isInteractive ? "pointer" : "default" }}
      className={isInteractive ? "interactive-svg" : ""}
    >
      {/* Fondo con sombreado si la opción seleccionada está en shadingOptions */}
      // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
      <rect
        width="20"
        height="60"
        fill={shouldShade ? "lightgray" : "white"}
        opacity="0.45"
      />
      
      {/* Renderiza los hallazgos de la opción 7 */}
      {storedColor7 && dynamicDesign7 && (
        <>
          {dynamicDesign7 === 1 && (
            <Finding7Design2 strokeColor={storedColor7.name} />
          )}
        </>
      )}
      
      {/* Renderiza los hallazgos de la opción 6 */}
      {findings6.length > 0 && (
        <>
          {findings6.map((finding: any) => <React.Fragment key={finding.uniqueId}>
            {finding.dynamicDesign === 1 && finding.color && (
              <Finding6Design1 strokeColor={finding.color.name} />
            )}
          </React.Fragment>)}
        </>
      )}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default SpaceBetweenTeeth;