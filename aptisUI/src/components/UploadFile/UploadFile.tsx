import dataProvider from "../../providers/dataProviders/dataProvider";

export const InputFileUpload =  () => {
  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append("file", e.target.files[0], "file");

    const data = await dataProvider.create("speakings", { data: uploadData });

    console.log({ data });

  };

  return (
    <div>
      <div style={{ margin: 10 }}>
        <label style={{ margin: 10 }}>Cloudinary:</label>
        <input type="file" onChange={(e) => handleFileUpload(e)} />
      </div>
    </div>
  );
};
