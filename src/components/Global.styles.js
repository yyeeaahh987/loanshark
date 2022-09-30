// import styled, { keyframes } from 'styled-components'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
export const lightTheme = {
    color:"black",
    background:"white",
	// primary: '#fff',
	// text: '#000',
	// fontFamily: 'Segoe UI'
}
export const darkTheme={
    color:"white",
    background:"radialGradient(circle, rgba(0,0,0,1) 0%, rgba(17,17,17,1) 74%)"
	
	// primary: '#000',
	// text: '#fff',
	// fontFamily: 'Segoe UI'
}


// const GlobalStyle = createGlobalStyle`
//   body {
//     color: ${(props)=>{
//         console.log(props)
//         if(props.theme==="light") return "white"
//         else return "black"
//     }};
//     background: ${(props)=>{
//         console.log(props)
//         if(props.theme==="light") return "black"
//         else return "white"
//     }};
    
//   }
// `;

// export default GlobalStyle;
