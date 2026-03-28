import { type FC, useContext, useState } from "react";

import { TableContext} from "../../providers/TableProvider";
import { ModalContext } from "../../providers/ModalProvider";
import { getColorHex } from "../../helpers";
import { type ICell, type HighlightCellType } from "../../types";
import { LastTableRow } from "./LastTableRow";
import { ButtonsBlock } from "./ButtonsBlock";

import "./Table.css";

export const TableBody: FC = () => {
  const tableContext = useContext(TableContext);
  const modalContext = useContext(ModalContext);

  const [hoveredIndexRow, setHoveredIndexRow] = useState<number | null>(null);
  const [highlightCellsIds, setHighlightCellsIds] = useState<HighlightCellType[]>([]);
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  
  const onClickHandleToCell = (rowIndex: number, cellIndex: number, cell: ICell) => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));
    const step = 1;
    
    tableData.forEach((row: ICell[], indexRow: number) => {
      if (rowIndex === indexRow) {
        row.forEach((cell: ICell, indexCell: number) => {
          if (cellIndex === indexCell) {
            cell.percentageInRow = Math.round((cell.amount + step) / (cell.rowSum + step) * 100);
            cell.amount = cell.amount + step;
          } else {
            cell.percentageInRow = Math.round(cell.amount / (cell.rowSum + step) * 100);
          }
          cell.rowSum = cell.rowSum + step;
        });
      }
    });
    tableContext?.updateCells(tableData);
    onHoverHandlerToCell(cell);
  };

  const onHoverHandlerToCell = (selectedCell: ICell) => {
    const resultSortedSet: HighlightCellType[] = [];
    const limitLength = modalContext?.limits.quantity;
    
    resultSortedSet.push({
      diff: 0,
      id: selectedCell.id,
      amount: selectedCell.amount,
    });

    tableContext?.cells.forEach((row) => {
      row.forEach((cell) => {
        if (limitLength && limitLength > 1 && cell.id !== selectedCell.id) {
          const currentDiff: HighlightCellType = {
            diff: Math.abs(cell.amount - selectedCell.amount),
            id: cell.id,
            amount: cell.amount,
          };
          if (resultSortedSet.length < limitLength) {
            resultSortedSet.push(currentDiff)
          } else {
            if ((resultSortedSet[0].diff - currentDiff.diff) > 0) {
              resultSortedSet.splice(0, 1, currentDiff);
            }
          }
          resultSortedSet.sort((a, b) => (a.diff > b.diff ? -1 : 1));
        };
      })
    });
    setHighlightCellsIds(resultSortedSet);
  };

  const onClickSumHandler = (rowIndex: number) => {    
    setOpenPopup(rowIndex === openPopup ? null : rowIndex);
  };

  const onMouseLeaveHandler = () => {    
    setHoveredIndexRow(null);
    setOpenPopup(null);
  };

  return tableContext?.cells.length ? (
    <tbody>
      {tableContext?.cells.map((row, indexRow) => (
        <tr key={`tr-body-${indexRow}`}>
          <th key={`th-${indexRow}.0}`}>{`Cell values M = ${indexRow + 1}`}</th>
          {row.length && row.map((cell, indexCell) => (
            <td
              key={`th-${indexRow}.${indexCell + 1}`}
              onClick={() => onClickHandleToCell(indexRow, indexCell, cell)}
              onMouseEnter={() => {onHoverHandlerToCell(cell)}}
              onMouseLeave={() => {setHighlightCellsIds([])}}
              data-bg-color={getColorHex(indexRow, cell, hoveredIndexRow, highlightCellsIds)}
            >
              {hoveredIndexRow !== null && hoveredIndexRow === indexRow ? `${cell.percentageInRow}%` : cell.amount}
            </td>
          ))}
          <th
            key={`th-${indexRow}.${row.length + 2}`} 
            onMouseEnter={() => {setHoveredIndexRow(indexRow)}}
            onMouseLeave={onMouseLeaveHandler}
            onClick={() => onClickSumHandler(indexRow)}
          >
            {openPopup === indexRow ? <ButtonsBlock rowIndex={indexRow}/> : row[row.length - 1].rowSum}
          </th>
        </tr>
      ))}
      <LastTableRow/>
    </tbody>
  ) : null; 
}; 
