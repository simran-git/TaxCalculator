import React from "react";
import { configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Main } from "./Main"
import { exportAllDeclaration } from "@babel/types";

configure({ adapter: new Adapter()});
describe('<Main />', ()=>{
    let wrapper;
    beforeEach(()=>{
        console.log("In before each");
        wrapper = shallow(<Main />);
    })

    it('wrapper should be instance of <Main />',()=>{
        const instance = wrapper.instance();
        expect(instance);
    })  
})