import React from "react";
import { configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TaxPrint } from "./TaxPrint"

configure({ adapter: new Adapter()});
describe('<TaxPrint />', ()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<TaxPrint />);
    })

    it('wrapper should be instance of <TaxPrint />',()=>{
        const instance = wrapper.instance();
        expect(instance)
    }) 
})  