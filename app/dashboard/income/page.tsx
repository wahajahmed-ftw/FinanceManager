"use client";
import { useState } from "react";
import IncomeFormPopup from "./IncomeForm/incomeform";
import IncomeTable from "./incomeTable/incometable";

export default function Income() {
  const [dirty,setDirty] = useState(false)
  return (
    <div>
      <IncomeFormPopup setDirty={setDirty}/>
      <IncomeTable dirty={dirty} setDirty={setDirty} />
    </div>
  );
}
