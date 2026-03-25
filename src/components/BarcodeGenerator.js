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
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <svg
        ref={barcodeRef}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      ></svg>
    </div>
  );
};

export default BarcodeGenerator;