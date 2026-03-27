import { type FC, type ReactNode, createContext, useContext, useState, useEffect } from "react";

import { type TableContextType, type ICell } from "../types";
import { ModalContext } from "./ModalProvider";
import { PrepareTable } from "../helpers";

export const TableContext = createContext<TableContextType | null>(null);

const TableProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const modalContext = useContext(ModalContext);

  const [cells, setCells] = useState<ICell[][]>([]);
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);

  const saveUpdateCells = (value: ICell[][]): void => {setCells(value)};

  useEffect(() => {
    if (modalContext?.submit.value) {
      setRows(modalContext.rows.quantity);
      setColumns(modalContext.columns.quantity);
    }
  },[modalContext]);

  useEffect(() => {
    if (rows && columns) {
      const tableData = PrepareTable(rows, columns);
      setCells(tableData);
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