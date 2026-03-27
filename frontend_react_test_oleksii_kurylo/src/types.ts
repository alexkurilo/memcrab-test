export interface IInputData {
  quantity: number;
  updateQuantity: (quantity: number) => void;
  isError: boolean;
};

export interface IModalAction {
  value: boolean;
  updateValue: (value: boolean) => void;
};

export type ModalContextType = {
  rows: IInputData;
  columns: IInputData;
  limits: IInputData;
  cancel: IModalAction;
  submit: IModalAction;
};

export interface ICell {
  id: number;
  amount: number;
  maxAmount: number;
  rowSum: number;
  percentageInRow: number;
};

export type TableContextType = {
  cells: ICell[][];
  updateCells: (value: ICell[][]) => void;
};

export type HighlightCellType = {
  diff: number;
  id: number;
  amount: number;
};
