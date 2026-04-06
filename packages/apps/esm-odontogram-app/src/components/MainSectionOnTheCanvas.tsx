// @ts-expect-error TS(6192): All imports in import declaration are unused.
import React, { useState } from "react";
import "./ToothDetails.css";
import './spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenStyles.css'
import {
  Finding1Design1,
  Finding1Design2, Finding1Design3, Finding2Design1, Finding24Design1, Finding25Design1,
  Finding30Design1, Finding30Design2, Finding30Design3, TwoHorizontalLines60x20,
  Finding13Design1,
  Finding13Design2,
  Finding39Design2,
  Finding39Design3
} from "../designs/figuras";
import useDentalFormStore from "../store/dentalFormData";
import useDentalDataStore from "../store/dentalData";
// Se gestionan los diseños de hallazgos a nivel de diente, no a nivel de zona.
const MainSectionOnTheCanvas = ({
  idTooth,
  optionId
}: any) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const selectedDesign = useDentalFormStore((state: any) => state.selectedDesign);
  // Store useDentalDataStore
  const teeth = useDentalDataStore((state: any) => state.teeth);
  const registerFinding = useDentalDataStore((state: any) => state.registerFinding);
  const removeFinding = useDentalDataStore((state: any) => state.removeFinding);
  //const resumenSection = useDentalDataStore((state) => state.resumenSection);

  // Obtener el diente
  const tooth = teeth.find((item: any) => item.id === idTooth);

  // Buscar el hallazgo específico para la opción seleccionada
  const currentFinding = tooth?.findings.find(
    (f: any) => f.optionId === optionId
  );

  const handleLegendClick = () => {
    if (isComplete && optionId === selectedOption) {
      if (currentFinding) {
        // Si existe el hallazgo, lo eliminamos
        removeFinding({
          toothId: idTooth,
          optionId: selectedOption,
          subOptionId: selectedSuboption?.id,
          dynamicDesign: selectedDesign?.number
        });
      } else {
        // Si no existe, registramos uno nuevo
        registerFinding({
          toothId: idTooth,
          optionId: selectedOption,
          subOptionId: selectedSuboption?.id,
          color: selectedColor,
          design: selectedDesign?? null
        });
      }
    }
  };
  //console.log("teeth")
  //console.log(JSON.stringify(teeth))
  return (
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <div className="tooth-details-container">
      {/* Legend - identificador de diente */}
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <svg
        width="60"
        height="20"
        onClick={handleLegendClick}
        className="tooth-details-legend interactive-svg"
        viewBox="0 0 60 20"
      >
        {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
        // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
        <rect
          width="60"
          height="20"
          fill={selectedOption === optionId ? "lightgray" : "white"}
        />

        {/* Renderiza el diseño basado en el hallazgo actual y el optionId */}
        {currentFinding?.color && currentFinding?.dynamicDesign && (
          <>
            {/* Diseños para optionId 11 */}
            {optionId === 1 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding1Design1 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <Finding1Design2 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 3 && (
                  <Finding1Design3 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}

            {/* Diseños para optionId 2 */}
            {optionId === 2 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding2Design1 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <Finding2Design1 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 3 && (
                  <Finding2Design1 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {/* Diseños para optionId 13 */}
            {optionId === 13 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding13Design1 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <Finding13Design2 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {/* Diseños para optionId 24 */}
            {optionId === 24 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding24Design1 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {/* Diseños para optionId 25 */}
            {optionId === 25 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding25Design1 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {optionId === 30 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding30Design3 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 3 && (
                  <Finding30Design2 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <Finding30Design1 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {/* Diseños para optionId 31 */}
            {optionId === 31 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 3 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {/* Diseños para optionId 32 */}
            {optionId === 32 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 2 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
                {currentFinding.dynamicDesign === 3 && (
                  <TwoHorizontalLines60x20 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
            {optionId === 39 && (
              <>
                {currentFinding.dynamicDesign === 1 && (
                  <Finding39Design2 strokeColor={currentFinding.color.name} />
                )}
                {/* {currentFinding.dynamicDesign === 3 && (
                  <Finding30Design2 strokeColor={currentFinding.color.name} />
                )} */}
                {currentFinding.dynamicDesign === 2 && (
                  <Finding39Design3 strokeColor={currentFinding.color.name} />
                )}
              </>
            )}
          </>
        )}
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </svg>
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </div>
  );
};

export default MainSectionOnTheCanvas;