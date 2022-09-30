import styled ,{ withTheme }  from 'styled-components';

export const Title = styled.h1`
  font-size: ${(props) => {
    console.log(props)
    if(props.theme.primary==="#000") return "3.5em"
    else return "1.5em"
  }};
  text-align: center;
  color: palevioletred;
`;