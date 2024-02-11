import {createContext, useContext, useState} from 'react';

const ThemeContext = createContext({
  theme: "light",
})

export const ThemeContextProvider = ({children, value}) => {
  const context = useContext(ThemeContext)
  const [state, setState] = useState({
    ...context,
    ...value,
  })

  return <ThemeContext.Provider value={{...state,setState}} >
    <div data-theme={state.theme}>
      {children}
    </div>
  </ThemeContext.Provider>

}
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeContextProvider");
  }
  return context;
}