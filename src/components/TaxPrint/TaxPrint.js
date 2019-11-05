import React from "react";
import "./TaxPrint.css"

function TaxPrint(props){
    return(
        <div className = "tax-table-container">
            <table id = "tax-table" className = "table tax-table" >
                <thead>
                    <tr>
                        <th scope = "col" > S.NO </th>
                        <th scope = "col"> Description </th>
                        <th scope = "col" > Value </th>
                    </tr>
                </thead>
                <tbody>
                    {props.taxPrint.map((val,index)=>{
                        const {sno, descr, value, className} = val;
                        return (
                            <tr key ={sno}>
                                <td>
                                {sno}   
                                </td>
                                <td>
                                {descr}
                                </td>
                                <td className = {className}>
                                {value}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
              
            </table>
            <div>
                <button id = "back" className = "button button-small button-gray" onClick={props.backButton}> Back </button>
            </div>

        </div>

    )
}

export { TaxPrint }
