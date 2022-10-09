import React, {useState, useRef} from 'react';
import './style.scss';
import { uploadAction } from '../../../redux/actions/dashboardAction';
import { useDispatch } from 'react-redux';

function DataUpload() {
    // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  // triggers when file is selected with click
  const handleChange = async function(e) {
    e.preventDefault();
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append('file',e.target.files[0])
    await dispatch(uploadAction(formData));
    alert("file has be uploaded successfully");
  };
  
// triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
    return ( 
    <div className="page">
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
            <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
            </div> 
        </label>
        { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        </form>
    </div>
     );
}

export default DataUpload;