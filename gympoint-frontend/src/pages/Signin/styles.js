import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #ee4c63;
`;

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 360px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    padding: 30px;

    img {
        margin-top: 20px;
        margin-bottom: 30px;
    }

    label {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;

        span:first-child {
            margin-bottom: 8px;
            font-weight: bold;
            color: #444;
            text-transform: uppercase;
            font-size: 14px;
        }

        input {
            height: 45px;
            border-radius: 4px;
            width: 100%;
            border: 1px solid #ddd;
            padding: 0 13px;
            font-size: 16px;

            &::placeholder {
                color: #999;
            }
        }

        input ~ span {
            font-size: 12px;
            color: #ee4c63;
            margin-top: 5px;
        }
    }

    button {
        width: 100%;
        background-color: #ee4d64;
        color: #fff;
        font-weight: bold;
        border-radius: 4px;
        height: 45px;
        border: 0;
        transition: background 0.2s;
        margin-bottom: 20px;

        &:hover {
            background-color: ${darken(0.07, '#ee4d64')};
        }
    }
`;
