import { PropertySafetyFilled } from "@ant-design/icons";
import { split, values } from "lodash";
import React, { useState } from "react";
import { useEffect } from 'react';


const UploadAndDisplayImage = (props) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [show, setShow] = useState(true);
    // useEffect(() => {
    //   setSelectedImage(props.image)
    // }, [])

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    function chooseImage(file) {
        // const file = document.querySelector('#myfile').files[0];
        toBase64(file).then( v => {
            // let a = "data:image/png;" +v.split(';')[1];
            //  console.log("a", v);
            setShow(true);
             setSelectedImage(v);
             let data ={
               "key" : props.rowData?.productId,
               "image" : v
             }
            props.upLoadImage(data);
        });

        
        // console.log(await toBase64(file).then(v => v));
     }

     function removeImage(){
      setSelectedImage(null);
      setShow(false);
     }


  return (
    <div>
      
        <div>
          {/* <h1>abc {props.rowData}</h1> */}
        {/* <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} /> */}
        {/* <img alt="not fount" width={"50px"} src={selectedImage} /> */}
        <img alt="not fount" width={"50px"} src={show ? selectedImage || props.rowData?.image : '' } />
        
        <br />
        <button onClick={()=>removeImage() }>Remove</button>
        </div>
      <br />
     
      <br /> 
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
        //   setSelectedImage(event.target.files[0]);
          chooseImage(event.target.files[0]);
        }}
      />
    </div>
    
  );
};

export default UploadAndDisplayImage;