import { Button } from "antd";
import React, { useState } from "react";
import "./SearchBar.css";
import {
    SearchOutlined, CloseOutlined
  } from '@ant-design/icons';
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    let searchWord = event.target.value;
    setWordEntered(searchWord);
    // let newFilter = data.filter((value) => {
    //   return value.firstName.toLowerCase().includes(searchWord.toLowerCase());
    // });
    let newFilter = data;

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            // <SearchIcon />
            // <Button></Button>
            <SearchOutlined />
          ) : (
            // <CloseIcon id="clearBtn" onClick={clearInput} />
            <CloseOutlined onClick={clearInput}/>
            // <Button onClick={clearInput}></Button>
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" href={value.link} target="_blank">
                <p>{value.title} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;