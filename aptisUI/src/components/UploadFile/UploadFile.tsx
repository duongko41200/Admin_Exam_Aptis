import dataProvider from "../../providers/dataProviders/dataProvider";

export const InputFileUpload =  ({handleFileUpload}) => {


  return (
    <div>
      <div style={{ margin: 10 }}>
        <label style={{ margin: 10 }}>Upload Image:</label>
        <input type="file" onChange={(e) => handleFileUpload(e)} />
      </div>
    </div>
  );
};
