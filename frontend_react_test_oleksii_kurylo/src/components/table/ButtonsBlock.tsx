import { type FC, useContext } from "react";

import { TableContext} from "../../providers/TableProvider";
import { PrepareRow } from "../../helpers";

export const ButtonsBlock: FC<{ rowIndex: number }> = ({ rowIndex }) => {
  const tableContext = useContext(TableContext);

  const onClickDeleteHandler = () => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));
    tableData.splice(rowIndex, 1)
    tableContext?.updateCells(tableData);
  };

  const onClickAddHandler = () => {
    const tableData = JSON.parse(JSON.stringify(tableContext?.cells));
    const rowLength = tableData[0].length;
    const lastId: number = tableData[tableData.length - 1][tableData[tableData.length - 1].length - 1].id;
    const newRow = PrepareRow( rowLength, lastId);
    
    tableData.push(newRow);
    tableContext?.updateCells(tableData);
  };

  return (
    <span className='buttons-block'>
      <button
        className="delete-button"
        onClick={onClickDeleteHandler}
      >
        Delete row
      </button>
      {tableContext?.cells.length && rowIndex === tableContext?.cells.length - 1 ? (
        <button
          className="add-button"
          onClick={onClickAddHandler}
        >
          Add row
        </button>
      ) : null}
    </span>
  );
};