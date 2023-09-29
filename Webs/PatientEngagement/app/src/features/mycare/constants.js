/* istanbul ignore file */
import {G, Path, Svg} from 'react-native-svg';
import React from 'react';

export const QuestionType = {
  TEXT: 0,
  DATE: 1,
  YESNO: 2,
  NUMBER: 3,
  DROPDOWN: 4,
  CHECKBOX: 5,
  RADIO: 6,
  MULTILINE: 7,
  DATETIME: 12,
};

global.newAssessmentCount = 0;
export const SvgTickIcon = () => {
  return (
    <Svg
      height="76.816"
      viewBox="0 0 76.828 76.816"
      width="76.828"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m68.745 70.284c-11.772 9.609-48.528 9.609-60.059 0-11.772-9.609-10.57-50.69 0-61.5s49.489-10.811 60.059 0 11.771 51.89 0 61.5z"
        fill="#dcedc8"
        transform="translate(-.301 -.675)"
      />
      <Path
        d="m53.209 54.484c-9.1 7.428-37.513 7.428-46.427 0-9.1-7.428-8.171-39.184 0-47.541s38.256-8.357 46.427 0 9.1 40.113 0 47.541z"
        fill="#8bc34a"
        transform="translate(8.418 8.03)"
      />
      <Path
        d="m30.363 40.9c-8.172 6.5-17.271 9.84-25.814 10.026-6.314-10.771-5.014-36.956 2.415-44.57 6.685-6.871 27.67-8.171 39.741-3.9 2.971 12.257-3.157 27.856-16.342 38.444z"
        fill="#aed581"
        opacity=".2"
        transform="translate(8.237 8.617)"
      />
      <Path
        d="m93.7 126.084a2.968 2.968 0 0 1 -2.5-1.249l-7.772-9.993a3.165 3.165 0 1 1 5-3.886l5.274 6.8 11.659-15.128a3.165 3.165 0 1 1 5 3.886l-14.157 18.32a3.63 3.63 0 0 1 -2.504 1.25z"
        fill="#fff"
        transform="translate(-58.473 -75.359)"
      />
    </Svg>
  );
};
export const SvgCrossIcon = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="90.828"
      height="90.816"
      viewBox="0 0 76.828 76.816">
      <G id="icn_big_No" transform="translate(-20 -157)">
        <Path
          id="Path_4"
          data-name="Path 4"
          d="M68.745,70.284c-11.772,9.609-48.528,9.609-60.059,0-11.772-9.609-10.57-50.69,0-61.5s49.489-10.811,60.059,0S80.516,60.674,68.745,70.284Z"
          transform="translate(19.699 156.325)"
          fill="#ffcdd2"
        />
        <G
          id="Group_32"
          data-name="Group 32"
          transform="translate(0.281 -0.266)">
          <Path
            id="Path_7"
            data-name="Path 7"
            d="M53.209,54.484c-9.1,7.428-37.513,7.428-46.427,0-9.1-7.428-8.171-39.184,0-47.541s38.256-8.357,46.427,0S62.309,47.056,53.209,54.484Z"
            transform="translate(28.418 164.679)"
            fill="#f44336"
          />
          <G
            id="Group_13"
            data-name="Group 13"
            transform="translate(28.746 165.266)"
            opacity="0.2">
            <Path
              id="Path_5"
              data-name="Path 5"
              d="M30.363,40.9C22.191,47.4,13.092,50.74,4.549,50.926-1.765,40.155-.465,13.97,6.964,6.356c6.685-6.871,27.67-8.171,39.741-3.9C49.676,14.713,43.548,30.312,30.363,40.9Z"
              transform="translate(-0.509 0)"
              fill="#e57373"
            />
          </G>
        </G>
        <Path
          id="Path_20"
          data-name="Path 20"
          d="M140.6,140.764a2.962,2.962,0,0,1-4.023,0l-9.272-9.272-9.272,9.272a2.845,2.845,0,1,1-4.023-4.023l9.446-9.272-9.446-9.272a2.845,2.845,0,1,1,4.023-4.023l9.272,9.446,9.272-9.446A2.845,2.845,0,1,1,140.6,118.2l-9.272,9.272,9.272,9.272A2.661,2.661,0,0,1,140.6,140.764Z"
          transform="translate(-69.226 67.614)"
          fill="#fff"
        />
      </G>
    </Svg>
  );
};
export const SvgWhiteTickIcon = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="90.828"
      height="90.816"
      viewBox="0 0 76.828 76.816">
      <G id="icn_big_Yes" transform="translate(-20 -156.649)">
        <Path
          id="Path_4"
          data-name="Path 4"
          d="M68.745,70.284c-11.772,9.609-48.528,9.609-60.059,0-11.772-9.609-10.57-50.69,0-61.5s49.489-10.811,60.059,0S80.516,60.674,68.745,70.284Z"
          transform="translate(19.699 155.974)"
          fill="#bbdefb"
        />
        <Path
          id="Path_7"
          data-name="Path 7"
          d="M53.209,54.484c-9.1,7.428-37.513,7.428-46.427,0-9.1-7.428-8.171-39.184,0-47.541s38.256-8.357,46.427,0S62.309,47.056,53.209,54.484Z"
          transform="translate(28.418 164.679)"
          fill="#2196f3"
        />
        <G
          id="Group_13"
          data-name="Group 13"
          transform="translate(28.746 165.266)"
          opacity="0.2">
          <Path
            id="Path_5"
            data-name="Path 5"
            d="M30.363,40.9C22.191,47.4,13.092,50.74,4.549,50.926-1.765,40.155-.465,13.97,6.964,6.356c6.685-6.871,27.67-8.171,39.741-3.9C49.676,14.713,43.548,30.312,30.363,40.9Z"
            transform="translate(-0.509 0)"
            fill="#64b5f6"
          />
        </G>
        <Path
          id="Path_6"
          data-name="Path 6"
          d="M93.7,126.084a2.968,2.968,0,0,1-2.5-1.249l-7.772-9.993a3.165,3.165,0,1,1,5-3.886l5.274,6.8,11.659-15.128a3.165,3.165,0,1,1,5,3.886l-14.157,18.32A3.63,3.63,0,0,1,93.7,126.084Z"
          transform="translate(-38.473 81.29)"
          fill="#fff"
        />
      </G>
    </Svg>
  );
};
