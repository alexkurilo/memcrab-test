import { type FC, useRef, useState, type ChangeEvent, useEffect, useContext } from "react";

import { ModalContext } from "../../providers/ModalProvider";
import { minInputValue, maxInputValue } from "../../constants";

export const NumberInput: FC<{ inputName: string }>  = (props) => {
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
    ? `M must be between ${minInputValue} and ${maxInputValue}`
    : inputName === 'columnsInput' 
      ? `N must be between ${minInputValue} and ${maxInputValue}`
      : `X must be between ${minInputValue} and ${modalContext?.rows?.quantity && modalContext?.columns.quantity && modalContext?.rows?.quantity * modalContext?.columns.quantity}`;

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;

    if (inputName !== 'limitsInput') {
      if (value >= minInputValue && value <= maxInputValue) {
        isError && setIsError(false);
      } else {
        !isError && setIsError(true);
      }  
    } else {
      if (value >= minInputValue && modalContext?.rows?.quantity && value <= modalContext?.rows?.quantity * modalContext?.columns.quantity) {
        isError && setIsError(false);
      } else {
        !isError && setIsError(true);
      } 
    }
    
    inputName === 'rowsInput' 
      ? modalContext?.rows.updateQuantity(value) 
      : inputName === 'columnsInput' 
        ? modalContext?.columns.updateQuantity(value)
        : modalContext?.limits.updateQuantity(value);
  }

  useEffect(() => {
    if (inputRef.current && inputName !== 'columnsInput') inputRef.current.focus();
  }, []);

  return (
    <div className="input-group">
      <label htmlFor={inputName}>
        {labelValue}
      </label>
      <input
        id={inputName}
        name={inputName}
        type="number"
        defaultValue={minInputValue}
        min={minInputValue}
        max={inputName !== 'limitsInput' ? maxInputValue : modalContext?.rows?.quantity && modalContext?.rows?.quantity * modalContext?.columns.quantity}
        ref={inputRef}
        onChange={onChangeHandler}
      />
      <span className={`error ${!isError ? "hidden" : ""}`}>
        {errorValue || null}
      </span>
    </div>       
  ); 
}; 
