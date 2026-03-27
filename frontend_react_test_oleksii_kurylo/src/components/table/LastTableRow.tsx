import { type FC, useContext, useState, useEffect } from "react";

import { TableContext} from "../../providers/TableProvider";
import { type ICell } from "../../types";

import "./Table.css";

export const LastTableRow: FC = () => {
  const tableContext = useContext(TableContext);
  const rowIndex = tableContext?.cells.length;
  const [sumColumn, setSumColumn] = useState<number[] | []>([]);

  useEffect(() => {
    if (tableContext) {
      const columnSum: number[] = [];

      tableContext.cells.forEach((row, indexRow) => {
        row.forEach((cell: ICell, indexCell: number) => {
          if (!indexRow) {
            columnSum[indexCell] = cell.amount;
          } else {
            columnSum[indexCell] = columnSum[indexCell] + cell.amount;
          };
        });
      });

      setSumColumn(columnSum)
    }
  }, [tableContext]);

  return rowIndex && sumColumn.length ? (
    <tr key={`tr-${rowIndex}`}>
      <th key={`th-${rowIndex}.0`}>
        60th percentile
      </th>
      {sumColumn.map((sum, indexSum) => (
        <th key={`th-${rowIndex}.${indexSum + 1}`}>
          {sum*60/100}
        </th>
      ))}
      <th key={`th-${rowIndex}.${tableContext.cells[0].length + 1}`}/>
    </tr>
  ) : null; 
}; 
