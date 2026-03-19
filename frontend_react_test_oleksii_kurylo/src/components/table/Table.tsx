import { useContext, useState } from "react";
import { TableContext, type ICell} from "../../providers/TableProvider";
import { ModalContext } from "../../providers/ModalProvider";

import "./Table.css";

type DiffAmountType = {
  diff: number;
  id: number;
  amount: number;
}

export const Table = () => {
  const tableContext = useContext(TableContext);
  const modalContext = useContext(ModalContext);

  const columnSum: number[] = [];
  const [hoveredIndexRow, setHoveredIndexRow] = useState<number | null>(null);
  const [highlightCellsIds, setHighlightCellsIds] = useState<DiffAmountType[]>([]);
  
  const onClickHandleToCell = (rowIndex: number, cellIndex: number) => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));

    tableData.forEach((row: ICell[], indexRow: number) => {
      if (rowIndex === indexRow) {
        row.forEach((cell: ICell, indexCell: number) => {
          if (cellIndex === indexCell) {
            cell.percentageInRow = Math.round((cell.amount + 1) / (cell.rowSum + 1) * 100);
            cell.amount = cell.amount + 1;
          } else {
            cell.percentageInRow = Math.round(cell.amount / (cell.rowSum + 1) * 100);
          }
          cell.rowSum = cell.rowSum + 1;
        });
      }
    });
    tableContext?.updateCells(tableData);
  };

  const onHoverHandlerToCell = (selectedCell: ICell) => {
    const resultSortedSet: DiffAmountType[] = [];
    const limitLength = modalContext?.limits.quantity;
    
    resultSortedSet.push({
      diff: 0,
      id: selectedCell.id,
      amount: selectedCell.amount,
    });

    tableContext?.cells.forEach((row) => {
      row.forEach((cell) => {
        if (limitLength && limitLength > 1 && cell.id !== selectedCell.id) {
          const currentDiff: DiffAmountType = {
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
        }
      })
    });
    setHighlightCellsIds(resultSortedSet);
  };

  return (
    <div className='table'>
      <table className="content-table">
        <thead>
          <tr key="tr-head">
            {tableContext?.cells.length && tableContext?.cells[0].length && tableContext?.cells[0].map((_, index) => {
              return (
                <>
                  {!index && <th key={`th-0${index}`} scope="col"/>}
                  <th key={`th-0${index + 1}`} scope="col">{`Cell values N = ${index + 1}`}</th>
                  {index === tableContext?.cells[0].length - 1 && <th key={`th-0${index + 2}`} scope="col">Sum values</th>}
                </>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {
            tableContext?.cells.length && tableContext?.cells.map((row, indexRow) => {
              return (
                <>
                  <tr key={`tr-${indexRow}`}>
                    {
                      row.length && row.map((cell, indexCell) => {
                        if (!indexRow) {
                          columnSum[indexCell] = cell.amount;
                        } else {
                          columnSum[indexCell] = columnSum[indexCell] + cell.amount;
                        };
                        
                        return (
                          <>
                            {!indexCell && <th key={`th-${indexRow}.${indexCell}`} scope="col">{`Cell values M = ${indexRow + 1}`}</th>}
                            <td
                              className={ highlightCellsIds.some((selectCell) => selectCell.id === cell.id) ? "highlight_limit" : ""}
                              key={`th-${indexRow}.${indexCell + 1}`}
                              onClick={() => onClickHandleToCell(indexRow, indexCell)}
                              onMouseEnter={() => {onHoverHandlerToCell(cell)}}
                              onMouseLeave={() => {setHighlightCellsIds([])}}
                            >
                              {hoveredIndexRow !==null && hoveredIndexRow === indexRow ? `${cell.percentageInRow} %` : cell.amount}
                            </td>
                            {indexCell === row.length - 1 && (
                              <th
                                key={`th-${indexRow}.${indexCell + 2}`} 
                                scope="col"
                                onMouseEnter={() => {setHoveredIndexRow(indexRow)}}
                                onMouseLeave={() => {setHoveredIndexRow(null)}}
                              >
                                {cell.rowSum}
                              </th>
                            )}
                          </>
                        )
                      })
                    }
                  </tr>
                  {indexRow === tableContext?.cells.length - 1 && (
                    <tr key={`tr-${indexRow + 1}`}>
                      {
                        columnSum.length && columnSum.map((sum, indexSum) => {
                          return (
                            <>
                              {!indexSum && <th key={`th-${indexRow + 1}.${indexSum}`} scope="col">60th percentile</th>}
                              <th key={`th-${indexRow + 1}.${indexSum + 1}`}>{sum*60/100}</th>
                              {indexSum === row.length - 1 && <th key={`th-${indexRow + 1}.${indexSum + 2}`} scope="col"/>}
                            </>
                          )
                        })
                      }
                    </tr>
                  )}
                </>
              )
            })
          }
        </tbody>
      </table>
    </div>
  ); 
}; 
