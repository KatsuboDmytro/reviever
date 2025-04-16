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
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;

  &:hover {
    background-color: #414141;
  }

  @media (min-width: 639px) { //$tablet-min-width
    padding: 10px 35px;
  }
`;

export const BorderButton = styled.button`
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 10px;
  background-color: #fff;
  color: #000000;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease-in-out;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #dadada;
  }
`;

export const FullWidthButton = styled.button`
  padding: 10px 15px;
  width: 100%;
  grid-column: 1 / -1;
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

  @media (min-width: 639px) { //$tablet-min-width
    padding: 10px 35px;
  }
`;
