import {createContext} from 'react';



export const themes = {
  new: false
};

export const ThemeContext = createContext(
  themes.new // default value
);

export function getIsNew(){
    return themes.new
}