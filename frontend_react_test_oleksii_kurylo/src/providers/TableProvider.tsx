import React, { useContext, useState, useEffect } from "react";

import { ModalContext } from "./ModalProvider";

export interface ICell {
  id: number;
  amount: number;
  rowSum: number;
  percentageInRow: number;
}

type ContextType = {
  cells: ICell[][];
  updateCells: (value: ICell[][]) => void;
};

export const TableContext = React.createContext<ContextType | null>(null);

const TableProvider: React.FC<React.ReactNode> = ({ children }) => {
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

      const amountGeneration = (): number => Math.round(Math.random() * 100);

      for (let r = 1; r <= rows; r++) {
        let rowSum = 0;
        for (let c = 1; c <= columns; c++) {
          const amount = amountGeneration();
          rowSum = rowSum + amount;

          const cellData = {
            id,
            amount,
            rowSum,
            percentageInRow: 0,
          };
          rowData.push(cellData);
          id++;
        }
        let correctRowSum = 0;
        rowData.reverse().forEach((cellData, index) => {
          if (!index) {
            correctRowSum = cellData.rowSum;
          } else {
            cellData.rowSum = correctRowSum;
          }
          cellData.percentageInRow = Math.round(cellData.amount / cellData.rowSum * 100);
        })
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