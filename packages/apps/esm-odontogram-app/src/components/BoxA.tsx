// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React, { useState } from "react";

const BoxA = ({
  color
}: any) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <div
      style={{
        width: "60px",
        height: "20px",
        backgroundColor: isSelected ? color : "white",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
      onClick={handleClick}
      onMouseEnter={(e: any) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "lightgray";
      }}
      onMouseLeave={(e: any) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "white";
      }}
    // @ts-expect-error TS(2339): Property 'div' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    ></div>
  );
};

export default BoxA;
