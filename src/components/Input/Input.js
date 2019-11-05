import React,{ useRef } from "react";
import "./Input.css";

function Input(props) {
    let inputElRef = useRef();
    let valid = props.valid;
    const onButtonClick = (event) => {
        event.preventDefault();
        let income = inputElRef.current.value;
        if(!income || isNaN(income) || income<0) {
            valid = false;  
        } else {
            valid = true;
        }
        console.log(income);
        props.calculateTax(income,valid);   
    }

    return (
        <div id = "input-section-container">
            <form>
                
                <div id="income-input-section">
                    <label htmlFor="income-input"> Enter Gross Income (CAD) : </label>
                    <input id = "income-input" ref={inputElRef} type ="number" className="income-input-field" placeholder="$" title="please enter number only" name="income-inout" defaultValue={props.income} required ></input>
                    {!(props.valid) ? <label id = "error-label" className = "error-label"> *Enter income in correct format, for e.g. 70000 </label> : null}
                    <button id = "income-submit-button" className = "button button-big" onClick={onButtonClick}>Calculate Federal Tax</button>
                </div>
                
            </form>
        </div>   
    )
}

export { Input }