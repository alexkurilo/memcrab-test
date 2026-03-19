import { type FC, useRef, useState, type ChangeEvent, useEffect, useContext } from "react";
import { ModalContext } from "../../providers/ModalProvider";

type Props = {
  inputName: string
}

export const NumberInput: FC<Props>  = (props) => {
  const modalContext = useContext(ModalContext);
  const inputName = props.inputName;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);

  const labelValue: string | void = (inputName === 'rowsInput')
    ? "M - is the number of rows"
    : inputName === 'columnsInput' 
      ? "N - is the number of columns"
      : "X - is the number of limits";

  const errorValue: string | void = (inputName === 'rowsInput')
    ? "M must be between 1 and 100"
    : inputName === 'columnsInput' 
      ? "N must be between 1 and 100"
      : `X must be between 1 and ${modalContext?.rows?.quantity && modalContext?.columns.quantity && modalContext?.rows?.quantity * modalContext?.columns.quantity}`;

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;

    if (inputName !== 'limitsInput') {
      if (value >= 1 && value <= 100) {
        isError && setIsError(false);
      } else {
        !isError && setIsError(true);
      }  
    } else {
      if (value >= 1 && modalContext?.rows?.quantity && value <= modalContext?.rows?.quantity * modalContext?.columns.quantity) {
        isError && setIsError(false);
      } else {
        !isError && setIsError(true);
      } 
    }
    
    inputName === 'rowsInput' 
      ? modalContext?.rows.setQuantity(value) 
      : inputName === 'columnsInput' 
        ? modalContext?.columns.setQuantity(value)
        : modalContext?.limits.setQuantity(value);
  }

  useEffect(() => {
    if (inputRef.current && inputName !== 'columnsInput') inputRef.current.focus();
  }, []);

  return (
    <div className="input-group">
      <label htmlFor={inputName}>
        {labelValue || null}
      </label>
      <input
        id={inputName}
        name={inputName}
        type="number"
        defaultValue={1}
        min={1}
        max={inputName !== 'limitsInput' ? 100 : modalContext?.rows?.quantity && modalContext?.rows?.quantity * modalContext?.columns.quantity}
        ref={inputRef}
        onChange={onChangeHandler}
      />
      <span className={`error ${!isError ? "hidden" : ""}`}>
        {errorValue || null}
      </span>
    </div>       
  ); 
}; 
  

export default NumberInput;
