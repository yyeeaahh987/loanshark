import { ThemeProvider, createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props)=>{
        console.log(props)
        return props.theme.color
        // console.log(props)
        // if(props.theme==="light") return "white"
        // else return "black"
    }};
    backgroundColor: ${(props)=>{
        console.log(props)
        return props.theme.backgroundColor
        // console.log(props)
        // if(props.theme==="light") return "black"
        // else return "white"
    }};
    
  }
`;

export default GlobalStyle;
