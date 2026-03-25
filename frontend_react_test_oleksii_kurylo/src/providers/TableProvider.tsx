import React, { useContext, useState, useEffect, type ReactNode } from "react";

import { ModalContext } from "./ModalProvider";
import { amountGeneration } from "../helpers";
export interface ICell {
  id: number;
  amount: number;
  maxAmount: number;
  rowSum: number;
  percentageInRow: number;
}

type ContextType = {
  cells: ICell[][];
  updateCells: (value: ICell[][]) => void;
};

type TableProviderProps = {
  children: ReactNode;
};

export const TableContext = React.createContext<ContextType | null>(null);

const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const modalContext = useContext(ModalContext);

  const [cells, setCells] = useState<ICell[][]>([]);
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);

  const saveUpdateCells = (value: ICell[][]): void => {setCells(value)};

  const PrepareTableData = () => {
    if (modalContext?.isSubmited) {
      const tableData = []
      let rowData = [];
      let id = 0;

      for (let r = 1; r <= rows; r++) {
        let rowSum = 0, maxAmount = 0, correctRowSum = 0;

        for (let c = 1; c <= columns; c++) {
          const amount = amountGeneration();
          rowSum = rowSum + amount;
          maxAmount = maxAmount < amount ? amount : maxAmount;

          const cellData = {
            id,
            amount,
            maxAmount: 0,
            rowSum,
            percentageInRow: 0,
          };
          rowData.push(cellData);
          id++;
        }

        rowData.reverse().forEach((cellData, index) => {
          if (!index) {
            correctRowSum = cellData.rowSum;
          } else {
            cellData.rowSum = correctRowSum;
          }
          cellData.maxAmount = maxAmount;
          cellData.percentageInRow = Math.round(+cellData.amount / cellData.rowSum * 100);
        });
        tableData.push(rowData.reverse())
        rowData = [];
      }

      setCells(tableData);
    }
  };

  useEffect(() => {
    if (modalContext?.isSubmited) {
      setRows(modalContext.rows.quantity);
      setColumns(modalContext.columns.quantity);
    }
  },[modalContext]);

  useEffect(() => {
    if (rows && columns) {
      PrepareTableData();
    }
  },[rows, columns]);

  return (
    <TableContext.Provider
      value={{
        cells,
        updateCells: saveUpdateCells,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;