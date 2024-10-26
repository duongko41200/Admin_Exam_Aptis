import dataProvider from '@renderer/providers/dataProviders/dataProvider'
import React, { useState } from 'react'

const ImportFile = () => {
  const [file, setFile] = useState(null)
  const [jsonData, setJsonData] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }
const handleSubmit = async (event) => {
    event.preventDefault()

    if (file) {
        const reader = new FileReader()
        reader.onload = (e:any) => {
            try {
                const data = JSON.parse(e.target.result)
                setJsonData(data)

                const updateData = dataProvider.updateFileUpload('writting', { data })
                console.log('File content:', e.target.result) // Log the content of the file
                console.log(data) // Log the parsed JSON data
            } catch (error) {
                console.error('Error parsing JSON:', error)
                alert('Error parsing JSON')
            }
        }
        reader.readAsText(file) // Read file as text
    }
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".json" onChange={handleFileChange} required />
        <button type="submit">Upload JSON</button>
      </form>
      {jsonData && (
        <div>
          <h3>Data from JSON:</h3>
          {/* <pre>{JSON.stringify(jsonData, null, 2)}</pre> */}
        </div>
      )}
    </div>
  )
}

export default ImportFile
