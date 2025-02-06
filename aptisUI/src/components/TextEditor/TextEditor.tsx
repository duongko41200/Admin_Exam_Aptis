import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css";

/* Custom "star" icon for the toolbar */
const CustomButton = () => <span className="octicon octicon-star" />;

/* Event handler to insert a star at the cursor position */
const insertStar = function () {
  const cursorPosition = this.quill.getSelection()?.index || 0;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
};

/* Custom toolbar component */
const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <select className="ql-font">
      <option value="serif"></option>
      <option value="monospace"></option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline"></button>

    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
	<span className="ql-formats">
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-indent" value="-1"></button>
    <button className="ql-indent" value="+1"></button>
  </span>
    <span className="ql-formats">
      <button className="ql-direction" value="rtl"></button>
      <select className="ql-align"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-header" value="1"></button>
      <button className="ql-header" value="2"></button>
      <button className="ql-blockquote"></button>
      <button className="ql-code-block"></button>
    </span>
    <button className="ql-strike"></button>

    <button className="ql-link"></button>

    <button className="ql-image"></button>

    {/* <button className="ql-insertStar">
      <CustomButton />
    </button> */}
  </div>
);

/* Main TextEditor Component */
const TextEditor = ({ placeholder, setSuggestion, suggestion }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill
        .getModule("toolbar")
        .addHandler("insertStar", insertStar.bind({ quill }));
    }
  }, []);

  return (
    <div className="text-editor">
      <CustomToolbar />
      <ReactQuill
        ref={quillRef}
        value={suggestion}
        onChange={setSuggestion}
        placeholder={placeholder}
        modules={TextEditor.modules}
        formats={TextEditor.formats}
        theme="snow"
      />
    </div>
  );
};

/* Quill modules */
TextEditor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertStar: insertStar,
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

/* Quill formats */
TextEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "background",
  "direction",
  "align",
  "strike",
  "code-block",
  "stroke",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

/* PropType validation */
TextEditor.propTypes = {
  placeholder: PropTypes.string,
};

/* Render component */
export default TextEditor;
