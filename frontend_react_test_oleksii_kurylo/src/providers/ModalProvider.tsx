import React, { useState } from "react";

type ContextType = {
  rows: {
    quantity: number;
    setQuantity: (quantity: number) => void;
    isError: boolean;
  };
  columns: {
    quantity: number;
    setQuantity: (quantity: number) => void;
    isError: boolean;
  };
  limits: {
    quantity: number;
    setQuantity: (quantity: number) => void;
    isError: boolean;
  };
  isCanceled: boolean;
  isSubmited: boolean;
  setCanceled: (value: boolean) => void;
  setSubmited: (value: boolean) => void;
};

export const ModalContext = React.createContext<ContextType | null>(null);

const ModalProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [rowsValue, setRowsValue] = useState(1);
  const [columnsValue, setColumnsValue] = useState(1);
  const [limits, setLimits] = useState(1);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const saveRowsValue = (rowsValue: number) => {setRowsValue(rowsValue)};
  const saveColumnsValue = (columnsValue: number) => {setColumnsValue(columnsValue)};
  const saveLimits = (limitsValue: number) => {setLimits(limitsValue)};
  const saveIsCanceled = (value: boolean) => {setIsCanceled(value)};
  const saveIsSubmited = (value: boolean) => {setIsSubmited(value)};

  return (
    <ModalContext.Provider
      value={{
        rows: {
          quantity: rowsValue,
          setQuantity: saveRowsValue,
          isError: rowsValue < 1 || rowsValue > 100,
        },
        columns: {
          quantity: columnsValue,
          setQuantity: saveColumnsValue,
          isError: columnsValue < 1 || columnsValue > 100,
        },
        limits: {
          quantity: limits,
          setQuantity: saveLimits,
          isError: limits < 1 || limits > columnsValue * rowsValue,
        },
        isCanceled,
        setCanceled: saveIsCanceled,
        isSubmited,
        setSubmited: saveIsSubmited,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;