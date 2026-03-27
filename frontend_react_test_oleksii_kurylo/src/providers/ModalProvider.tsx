import { type FC, type ReactNode, createContext, useState } from "react";

import { type ModalContextType } from "../types";
import { minInputValue, maxInputValue } from "../constants";

export const ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [rows, setRows] = useState(minInputValue);
  const [columns, setColumns] = useState(minInputValue);
  const [limits, setLimits] = useState(minInputValue);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateRows = (rows: number) => {setRows(rows)};
  const updateColumns = (columns: number) => {setColumns(columns)};
  const updateLimits = (limits: number) => {setLimits(limits)};
  const updateIsCanceled = (value: boolean) => {setIsCanceled(value)};
  const updateIsSubmitted = (value: boolean) => {setIsSubmitted(value)};

  return (
    <ModalContext.Provider
      value={{
        rows: {
          quantity: rows,
          updateQuantity: updateRows,
          isError: rows < minInputValue || rows > maxInputValue,
        },
        columns: {
          quantity: columns,
          updateQuantity: updateColumns,
          isError: columns < minInputValue || columns > maxInputValue,
        },
        limits: {
          quantity: limits,
          updateQuantity: updateLimits,
          isError: limits < minInputValue || limits > columns * rows,
        },
        cancel: {
          value: isCanceled,
          updateValue: updateIsCanceled,
        },
        submit: {
          value: isSubmitted,
          updateValue: updateIsSubmitted,
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;