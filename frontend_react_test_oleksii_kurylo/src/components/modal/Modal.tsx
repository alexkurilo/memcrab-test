import { type FC, useContext, useRef } from "react";
import { createPortal } from "react-dom";

import { NumberInput } from "../numberInput/NumberInput";
import { ModalContext } from "../../providers/ModalProvider";

import "./Modal.css";

export const Modal: FC = () => {
  const modalContext = useContext(ModalContext);
  const modalRef = useRef(null);
  const isNotDisabledButton = 
    (!modalContext?.cancel?.value && !modalContext?.rows.isError && !modalContext?.columns.isError)
    || (modalContext?.cancel?.value && !modalContext?.limits.isError);
  const buttonText = !modalContext?.cancel?.value ? "Cancel" : "Submit";

  const onClickHandler = () => {
    if (isNotDisabledButton) {
      !modalContext?.cancel?.value 
        ? modalContext?.cancel?.updateValue(true) 
        : modalContext?.submit?.updateValue(true);
    }
  };
  
  return createPortal( 
    <div
      aria-modal={true}
      aria-labelledby="heading"
      role="dialog"
      className='modal_view'
      ref={modalRef}
    >
      <div className="modal-container">
        <h2 id="heading">
          {`Please enter the value${!modalContext?.cancel?.value ? "s ​​of M and N" : " of X"}.`}
        </h2>
        {
          !modalContext?.cancel?.value ? (
            <>
              <NumberInput inputName="rowsInput"/>
              <NumberInput inputName="columnsInput"/>
            </>
          ) : (
            <NumberInput inputName="limitsInput"/>
          )
        }
        <button
          disabled={!isNotDisabledButton}
          onClick={onClickHandler}
        >
          {buttonText}
        </button>
      </div>
    </div>,
    document.body
  ); 
}; 
