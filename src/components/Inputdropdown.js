import React from "react";
import { useEffect, useState, useMemo } from "react";
import "./Inputdropdown.css";

const Inputdropdown = () => {
  const [emailList, setEmailList] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [currValue, setCurrValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [enteredVal, setEnteredVal] = useState("");

  // On toggle this variable triggers useMemo
  const [fetchData, setFetchData] = useState(true);

  /*
    Handle entering and filtering of the email dropdown
    it enables filtering of the dropdown email list while entering 
    through setEnteredVal
  */
  const handleEntering = (e) => {
    e.preventDefault();

    //Collect entered value
    let enteredValue = e.target.lastChild.nodeValue.trim();

    //if comma is entered then remove it before adding the value to SelectedData
    if (enteredValue[enteredValue.length - 1] === ",") {
      if (enteredValue.slice(0, enteredValue.length - 1).trim() !== "") {
        setSelectedData([
          ...selectedData,
          enteredValue.slice(0, enteredValue.length - 1),
        ]);

        //Clear the entered value on comma after adding it to selectedData
        setEnteredVal("");
        //remove lastChild
        e.target.lastChild.remove();
      }
    } else {
      // Update the entered value
      setEnteredVal(enteredValue);
    }
  };

  /*
  Handle selecting of the emails from the dropdown
  */
  const handleDataListChange = (event) => {
    event.preventDefault();

    //showing dropdown on focus
    setShowDropdown(true);
    let newVal = event.target.value;

    // If newValue is not already existant
    if (selectedData.indexOf(newVal) === -1) {
      //Add new value
      selectedData.push(newVal);

      setSelectedData(selectedData);

      setCurrValue(selectedData.join() + ",");
    }
  };

  /*
  take the entered input on Blur and add it to selectedData
  */
  const styleEnteredInput = (e) => {
    e.preventDefault();

    // If last value is entered value not span
    if (e.target.lastChild && e.target.lastChild.nodeType === 3) {
      // take entered value
      let enteredInput = e.target.lastChild.nodeValue.trim();
      //remove entered value
      e.target.lastChild.remove();
      // add entered value to existing data
      setSelectedData([...selectedData, enteredInput]);
      //Clear the netered value
      setEnteredVal("");
      // Add comma so that the dropdown show correct
      //e.target.children.push(",");
    }
  };

  /*
  Show Dropdown
  */
  const show = (e) => {
    e.preventDefault();
    setShowDropdown(true);
  };

  /*
  Show dropdown on focus
  */
  const handleOnFocus = (e) => {
    e.preventDefault();

    setShowDropdown(true);
  };

  /* Remove the entered email on clicking the close button */
  const clearEmail = (e, d) => {
    e.preventDefault();
    setSelectedData(selectedData.filter((data) => data !== d));
  };

  /*
  Prevent the backspace for the non entered emails i.e span
  */
  const preventBackspace = (e) => {
    // If keyCode for baackspace and last child is not span i.e text node
    if (e.keyCode === 8 && e.target.lastChild.nodeType !== 3) {
      //let entered = e.target.lastChild.nodeValue.trim();
      //setEnteredVal(entered.slice(0, entered.length - 1));
      e.preventDefault();
    }
  };

  /* Read CSV, only reads once through useMemo */
  const readCsv = () => {
    const file = "./Generated Email List for Interviews - Sheet1.csv";

    fetch(file)
      .then((response) => response.text())
      .then((data) => {
        // Set the original email list
        setEmailList(data.split("\n"));
      });
  };

  /**
   Set the orginal email list only once
   */
  useMemo(readCsv, [fetchData]);

  useEffect(() => {
    // triggers the useMemo through setting fetchData
    if (emailList.length === 0) {
      setFetchData(!fetchData);
    }
  }, [selectedData, fetchData, emailList]);

  return (
    <div>
      <div id="myParent">
        {/* TextArea like input for the emails */}
        <div
          id="textarea"
          contentEditable="true"
          onFocus={handleOnFocus}
          onBlur={styleEnteredInput}
          onKeyDown={preventBackspace}
          onInput={handleEntering}
          data-placeholder="Enter recepients..."
          className="myTextArea"
          //  supressing the warning for the contentEditable in React
          suppressContentEditableWarning={true}
          contentEditableWarning="disabled"
        >
          {/* if selected data is there than show it styled  */}
          {selectedData?.map(
            (d, id) =>
              d.trim() !== "" && (
                <span
                  contentEditable="false"
                  key={id}
                  id="mycustomspan"
                  className={
                    d.trim() === ""
                      ? // No value no style
                        ""
                      : emailList.includes(d)
                      ? "myCustomEmails"
                      : //Class name for entered value that does not exists in list
                        "myCustomerrorEmail"
                  }
                >
                  {d.trim() !== "" && <b>{d.trim()}</b>}&nbsp;
                  {/* If entered value does not exists in the list show error symbol */}
                  {d.trim() !== "" && !emailList.includes(d) && (
                    <span className="myExcl">&#33;</span>
                  )}
                  {/* Clear button */}
                  {d.trim() !== "" && (
                    <span onClick={(e) => clearEmail(e, d)}>
                      &nbsp;&#10006;
                    </span>
                  )}
                </span>
              )
          )}
        </div>
      </div>
      <div>
        {/* Select Dropdown */}
        <select
          onChange={handleDataListChange}
          style={{ display: !showDropdown ? "none" : "" }}
          name="emails"
          id="emails"
          onFocus={show}
          multiple
          onClick={show}
        >
          {/* Orginal email list with filtered value that are not entered */}
          {emailList?.sort().map(
            (email, index) =>
              // If it is not already selected
              !selectedData.includes(email) &&
              // If entered value is matching the pattern from emails
              email.indexOf(enteredVal) !== -1 && (
                <option key={index} value={email}>
                  {email}
                </option>
              )
          )}
        </select>
      </div>
    </div>
  );
};

export default Inputdropdown;
