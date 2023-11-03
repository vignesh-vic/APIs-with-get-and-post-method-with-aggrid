import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default function ReactApi() {
  const [inputValues, setInputValues] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Gender: "",
    Age: "",
    Active: "",
  });

  const [userDetails, setuserDetails] = useState([]);

  const [columDefination] = useState([
    { field: "FirstName" },
    { field: "LastName" },
    { field: "Email" },
    { field: "Email" },
    { field: "Gender" },
    { field: "Age" },
    { field: "Active" },

    {
      field: "Action",
      cellRenderer: ({ data }) => {
        return (
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "4px 10px ",
              borderRadius: "3px",
              cursor:'pointer'
            }}
            onClick={() => {
                handleDelete(data)
              // Add your click handler logic here
            }}
          >
            Delete
          </button>
        );
      },
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!inputValues) return;
    // console.log("input",inputValues);
    axios
      .post("http://localhost:5000/post", { newData: inputValues })
      .then((res) => {
        setuserDetails((prev) => {
          const arr = [...prev];
          arr.push(inputValues);
          return arr;
        });
        setInputValues({
          FirstName: "",
          LastName: "",
          Email: "",
          Gender: "",
          Age: "",
          Active: "",
        });
        if (res.data.message) {
          alert(res.data.message);
        }
      });
  };

  //defauldcoldefs
  const defaultCol = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  const handleDelete = (rowData) => {
    axios
      .delete("http://localhost:5000/delete", { data: { deletedName: rowData.FirstName } })
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
        }
        // Remove the deleted item from the local state
        setuserDetails((prev) => prev.filter((item) => item.FirstName !== rowData.FirstName));
        console.log("user",userDetails);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/get")
      .then((res) => {
        const { data = [] } = res?.data || {};
        if (data && data?.length) {
          setuserDetails(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
          margin: "0 auto",
        }}
      >
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          name="FirstName"
          value={inputValues.FirstName}
          onChange={handleChange}
          placeholder="FirstName"
        />
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          value={inputValues.LastName}
          name="LastName"
          onChange={handleChange}
          placeholder="LastName"
        />
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          value={inputValues.Gender}
          name="Gender"
          onChange={handleChange}
          placeholder="Gender"
        />
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          value={inputValues.Email}
          onChange={handleChange}
          name="Email"
          placeholder="Email"
        />
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          value={inputValues.Age}
          onChange={handleChange}
          placeholder="Age"
          name="Age"
        />
        <input
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
          value={inputValues.Active}
          onChange={handleChange}
          name="Active"
          placeholder="Active"
        />

        <button
          style={{
            margin: "5px",
            padding: "5px",
            width: "100%",
            borderRadius: "3px",
            backgroundColor: "blue",
            color: "white",
          }}
          onClick={handleSave}
        >
          Add
        </button>
      </div>

      {/* Render
      <div>
        {userDetails && userDetails?.length
          ? userDetails.map((values, index) => (
              <div key={index}>
                {values.FirstName}
                <button onClick={() => handleDelete(values)}>
                  {" "}
                  delete{" "}
                </button>{" "}
              </div>
            ))
          : null}
      </div> */}
      <div className=" w-[80%] p-4 ">
        <div className=" ag-theme-alpine" style={{ height: 900 }}>
          <AgGridReact
            rowData={userDetails}
            columnDefs={columDefination}
            defaultColDef={defaultCol} // Set onGridReady prop
          />
        </div>
      </div>
    </div>
  );
}
