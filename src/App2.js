import "./App.css";
import { useState } from "react";

const emailList = [
  "ebrekke@gmail.com",
  "rigoberto.weimann@schuppe.com",
  "ijakubowski@barton.com",
  "ivah83@gmail.com",
  "orville36@gmail.com",
];

function App() {
  const [selectedData, setSelectedData] = useState([]);
  const [shownVal, setShownVal] = useState("");
  const [currValue, setCurrValue] = useState("");

  const handleDataListChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setCurrValue(e.target.value);

    setSelectedData(e.target.value.split(","));
    console.log(e.target.value.split(","));
  };

  const addComma = (e) => {
    e.preventDefault();
    if (currValue !== "" && currValue[currValue.length - 1] !== ",") {
      setCurrValue(currValue + ",");
    }
  };

  const clearEmail = (e, d) => {
    e.preventDefault();
    setSelectedData(selectedData.filter((data) => data != d));
    setCurrValue(selectedData.join());
  };
  return (
    <div className="App">
      <div id="myCustomInput">
        <div id="myInputValue">
          {currValue &&
            currValue.split(",").map(
              (d, id) =>
                d != "" && (
                  <span
                    key={id}
                    className={
                      emailList.includes(d)
                        ? "myCustomEmails"
                        : "myCustomerrorEmail"
                    }
                  >
                    {d} &nbsp;{" "}
                    {!emailList.includes(d) && (
                      <span class="myExcl">&#33;</span>
                    )}{" "}
                    &nbsp;
                    <span onClick={(e) => clearEmail(e, d)}>&#10006;</span>
                  </span>
                )
            )}
        </div>
        <input
          type="email"
          list="email"
          id="emails"
          value={currValue}
          name="email"
          onChange={handleDataListChange}
          onFocus={addComma}
          placeholder="Enter Receipients..."
          autoComplete="off"
          multiple
        />

        <datalist
          value={shownVal}
          //onChange={handleDataListChange}
          id="email"
        >
          {emailList?.map(
            (email, index) =>
              !selectedData.includes(email) && (
                <option key={index}> {email} </option>
              )
          )}
        </datalist>
      </div>
    </div>
  );
}

export default App;
