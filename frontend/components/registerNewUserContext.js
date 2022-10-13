import {ThemeContext} from './registerNewUser';
import React from 'react';
import { getSession } from "next-auth/react";
import { getOutput, test } from './test';
import { createUserRoute } from '../pages/post/createUserRoute';
const sesh = getSession();
class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;

    // if(theme){
    //     sesh.newUser = true;
    //     // test(true);
    // } else {
    //     // test(false);
    //     sesh.newUser = false;
    // }
    // console.log("THEM<E> ", theme);
    // console.log("sesh ?? ", sesh.newUser);
    //document.isNew = theme;
    if(theme){
        test(false);
    } else {
    
        test(true);
    }

    return (
   
      <button 
        {...props}
        style={{backgroundColor: theme ? "blue" : "green"}}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export function getTheme(){
    return theme;
}

export default ThemedButton;
