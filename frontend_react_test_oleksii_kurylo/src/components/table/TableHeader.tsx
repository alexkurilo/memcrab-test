import { type FC, useContext } from "react";

import { TableContext } from "../../providers/TableProvider";

export const TableHeader: FC = () => {
  const tableContext = useContext(TableContext);

  return tableContext?.cells.length && tableContext?.cells[0].length ? (
    <thead key="table-header">
      <tr key="tr-head">
        <>
          <th key="tr-head-th-00"/>
          {tableContext?.cells[0].map((_, rowIndex) => (
            <th key={`tr-head-th-0${rowIndex + 1}`}>
              {`Cell values N = ${rowIndex + 1}`}
            </th>
          ))}
          <th key={`tr-head-th-0${tableContext?.cells[0].length}`}>
            Sum values
          </th>
        </>
      </tr>
    </thead>
  ) : null; 
}; 
