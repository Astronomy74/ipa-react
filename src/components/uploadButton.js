import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";


function UploadButton(){

    const FileUploadButton = () => {
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Do something with the selected file, such as upload it to a server
    console.log('Selected file:', file);
  };

  return (
    <div className="apply-file-upload">
        asdadwd
      <input
        className="file-upload__input"
        type="file"
        name="myFile[]"
        id="myFile"
        multiple 
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <button className="file-upload__button btn" type="button">Choose File(s)</button>
      <span className="file-upload__label">
        </span>
    </div>
  );
  
};

// Array.prototype.forEach.call(
//     document.querySelectorAll(".file-upload__button"),
//     function (button) {
//       const hiddenInput = button.parentElement.querySelector(
//         ".file-upload__input"
//       );
//       const label = button.parentElement.querySelector(".file-upload__label");
//       const defaultLabelText = "No file(s) selected";
  
//       // Set default text for label
//       label.textContent = defaultLabelText;
//       label.title = defaultLabelText;
  
//       button.addEventListener("click", function () {
//         hiddenInput.click();
//       });
  
//       hiddenInput.addEventListener("change", function () {
//         const filenameList = Array.prototype.map.call(
//           hiddenInput.files,
//           function (file) {
//             return file.name;
//           }
//         );
  
//         label.textContent = filenameList.join(", ") || defaultLabelText;
//         label.title = label.textContent;
//       });
//     }
//   );
  
}

export default UploadButton;


