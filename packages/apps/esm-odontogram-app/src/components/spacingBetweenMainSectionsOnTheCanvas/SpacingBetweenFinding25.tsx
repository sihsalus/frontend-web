const SpaceBetweenFinding25 = ({  }) => {
    return (
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      <svg
        width="20"
        height="20"
        style={{ cursor: "pointer" }}
      >
        {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
        // @ts-expect-error TS(2339): Property 'rect' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
        <rect
          width="20"
          height="20"
          fill={"white"}
        />
      // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
      </svg>
    );
  };
  
  export default SpaceBetweenFinding25;