import { useState } from 'react'
import './SearchInput.css'

interface SearchInputProps {
  handleSearchYT: (url: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ handleSearchYT }) => {
  const [url, setUrl] = useState<string>('')

  return (
    <>
      <div id="page">
        <div id="searchForm">
          <fieldset>
            <input
              id="s"
              type="text"
              placeholder="Url YouTube..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div id="submitButton" onClick={() => handleSearchYT(url)}>
              <div>SEARCH</div>
            </div>
          </fieldset>
        </div>

        <div id="resultsDiv"></div>
      </div>
    </>
  )
}

export default SearchInput
