// @ts-expect-error TS(6133): 'React' is declared but its value is never read.
import React from "react";
// @ts-expect-error TS(2792): Cannot find module '@carbon/react'. Did you mean t... Remove this comment to see the full error message
import { ComboBox, Dropdown, Button, Stack } from "@carbon/react";
import useDentalFormStore from "../store/dentalFormData";
import {
  Finding13Design1,
  Finding13Design2,
  Finding8Design1,
  Finding8Design2,
  Finding8Design3,
  Finding37Design1,
  Finding37Design2,
  Finding37Design3,
  Finding37Design4,
  Finding37Design5,
  Finding36Design1,
  Finding36Design2,
  Finding10Design1,
  Finding10Design2,
  Finding10Design3,
  Finding10Design4,
  Finding10Design5,
  Finding10Design6,
  Finding10Design7,
  Finding10Design8,
  Finding5Design1,
  Finding5Design2,
  Finding5Design3,
  Finding5Design4,
  Finding5Design5,
  Finding5Design6,
  Finding5Design7,
  Finding5Design8,
  Finding5Design9,
  Finding5Design10,
  Finding5Design11,
  Finding5Design12,
  Finding5Design13,
  Finding5Design14,
  Finding27Design9,
  Finding35Design1,
  Finding35Design2,
  Finding35Design3,
  Finding35Design4,
  Finding35Design5,
  Finding35Design6,
  Finding35Design7,
  Finding35Design8,
  Finding35Design9,
  Finding35Design10,
  Finding35Design11,
  Finding35Design12,
  Finding35Design13,
  Finding35Design14,
  // Importa aquí todos los componentes de diseño que necesites
} from "../designs/figuras";

// Mapeo de nombres de componentes a componentes reales
const designComponentMap = {
  'Finding8Design1': Finding8Design1,
  'Finding8Design2': Finding8Design2,
  'Finding8Design3': Finding8Design3,
  'Finding13Design1': Finding13Design1,
  'Finding13Design2': Finding13Design2,
  'Finding37Design1': Finding37Design1,
  'Finding37Design2': Finding37Design2,
  'Finding37Design3': Finding37Design3,
  'Finding37Design4': Finding37Design4,
  'Finding37Design5': Finding37Design5,
  'Finding36Design1': Finding36Design1,
  'Finding36Design2': Finding36Design2,
  'Finding10Design1': Finding10Design1,
  'Finding10Design2': Finding10Design2,
  'Finding10Design3': Finding10Design3,
  'Finding10Design4': Finding10Design4,
  'Finding10Design5': Finding10Design5,
  'Finding10Design6': Finding10Design6,
  'Finding10Design7': Finding10Design7,
  'Finding10Design8': Finding10Design8,
  'Finding5Design1': Finding5Design1,
  'Finding5Design2': Finding5Design2,
  'Finding5Design3': Finding5Design3,
  'Finding5Design4': Finding5Design4,
  'Finding5Design5': Finding5Design5,
  'Finding5Design6': Finding5Design6,
  'Finding5Design7': Finding5Design7,
  'Finding5Design8': Finding5Design8,
  'Finding5Design9': Finding5Design9,
  'Finding5Design10': Finding5Design10,
  'Finding5Design11': Finding5Design11,
  'Finding5Design12': Finding5Design12,
  'Finding5Design13': Finding5Design13,
  'Finding5Design14': Finding5Design14,
  'Finding16Design1': Finding5Design1,
  'Finding16Design2': Finding5Design2,
  'Finding16Design3': Finding5Design3,
  'Finding16Design4': Finding5Design4,
  'Finding16Design5': Finding5Design5,
  'Finding16Design6': Finding5Design6,
  'Finding16Design7': Finding5Design7,
  'Finding16Design8': Finding5Design8,
  'Finding16Design9': Finding5Design9,
  'Finding16Design10': Finding5Design10,
  'Finding16Design11': Finding5Design11,
  'Finding16Design12': Finding5Design12,
  'Finding16Design13': Finding5Design13,
  'Finding16Design14': Finding5Design14,
  'Finding27Design1': Finding5Design1,
  'Finding27Design2': Finding5Design2,
  'Finding27Design3': Finding5Design3,
  'Finding27Design4': Finding5Design4,
  'Finding27Design5': Finding5Design5,
  'Finding27Design6': Finding5Design6,
  'Finding27Design7': Finding5Design7,
  'Finding27Design8': Finding5Design8,
  'Finding27Design9': Finding27Design9,
  'Finding34Design1': Finding5Design1,
  'Finding34Design2': Finding5Design2,
  'Finding34Design3': Finding5Design3,
  'Finding34Design4': Finding5Design4,
  'Finding34Design5': Finding5Design5,
  'Finding34Design6': Finding5Design6,
  'Finding34Design7': Finding5Design7,
  'Finding34Design8': Finding5Design8,
  'Finding34Design9': Finding5Design9,
  'Finding34Design10': Finding5Design10,
  'Finding34Design11': Finding5Design11,
  'Finding34Design12': Finding5Design12,
  'Finding34Design13': Finding5Design13,
  'Finding34Design14': Finding5Design14,
  'Finding35Design1': Finding35Design1,
  'Finding35Design2': Finding35Design2,
  'Finding35Design3': Finding35Design3,
  'Finding35Design4': Finding35Design4,
  'Finding35Design5': Finding35Design5,
  'Finding35Design6': Finding35Design6,
  'Finding35Design7': Finding35Design7,
  'Finding35Design8': Finding35Design8,
  'Finding35Design9': Finding35Design9,
  'Finding35Design10': Finding35Design10,
  'Finding35Design11': Finding35Design11,
  'Finding35Design12': Finding35Design12,
  'Finding35Design13': Finding35Design13,
  'Finding35Design14': Finding35Design14,
};

const FormDentalClinicalFindings = () => {
  const opciones = useDentalFormStore((state: any) => state.opciones);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedDesign = useDentalFormStore((state: any) => state.selectedDesign);
  const setSelectedOption = useDentalFormStore((state: any) => state.setSelectedOption);
  const setSelectedColor = useDentalFormStore((state: any) => state.setSelectedColor);
  const setSelectedSuboption = useDentalFormStore((state: any) => state.setSelectedSuboption);
  const setSelectedDesign = useDentalFormStore((state: any) => state.setSelectedDesign);
  // @ts-expect-error TS(6133): 'isComplete' is declared but its value is never re... Remove this comment to see the full error message
  const isComplete = useDentalFormStore((state: any) => state.isComplete);

  const selectedItem = opciones.find((op: any) => op.id === selectedOption) || null;

  const normalizeText = (text: any) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleFilter = ({
    item,
    inputValue
  }: any) => {
    if (!inputValue || inputValue.trim() === '') {
      return true;
    }
    const normalizedInput = normalizeText(inputValue);
    const normalizedItemName = normalizeText(item.nombre);
    return normalizedItemName.includes(normalizedInput);
  };

  // @ts-expect-error TS(7031): Binding element 'newItem' implicitly has an 'any' ... Remove this comment to see the full error message
  const handleComboBoxChange = ({ selectedItem: newItem }) => {
    // Solo actualizamos si realmente hay un cambio o si newItem es null por una deselección explícita
    if (newItem || (!newItem && selectedItem?.id !== selectedOption)) {
      setSelectedOption(newItem?.id || null);
    }
  };
  return <>
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <div>
      // @ts-expect-error TS(2339): Property 'h1' does not exist on type 'JSX.Intrinsi... Remove this comment to see the full error message
      <h1>Odontograma</h1>
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </div>
    <Stack
      gap={6}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        margin: "20px 0",
        gap: "16px",
      }}
    >
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div style={{ position: "relative", width: "250PX" }}>
        <ComboBox
          id="main-option"
          titleText="Selecciona un hallazgo"
          placeholder="Buscar o seleccionar hallazgo..."
          selectedItem={selectedItem}
          onChange={handleComboBoxChange}
          items={opciones}
          itemToString={(item: any) => item ? `${item.id}- ${item.nombre}` : ""}
          shouldFilterItem={handleFilter}
        />
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>

      {selectedItem?.subopciones?.length > 0 && (
        <Dropdown
          id="suboption"
          titleText="Selecciona el tipo"
          label="-- Selecciona --"
          selectedItem={
            selectedItem.subopciones.find((subop: any) => subop.id === selectedSuboption?.id) || null
          }
          onChange={({
            selectedItem
          }: any) => setSelectedSuboption(selectedItem)}
          items={selectedItem?.subopciones || []}
          itemToString={(item: any) => item ? item.nombre : "-- Selecciona --"}
          style={{ width: "250px" }}
        />
      )}

      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <div style={{ display: "flex", gap: "10px" }}>
        {selectedItem?.colores?.map((color: any) => <Button
          key={color.id}
          kind={selectedColor?.name === color.name ? (color.name === "red" ? "danger" : "primary") : "secondary"}
          onClick={() => setSelectedColor(color)}
          disabled={!selectedItem}
          size="md"
        >
          {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
        </Button>)}
      // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </div>
      {/* Visualizador de diseños disponibles */}
      {selectedItem?.designs && selectedItem.designs.length > 0 && (
        // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
          }}
        >
          {selectedItem.designs.map((design: any) => {
            // Obtener el componente de diseño según su nombre
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const DesignComponent = designComponentMap[design.componente];

            if (!DesignComponent) {
              return (
                // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
                <div key={design.number} style={{ color: "red" }}>
                  Componente no encontrado: {design.componente}
                // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
                </div>
              );
            }

            // Determinar si este diseño está seleccionado
            const isSelected = selectedDesign?.number === design.number;

            // Color para mostrar en la vista previa (usar el seleccionado o un color por defecto)
            const previewColor = selectedColor?.name || "black";

            return (
              // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
              <div
                key={design.number}
                onClick={() => setSelectedDesign(design)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  border: isSelected ? `2px solid ${previewColor}` : "2px solid transparent",
                  borderRadius: "8px",
                  backgroundColor: "#f4f4f4",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "90px",
                }}
              >
                // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
                <div style={{ height: "120px", width: "60px" }}>
                  <DesignComponent strokeColor={previewColor} />
                // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
                </div>
                
              // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
              </div>
            );
          })}
        // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
        </div>
      )}
    </Stack>


  </>;
};

export default FormDentalClinicalFindings;