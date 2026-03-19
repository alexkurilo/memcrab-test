import { useContext, useEffect } from "react";
import { ModalContext } from "../../providers/ModalProvider";
import { TableContext } from "../../providers/TableProvider";

import "./Table.css";

export const Table = () => {
  const modalContext = useContext(ModalContext);
  const tableContext = useContext(TableContext);
  const columnSum: number[] = [];

  useEffect(() => {
    modalContext?.isSubmited && console.log("App modalContext = ", modalContext)
  }, [modalContext]);

  useEffect(() => {
    if (tableContext?.cells.length) {
      console.log("Table tableContext = ", tableContext)
      console.log("Table columnSum = ", columnSum)
    }
  }, [tableContext?.cells]);

  return (
    <div className='table'>
      <table className="content-table">
        <thead>
          <tr key="tr-head">
            {tableContext?.cells.length && tableContext?.cells[0].length && tableContext?.cells[0].map((cell, index) => {
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
                            <td key={`th-${indexRow}.${indexCell + 1}`}>{cell.amount}</td>
                            {indexCell === row.length - 1 && <th key={`th-${indexRow}.${indexCell + 2}`} scope="col">{cell.rowSum}</th>}
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
