// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React, { useReducer } from "react";
import { getPolygonPoints } from "../poligonPoints/ToothPolygonDesigns";
import "./Tooth.css";

const TOGGLE_ZONE = "TOGGLE_ZONE";

const initialState = (zones: any) => ({
  Cavities: Array(zones).fill(0)
});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case TOGGLE_ZONE:
      return {
        ...state,
        Cavities: state.Cavities.map((val: any, index: any) =>
          index === action.zone ? (val === 0 ? 1 : 0) : val
        ),
      };
    default:
      return state;
  }
};

const Tooth = ({
  zones,
  selectedOptionId = 2
}: any) => {
  const [state, dispatch] = useReducer(reducer, initialState(zones));

  const predefinedMarkedOptions = [2, 4];

  const getClassNamesByZone = (index: any) => state.Cavities[index] === 1 ? "to-do" : "";

  // @ts-expect-error TS(6133): 'handleZoneClick' is declared but its value is nev... Remove this comment to see the full error message
  const handleZoneClick = (index: any) => {
    if (predefinedMarkedOptions.includes(selectedOptionId)) {
      dispatch({ type: TOGGLE_ZONE, zone: index });
    }
  };

  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg x="0" y="60" width="60" height="60" viewBox="0 0 20 20" className="tooth">
      {getPolygonPoints(zones).map((points: any, index: any) => (
        // @ts-expect-error TS(2339): Property 'polygon' does not exist on type 'JSX.Int... Remove this comment to see the full error message
        <polygon
          key={index}
          points={points}
          //onClick={() => handleZoneClick(index)}
          className={getClassNamesByZone(index)}
          strokeWidth="0.15"
          stroke="black"
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
        />
      ))}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default Tooth;
