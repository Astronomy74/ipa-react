import React, { useRef, useState } from "react";




function UploadButton(props){

  const [fileName, setfileName] = useState("No file(s) selected");

  
  const fileInputRef = useRef(null);
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    props.filePass(file);
    setfileName(file.name);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  return (
    <div className="apply-file-upload">
      <input
        ref={fileInputRef}
        className="file-upload__input"
        type="file"
        name="myFile[]"
        id="myFile"
        multiple 
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <button onClick={handleButtonClick} className="file-upload__button btn" type="button">Choose File(s)</button>
      <span className="file-upload__label">
        {fileName}
      </span>
    </div>
  );
  


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


