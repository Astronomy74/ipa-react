import React, { useRef, useState, useEffect } from "react";



function UploadButton(props){

  const fileInputRef = useRef(null);

  function handleFileUpload() {
    const file = fileInputRef.current.files[0];
    props.filePass(file);
  };



  return (
    <span>
      <input
        ref={fileInputRef}
        className="file-upload__input"
        type="file"
        multiple
        accept={props.allowAll ? '*' : '.pdf'}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <a className={props.passedClass} onClick={() => fileInputRef.current.click()}>{props.buttonText}</a>
    </span>
  );
  
  
}

export default UploadButton;


