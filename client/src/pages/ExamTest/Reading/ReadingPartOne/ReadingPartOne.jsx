import { Box, Button, Typography } from "@mui/material";
import React from "react";
import "../../Reading/ExamReading.css";

const ReadingPartOne = () => {
  return (
    <>
      <Box>
        <Box className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
          <b>Read the email from Janice to her friend.&nbsp;</b>
          <strong>
            Choose one word from the list for each gap. The first one is done
            for you.
          </strong>
        </Box>
        <Box>
          <div class=" lrn_response_innerbody lrn-response-validate-wrapper">
            <div class=" lrn_response_input">
              <div class="">
                <p>Dear Sally,</p>

                <p>
                  Tim and I are on holiday in Greece. We have a nice&nbsp;
                  <span
                    class="example-interaction"
                    example-interaction="InlineChoice"
                  >
                    <select
                      no-init-selection=""
                      ui-select=""
                      fdprocessedid="tzikvs"
                    >
                      <option disabled="disabled" selected="selected">
                        view
                      </option>
                      <option disabled="disabled"></option>
                    </select>
                  </span>
                  &nbsp;of the sea from our hotel.
                </p>

                <p>
                  The weather is
                  <span data-lrn-template-response="">
                    <span class=" lrn_combobox">
                      <select
                        aria-label="Response input area"
                        class=" lrn-cloze-select lrn_cloze_response"
                        data-inputid="0"
                        fdprocessedid="0o584j"
                      >
                        <option
                          role="option"
                          value=""
                          aria-label="Please select an option - "
                        ></option>
                        <option role="option" value="large">
                          large
                        </option>
                        <option role="option" value="great">
                          great
                        </option>
                        <option role="option" value="big">
                          big
                        </option>
                      </select>
                    </span>
                  </span>
                  &nbsp;and it’s really hot.
                </p>

                <p>
                  Yesterday we went on a{" "}
                  <span data-lrn-template-response="">
                    <span class=" lrn_combobox">
                      <select
                        aria-label="Response input area"
                        class=" lrn-cloze-select lrn_cloze_response"
                        data-inputid="1"
                        fdprocessedid="rn7h4"
                      >
                        <option
                          role="option"
                          value=""
                          aria-label="Please select an option - "
                        ></option>
                        <option role="option" value="boat">
                          boat
                        </option>
                        <option role="option" value="train">
                          train
                        </option>
                        <option role="option" value="bus">
                          bus
                        </option>
                      </select>
                    </span>
                  </span>
                  &nbsp;on the lake and caught some fish.
                </p>

                <p>
                  We had lunch and then&nbsp;we visited an old&nbsp;
                  <span data-lrn-template-response="">
                    <span class=" lrn_combobox">
                      <select
                        aria-label="Response input area"
                        class=" lrn-cloze-select lrn_cloze_response"
                        data-inputid="2"
                        fdprocessedid="bheoz"
                      >
                        <option
                          role="option"
                          value=""
                          aria-label="Please select an option - "
                        ></option>
                        <option role="option" value="window.">
                          window.
                        </option>
                        <option role="option" value="cup.">
                          cup.
                        </option>
                        <option role="option" value="town.">
                          town.
                        </option>
                      </select>
                    </span>
                  </span>
                </p>

                <p>
                  Tomorrow we are going to take a car and{" "}
                  <span data-lrn-template-response="">
                    <span class=" lrn_combobox">
                      <select
                        aria-label="Response input area"
                        class=" lrn-cloze-select lrn_cloze_response"
                        data-inputid="3"
                        fdprocessedid="sug0hs"
                      >
                        <option
                          role="option"
                          value=""
                          aria-label="Please select an option - "
                        ></option>
                        <option role="option" value="drive">
                          drive
                        </option>
                        <option role="option" value="walk">
                          walk
                        </option>
                        <option role="option" value="fly">
                          fly
                        </option>
                      </select>
                    </span>
                  </span>
                  &nbsp;around.
                </p>

                <p>
                  We are going to visit some{" "}
                  <span data-lrn-template-response="">
                    <span class=" lrn_combobox">
                      <select
                        aria-label="Response input area"
                        class=" lrn-cloze-select lrn_cloze_response"
                        data-inputid="4"
                        fdprocessedid="yxrco"
                      >
                        <option
                          role="option"
                          value=""
                          aria-label="Please select an option - "
                        ></option>
                        <option role="option" value="books">
                          books
                        </option>
                        <option role="option" value="shops">
                          shops
                        </option>
                        <option role="option" value="brothers">
                          brothers
                        </option>
                      </select>
                    </span>
                  </span>
                  &nbsp;and buy clothes.
                </p>

                <p>Love,</p>

                <p>Janice</p>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ReadingPartOne;
