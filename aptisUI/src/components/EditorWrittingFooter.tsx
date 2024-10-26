import React from 'react'

type EditorFooterProps = {
	handleSubmit?: () => void
	handleCancel?:()=>void
}

const EditorWrittingFooter: React.FC<EditorFooterProps> = ({ handleSubmit,handleCancel }) => {
  return (
    <div className="flex bg-dark-layer-1 absolute bottom-0 z-10 w-full">
      <div className="mx-5 my-[10px] flex justify-between w-full">
        <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
				  <div className="px-3 py-1.5 font-bold items-center transition-all inline-flex bg-white hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2 cursor-pointer" onClick={handleCancel}>
            Cancel
          </div>
        </div>
        <div className="ml-auto flex  items-center space-x-4">
          <button
            className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-600 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
export default EditorWrittingFooter
