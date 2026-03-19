import { useContext } from "react";
import { ModalContext } from "./providers/ModalProvider";
import { Modal } from "./components/modal/Modal"
import { Table } from "./components/table/Table"

import './App.css'


export const App = () => {
  const modalContext = useContext(ModalContext);

  return (
    <div className='app'>
      {!modalContext?.isSubmited ? <Modal/> : <Table/>}
    </div>
  ); 
}; 
