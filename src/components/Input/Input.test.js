import React from "react";
import { configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Input } from "./Input"

configure({ adapter: new Adapter()});
describe('<Input />', ()=>{
    let wrapper;
    beforeEach(()=>{
        console.log("In before each");
        wrapper = shallow(<Input />);
    })

    it('wrapper should be instance of <Input />',()=>{
        const instance = wrapper.instance(); 
    })  
})