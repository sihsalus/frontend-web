// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/spaceBetweenMainSectionsOnTheCanvasData";
import { Finding26Design1 } from "../../designs/figuras";
import './SpaceBetweenStyles.css';

const SpacingBetweenFinding26 = ({
  id
}: any) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  
  // Opciones que activan la selección
  const predefinedMarkedOptions = [26];
  
  // Verificar si la opción seleccionada es la 26 para activar el sombreado
  const shouldShade = predefinedMarkedOptions.includes(selectedOption);
  
  // Store useSpaceBetweenLegendsDataStore
  const intermediateSpaceOnTheCanvasOfFinding26 = useSpaceBetweenLegendsDataStore(
    (state: any) => state.intermediateSpaceOnTheCanvasOfFinding26
  );
  const toggleColorSpaceBetweenFinding26 = useSpaceBetweenLegendsDataStore(
    (state: any) => state.toggleColorSpaceBetweenFinding26
  );
  
  // Obtener los datos guardados para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding26?.find((item: any) => item.id === id);
  const findings = legend?.findings || [];
  
  const handleClick = () => {
    // Solo permitir el click si la opción seleccionada es 26
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenFinding26({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id,
    });
  };

  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg
      width="20"
      height="20"
      onClick={handleClick}
      style={{ cursor: shouldShade ? "pointer" : "default" }}
      className={shouldShade ? "interactive-svg" : ""}
    >
      {/* Fondo con sombreado si la opción seleccionada es 26 */}
      // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
      <rect
        width="20"
        height="20"
        fill={shouldShade ? "lightgray" : "white"}
        opacity="0.45"
      />
      
      {/* Renderiza los hallazgos de la opción 26 */}
      {findings.length > 0 && (
        <>
          {findings.map((finding: any) => <React.Fragment key={finding.uniqueId}>
            {finding.dynamicDesign === 1 && finding.color && (
              <Finding26Design1 strokeColor={finding.color.name} />
            )}
          </React.Fragment>)}
        </>
      )}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default SpacingBetweenFinding26;