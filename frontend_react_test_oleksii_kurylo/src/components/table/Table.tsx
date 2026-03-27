import { type FC } from "react";

import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";

import "./Table.css";

export const Table: FC = () => (
  <div className='table'>
    <table className="content-table">
      <TableHeader/>
      <TableBody/>
    </table>
  </div>
);
