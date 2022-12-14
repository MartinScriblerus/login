import {ThemeContext} from './registerNewUser';
import React from 'react';
import { getSession } from "next-auth/react";

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

    return (
   
      <button 
        {...props}
        // style={{backgroundColor: theme ? "rgba(50,220,300,1)" : "rgba(50,220,300,1)"}}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export function getTheme(){
    return theme;
}

export default ThemedButton;
