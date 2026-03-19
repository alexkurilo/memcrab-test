import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { NumberInput } from "../numberInput/NumberInput";
import { ModalContext } from "../../providers/ModalProvider";

import "./Modal.css";


export const Modal = () => {
  const modalContext = useContext(ModalContext);
  const modalRef = useRef(null);
  const isNotDisabledButton = 
    (!modalContext?.isCanceled && !modalContext?.rows.isError && !modalContext?.columns.isError)
    || (modalContext?.isCanceled && !modalContext?.limits.isError);
  const buttonText = !modalContext?.isCanceled ? "Cancel" : "Submit";

  const onClickHandler = () => {
    if (isNotDisabledButton) {
      !modalContext?.isCanceled ? modalContext?.setCanceled(true) : modalContext?.setSubmited(true);
    }
  }
  
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
          {`Please enter the value ${!modalContext?.isCanceled ? "s ​​of M and N" : " of X"}.`}
        </h2>
        {
          !modalContext?.isCanceled ? (
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
  

export default Modal
