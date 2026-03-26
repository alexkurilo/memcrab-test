import { useContext, useState } from "react";
import chroma from "chroma-js";

import { TableContext, type ICell} from "../../providers/TableProvider";
import { ModalContext } from "../../providers/ModalProvider";
import { amountGeneration } from "../../helpers";
import { hotHexColor, coldHexColor } from "../../constants";

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

  const chromaScale = chroma.scale([hotHexColor, coldHexColor]).domain([1, 0]);
  
  const onClickHandleToCell = (rowIndex: number, cellIndex: number, cell: ICell) => {
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
    onHoverHandlerToCell(cell);
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

  const onClickSumHandler = (rowIndex: number) => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));
    tableData.splice(rowIndex, 1)
    tableContext?.updateCells(tableData);
  }

  const onClickEmptyCellHandler = () => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));
    const rowLength = tableData[0].length;
    const newRow: ICell[] = [];
    const lastId: number = tableData[tableData.length - 1][tableData[tableData.length - 1].length - 1].id;
    let rowSum = 0, maxAmount = 0;

    for (let i = 0; i < rowLength; i++) {
      const amount = amountGeneration();
      rowSum += amount;
      const newCellData: ICell = {
        id: lastId + i + 1,
        amount,
        maxAmount: 0,
        rowSum: 0,
        percentageInRow: 0,
      }
      maxAmount = maxAmount < amount ? amount : maxAmount;
      newRow.push(newCellData);
    }
    newRow.reverse().forEach(cellData => {
      cellData.rowSum = rowSum;
      cellData.maxAmount = maxAmount;
      cellData.percentageInRow = Math.round(cellData.amount / cellData.rowSum * 100);
    })

    tableData.push(newRow.reverse());
    tableContext?.updateCells(tableData);
  }

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
                              onClick={() => onClickHandleToCell(indexRow, indexCell, cell)}
                              onMouseEnter={() => {onHoverHandlerToCell(cell)}}
                              onMouseLeave={() => {setHighlightCellsIds([])}}
                              data-bg-color={hoveredIndexRow !== null && hoveredIndexRow === indexRow ? chromaScale(cell.amount / cell.maxAmount).hex() : null}
                            >
                              {hoveredIndexRow !==null && hoveredIndexRow === indexRow ? `${cell.percentageInRow} %` : cell.amount}
                            </td>
                            {indexCell === row.length - 1 && (
                              <th
                                key={`th-${indexRow}.${indexCell + 2}`} 
                                scope="col"
                                onMouseEnter={() => {setHoveredIndexRow(indexRow)}}
                                onMouseLeave={() => {setHoveredIndexRow(null)}}
                                onClick={() => onClickSumHandler(indexRow)}
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
                              {indexSum === row.length - 1 && (
                                <th
                                  key={`th-${indexRow + 1}.${indexSum + 2}`}
                                  scope="col"
                                  onClick={onClickEmptyCellHandler}
                                />
                              )}
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
