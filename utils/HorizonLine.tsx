// utils/HorizonLine.tsx
import React from "react";

interface HorizonLineProps {
    text: string;
}

const HorizonLine: React.FC<HorizonLineProps> = ({ text }) => {
    return (
        <div
            style={{
                width: "100%",
                textAlign: "center",
                borderBottom: "1px solid #aaa",
                lineHeight: "0.1em",
                margin: "10px 0 20px",
            }}
        >
            <span style={{ background: "#fff", padding: "0 10px" }}>{text}</span>
        </div>
    );
};

export default HorizonLine;
