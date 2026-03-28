import chroma from "chroma-js";

import { type ICell, type HighlightCellType } from "./types";
import { maxAmountGenerate, minInputValue } from "./constants";
import { hotHexColor, coldHexColor } from "./constants";

export const amountGeneration = (): number => Math.round(Math.random() * maxAmountGenerate);

export const PrepareTable = (rows: number, columns: number): ICell[][] => {
  const tableData: ICell[][] = []

  for (let r = minInputValue; r <= rows; r++) {
    const lastId: number = tableData?.[tableData?.length - 1]?.[tableData[tableData?.length - 1]?.length - 1]?.id || 0;
    const rowData = PrepareRow(columns, lastId);

    tableData.push(rowData);
  }

  return tableData;
};

export const PrepareRow = (columns: number, lastId: number): ICell[] => {
  const rowData: ICell[] = [];

  let id = lastId, maxAmount = 0, correctRowSum = 0;;

  for (let c = minInputValue; c <= columns; c++) {
    const indexPrevCell = c - 2;
    const lastRowSum = (c === minInputValue || !rowData[indexPrevCell]) ? 0 : rowData[indexPrevCell].rowSum;
    id++;

    const cellData = PrepareCell(id, lastRowSum);
    maxAmount = maxAmount < cellData.amount ? cellData.amount : maxAmount;

    rowData.push(cellData);
  };

  rowData.reverse().forEach((cellData, index) => {
    if (!index) {
      correctRowSum = cellData.rowSum;
    } else {
      cellData.rowSum = correctRowSum;
    };

    cellData.maxAmount = maxAmount;
    cellData.percentageInRow = Math.round(+cellData.amount / cellData.rowSum * 100);
  });
  rowData.reverse();

  return rowData;
};

export const PrepareCell = (id: number, lastRowSum: number): ICell => {
  const amount = amountGeneration();
  const rowSum = lastRowSum + amount;

  const cellData: ICell = {
    id,
    amount,
    maxAmount: 0,
    rowSum,
    percentageInRow: 0,
  };

  return cellData;
};

export const chromaScale = chroma.scale([hotHexColor, coldHexColor]).domain([1, 0]);

export const getColorHex = (
  indexRow: number,
  cell: ICell,
  hoveredIndexRow: number | null,
  highlightCellsIds: HighlightCellType[],
): string => {
  let result = "transparent";
  const isHeatmap = hoveredIndexRow !== null && hoveredIndexRow === indexRow;
  const highlightCell = highlightCellsIds.find((selectCell) => selectCell.id === cell.id);

  isHeatmap && (result = chromaScale(cell.amount / cell.maxAmount).hex());

  if (highlightCell !== undefined) {
    const maxDiff = highlightCellsIds[0].diff;
    result = chromaScale(1 - highlightCell.diff / maxDiff).hex();
  };

  return result;
};
