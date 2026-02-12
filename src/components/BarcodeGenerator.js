import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = ({ value, width = 2, height = 100, displayValue = true }) => {
  const barcodeRef = useRef();

  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: 16,
        textMargin: 8,
        margin: 10
      });
    }
  }, [value, width, height, displayValue]);

  return (
    <div className="barcode-container">
      <svg ref={barcodeRef}></svg>
    </div>
  );
};

export default BarcodeGenerator;