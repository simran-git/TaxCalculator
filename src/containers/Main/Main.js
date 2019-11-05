import React from "react"
import Footer from "../.././components/Footer/Footer"
import Header from "../.././components/Header/Header"
import { Input } from "../.././components/Input/Input"
import { TaxPrint } from "../.././components/TaxPrint/TaxPrint"
import "./Main.css"



class Main extends React.Component {
    constructor() {
        super();
        this.state={
            income: 0,
            taxPrint : [],
            showTaxPrint: false,
            error: false
        }
        this.beginTaxCalculation = this.beginTaxCalculation.bind(this);
        this.calculateTax = this.calculateTax.bind(this);
        this.printTax = this.printTax.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this); 
    }
    
    componentDidMount() {
        setTimeout(()=>this.taxSlabs = getCurrentTaxSlabs(),
        1000);
    }

    beginTaxCalculation(income,valid) {
        if(!valid) {
            this.setState({
                error: true
            })
        } else {
            let taxSlab = this.getSlab(income);
            let { taxAmount, slabTaxAmount }  = taxSlab !== 0 ? this.calculateTax(income,taxSlab) : 0;
            this.setState({
                income,
                taxSlab,
                taxAmount,
                slabTaxAmount,
                showTaxPrint : true,
                error: false
            },()=>{
                this.printTax();
            })
        }
    }

    calculateTax(income, taxSlab) {
        let i = 1;
        let taxSlabs = this.taxSlabs;
        let taxAmount, slabTaxAmount;
        taxAmount = slabTaxAmount = 0;

        /* Base Amount is the max value of previous slab or 0 in case the income 
           falls under slab1
        */
        let baseAmount = taxSlab.slabIndex !== 1? taxSlabs.get(taxSlab.slabIndex-1).maxValue: 0;

        /* Get the max tax of slabs, i.e., tax on the range of slab @slab rate
           (range = min value of slab- max value of slab). The slabs we consider 
           are all slabs where income > slab's max values (all slabs below the 
           slab under which income actually falls)
        */
        while(i!==taxSlab.slabIndex) {
            let slab = taxSlabs.get(i);
            
            if(income > slab.maxValue) {
                taxAmount+=(slab.maxTax);
            } 
            i++;
        }
        /* This is the calculation of tax at the slab rate under which annual income falls.
           We first calculate untaxed income, i.e., the income on which tax has not been charged.
           UnTaxed Income = Income- (the income on which tax is already calculated according to rate of different slabs)
           We don't want to charge tax again on the whole income, so we calculate untaxed income.
        */
        slabTaxAmount = ((income-baseAmount)*taxSlab.taxRate)/100;
        taxAmount+=slabTaxAmount;
        return {taxAmount, slabTaxAmount};
    }

    getSlab(income) {
        const taxSlabs = this.taxSlabs;
        let slab = null;
        if(income === 0) {
            return 0;
        }
         
        for(let [key,val] of taxSlabs) {
            if(income > val.minValue && income <= val.maxValue ) {
                slab=val;
                break;
            }
        }
        return slab;
    }

    printTax() {
        const { taxSlab, income, slabTaxAmount, taxAmount } = this.state;
        const formatTaxValue = function (value) {
            return `$${Math.round(value).toLocaleString()}`;
        }
        let createRow = (sno, descr, value, className)=>({
            sno,
            descr,
            value,
            className
        });
        let taxPrint = [];
        let sno = 1;
        let baseAmount = taxSlab.minValue;

        /* Print Header */
        taxPrint.push(
            createRow(
                sno, 
                "Gross Annual Salary Entered ", 
                formatTaxValue(income)
            )
        )
        sno++;

        /* Print Base Amount */
        taxPrint.push(
            createRow(
                sno,
                `Base Amount [ slab ${taxSlab.slabIndex} ], 
                income within [ ${formatTaxValue(taxSlab.minValue)}-${formatTaxValue(taxSlab.maxValue)} ]`,
                formatTaxValue(baseAmount)
            )
        );
        sno++;

        /* All the push to tax additions below are for printing other details of Tax Calculations */
        taxPrint.push(
            createRow(
                sno,
                `Amount to be taxed in slab ${taxSlab.slabIndex} (Line ${sno-2}-${sno-1})`,
                formatTaxValue(income-baseAmount)
            )
        );
        sno++;
        taxPrint.push(
            createRow(
                sno,
                `Tax @${taxSlab.taxRate}% on amount from Line${sno-1}, 
                ${formatTaxValue(income-baseAmount)}, [ slab${taxSlab.slabIndex} ]`,
                formatTaxValue(slabTaxAmount)
            )
        );
        sno++;
        if(baseAmount!==0) {
            taxPrint.push(
                createRow(
                    sno,
                    `-----Calculating tax on Base Amount, ${formatTaxValue(baseAmount)} from Line 2-----`,
                    "-"
                )
            );
            sno++;
            let count = 1;
            while(count < taxSlab.slabIndex) {
                let slab = this.taxSlabs.get(count);
                taxPrint.push(
                    createRow(
                        sno,
                        `Tax on ${count === 1 ? 'first' : 'next'} ${formatTaxValue(slab.taxRange)} 
                        @${slab.taxRate}%  [ slab${slab.slabIndex} ]`,
                        formatTaxValue(slab.maxTax) 
                    )
                );
                sno++;
                count++;
            }
            
        } else {
            taxPrint.push(
                createRow(
                    sno,
                    `Tax on Base Amount`,
                    formatTaxValue(0)
                )
            );
            sno++;
        }
        taxPrint.push(
            createRow(
                sno,
                'Net Federal Tax',
                formatTaxValue(taxAmount),
                "emphasized-value"
            )
        );
        sno++;
        taxPrint.push(
            createRow(
                sno,
                'Effective Tax Rate',
                `${((taxAmount/income)*100).toFixed(2)}%`,
                "emphasized-value"
            )
        );
        sno++;
        this.setState({
             taxPrint
         })   

    }

    handleBackButton() {
        this.setState({
            showTaxPrint: false
        })
    }

    render() {
        let page = this.state.showTaxPrint ? 
        <TaxPrint income = {this.state.income} taxAmount = {this.state.taxAmount} 
        slab = {this.state.taxSlab} taxPrint={this.state.taxPrint} backButton = {this.handleBackButton}/> : 
        <Input calculateTax={this.beginTaxCalculation} income = {this.state.income ? this.state.income : ""} 
        valid = {!this.state.error}/>

        return(
            <div className = "main-container">
                <Header/>
                <div id = "main">
                    {
                    page
                    }
                </div>
                <Footer/>
            </div>
        )
    }
}

function getCurrentTaxSlabs() {
    let slab1 = new Slab(1,0,47630,15);
    let slab2 = new Slab(2,47630,95259,20.5);
    let slab3 = new Slab(3,95259,147667,26);
    let slab4 = new Slab(4,147667,210371,29);
    let slab5 = new Slab(5,210371,Infinity,33);
    let slabs = new Map();
    slabs.set(slab1.slabIndex,slab1);
    slabs.set(slab2.slabIndex,slab2);
    slabs.set(slab3.slabIndex,slab3);
    slabs.set(slab4.slabIndex,slab4);
    slabs.set(slab5.slabIndex,slab5);
    return slabs
}

function Slab(slabIndex,minValue, maxValue, taxRate) {
    this.slabIndex = slabIndex;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.taxRate = taxRate;
    this.taxRange = this.maxValue<10000000000? this.maxValue-this.minValue:undefined;
    this.maxTax = this.taxRange?((this.taxRate*this.taxRange)/100) : undefined     
}

export { Main };