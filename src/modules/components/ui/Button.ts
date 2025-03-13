import styled from "styled-components";

export const MainButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background-color: #000000;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #414141;
  }

  @media (min-width: 639px) {
    //$tablet-min-width
    padding: 10px 35px;
  }
`;
