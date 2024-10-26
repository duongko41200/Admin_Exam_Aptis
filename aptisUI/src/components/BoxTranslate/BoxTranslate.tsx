import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { countWord } from '@renderer/utils/countWord'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './BoxTranslate.css'
interface DictionaryData {
  text?: string
  audio?: string
  definition?: string[]
  example?: string[]
  typeWord?: string
  synonyms?: string[]
  word?: string
  translate?: string
}
export const BoxTranslate = ({ showModal, CloseModalTranslate, selectedText }) => {
  const [dictionarys, setDictionarys] = useState<DictionaryData>({})
  const [isModalTranslate, setIsModalTranslate] = useState<boolean>(true)
  // const [selectedText, setSelectedText] = useState<string>('')
  const [lengthText, setLengthText] = useState<number>(0)
  const [isTextHighlighted, setIsTextHighlighted] = useState<boolean>(true)
  const [translateContent, setTranslateContent] = useState('')
  const [examples, setExamples] = useState([])
  const [pronunciations, setPronunciations] = useState('')
  const [audio, setAudio] = useState('')

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ top: 100, left: 400 });

  // const handleTranlate = async () => {
  //   // Định nghĩa các tùy chọn cho yêu cầu dịch văn bản
  //   const translateOptions = {
  //     method: 'POST',
  //     url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
  //     params: {
  //       from: 'en',
  //       to: 'vi',
  //       'api-version': '3.0',
  //       profanityAction: 'NoAction',
  //       textType: 'plain'
  //     },
  //     headers: {
  //       'x-rapidapi-key': 'e819c66cf5msh81f3e3bb496fc32p1db234jsn08eddfddaf6f',
  //       'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
  //       'Content-Type': 'application/json'
  //     },
  //     data: [{ Text: selectedText }]
  //   }

  //   // // Định nghĩa các tùy chọn cho yêu cầu lấy định nghĩa
  //   const definitionOptions = {
  //     method: 'GET',
  //     url: `https://e2e-dictionary.p.rapidapi.com/dictionary/${selectedText}`,
  //     headers: {
  //       'x-rapidapi-key': 'e819c66cf5msh81f3e3bb496fc32p1db234jsn08eddfddaf6f',
  //       'x-rapidapi-host': 'e2e-dictionary.p.rapidapi.com'
  //     }
  //   }

  //   try {
  //     // Gọi API để lấy định nghĩa

  //     // Gọi API để dịch văn bản
  //     const translateResponse = await axios.request(translateOptions)
  //     const translatedText = translateResponse.data[0].translations[0].text
  //     setTranslateContent(translatedText)

  //     // Cập nhật nội dung dịch
  //     // const definitionResponse = await axios.request(definitionOptions)
  //     // const dataRes = definitionResponse.data[0]

  //     // let pronunciations = dataRes.phonetic
  //     // let audioURL = dataRes.phonetics[0]?.audio
  //     // setPronunciations(pronunciations)
  //     // setAudio(audioURL)
  //   } catch (error) {
  //     console.error('Error in handleTranslate:', error)
  //   }
  // }

  const handleTranlateAi = () => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBfSJESoZkmSbaHucbfcku-lYEP0EfpMaQ`

    const content = `   ${selectedText} 
    Translate the above sentence into Vietnamese, the result is just a translation`

    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: content
                }
              ]
            }
          ]
        })
      })
        .then((response) => {
          console.log({ response })
          return response.json()
        })
        .then((data) => {
          console.log('dataa lạ:L', data)
          if (data.candidates && data.candidates.length > 0) {
            const output = data.candidates[0].content.parts[0].text // Adjust based on actual response structure

            console.log({ output })
            setTranslateContent(output)
          } else {
            console.error('API response does not contain expected output')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    } catch (error) {
      console.log('lỗi:', error)
    }
  }
  const handleMouseDown = (e) => {
    // Nếu chuột nhấn vào phần tiêu đề modal, bắt đầu kéo
    console.log("test vào đây 1")
    setDragging(true);
    const startX = e.clientX - position.left;
    const startY = e.clientY - position.top;

    // Khi chuột di chuyển, thay đổi vị trí modal
    const handleMouseMove = (moveEvent) => {

      if (!dragging) return;
      const newLeft = moveEvent.clientX - startX;
      const newTop = moveEvent.clientY - startY;
    
      // Giới hạn modal trong phạm vi cửa sổ
      const maxLeft = window.innerWidth - 300;  
      const maxTop = window.innerHeight - 200;  
    
      setPosition({
        left: Math.min(Math.max(newLeft, 0), maxLeft),
        top: Math.min(Math.max(newTop, 0), maxTop),
      });
    };

    // Khi thả chuột, kết thúc kéo
    const handleMouseUp = () => {
      // setDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Lắng nghe sự kiện di chuyển chuột và thả chuột
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  
  useEffect(() => {
    console.log('translate many', selectedText)
    if (selectedText && showModal) {
      handleTranlateAi()
    }
  }, [showModal])

  // if (!showModal) return null;

  // var tag = document.createElement('script');

  // tag.src = "https://youglish.com/public/emb/widget.js";
  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // // 3. This function creates a widget after the API code downloads.
  // var widget;
  // function onYouglishAPIReady(){
  //   widget = new YG.Widget("widget-1", {
  //     width: 640,
  //     components:9, //search box & caption
  //     events: {
  //       'onFetchDone': onFetchDone,
  //       'onVideoChange': onVideoChange,
  //       'onCaptionConsumed': onCaptionConsumed
  //     }
  //   });
  //   // 4. process the query
  //   widget.fetch("courage","english");
  // }

  // var views = 0, curTrack = 0, totalTracks = 0;

  // // 5. The API will call this method when the search is done
  // function onFetchDone(event){
  //   if (event.totalResult === 0)   alert("No result found");
  //   else totalTracks = event.totalResult;
  // }

  // // 6. The API will call this method when switching to a new video.
  // function onVideoChange(event){
  //   curTrack = event.trackNumber;
  //   views = 0;
  // }

  // // 7. The API will call this method when a caption is consumed.
  // function onCaptionConsumed(event){
  //   if (++views < 3)
  //     widget.replay();
  //   else
  //     if (curTrack < totalTracks)
  //       widget.next();
  // }

  return (
    <>
      {showModal && (
        <div
          className="modal__preview p-2  z-10 "
          // :className="type === 'check' ? 'p-4' : ''"

        >
          {isTextHighlighted && (
            <>
              {isTextHighlighted && (
                <div>
                  {isModalTranslate && (
                    <div
                      className={`translate ${countWord(selectedText) <= 1 ? 'w-[350px]' : 'w-[500px]'} `} 
                      style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        // background: 'white',
                        border: '1px solid #ccc',
                        // padding: '20px',
                        zIndex: 1000,
                        // cursor: 'move',
                      }}
                    >
                      <div className="header flex justify-end cursor-move"   onMouseDown={handleMouseDown}>
                        <div onClick={CloseModalTranslate} className='cursor-pointer'>
                          <HighlightOffIcon fontSize="large" />
                        </div>
                      </div>
                      <div className="content">
                        <div className="word">
                          <div className="word-value">
                            <div>
                              {countWord(selectedText) <= 1 ? (
                                <div className="vaule none-select">{selectedText}</div>
                              ) : (
                                <div className="translate-text none-select">{selectedText}</div>
                              )}
                            </div>

                            {countWord(selectedText) <= 1 && (
                              <div className="pronounce d-flex  none-select ">
                                <div>{pronunciations}</div>
                              </div>
                            )}
                          </div>

                          {countWord(selectedText) <= 1 && (
                            <div className="voice">
                              <audio controls className="audio">
                                <source src={audio} type="audio/mpeg" />
                              </audio>
                            </div>
                          )}
                        </div>

                        <div className="box-translate">
                          {countWord(selectedText) <= 1 && (
                            <div className="icon-dictionary">
                              {/* <!-- //google --> */}
                              <a
                                href={`https://www.google.com/search?q=${selectedText}&sca_esv=588712944&sxsrf=AM9HkKnnjxqpovA6jmQe1Eg3nrv-7dLoxQ%3A1701950075179&ei=e7JxZaDMCsbj2roPx5aTiA4&ved=0ahUKEwjg9Z-Nov2CAxXGsVYBHUfLBOEQ4dUDCBA&uact=5&oq=dog&gs_lp=Egxnd3Mtd2l6LXNlcnAiA2RvZzIKECMYgAQYigUYJzIKECMYgAQYigUYJzILEC4YgwEYsQMYgAQyCxAAGIAEGLEDGIMBMgoQABiABBiKBRhDMggQABiABBixAzIFEC4YgAQyCBAAGIAEGLEDMgsQABiABBixAxiDATIFEAAYgARIvwxQAFjWCXABeAGQAQCYAbMBoAHZA6oBAzAuM7gBA8gBAPgBAagCFMICBxAjGOoCGCfCAhYQABiABBjjBBjpBBjqAhi0AhgK2AEBwgIUEAAYgAQY4wQY6QQY6gIYtALYAQHCAhAQABgDGI8BGOoCGLQC2AECwgIQEC4YAxiPARjqAhi0AtgBAsICDBAjGIAEGIoFGBMYJ8ICBBAjGCfCAgsQLhiABBixAxiDAeIDBBgAIEGIBgG6BgYIARABGAG6BgYIAhABGAo&sclient=gws-wiz-serp`}
                                target="”_blank”"
                              >
                                <svg width="24" height="16" fill="none">
                                  <path
                                    d="M.5 8A7.5 7.5 0 018 .5h8a7.5 7.5 0 010 15H8A7.5 7.5 0 01.5 8z"
                                    stroke="#8C8C8C"
                                  ></path>
                                  <g clip-path="url(#gg-icon_svg__clip0_8801_60807)">
                                    <path
                                      d="M17.28 8.125c0-.39-.035-.765-.1-1.125H12v2.127h2.96a2.53 2.53 0 01-1.098 1.66v1.38h1.778c1.04-.957 1.64-2.367 1.64-4.042z"
                                      fill="#4285F4"
                                    ></path>
                                    <path
                                      d="M12 13.5c1.485 0 2.73-.493 3.64-1.333l-1.777-1.38c-.493.33-1.123.525-1.863.525-1.432 0-2.645-.968-3.077-2.268H7.085v1.425A5.498 5.498 0 0012 13.5z"
                                      fill="#34A853"
                                    ></path>
                                    <path
                                      d="M8.922 9.044A3.306 3.306 0 018.75 8c0-.362.062-.715.172-1.045V5.53H7.085a5.498 5.498 0 000 4.94l1.837-1.425z"
                                      fill="#FBBC05"
                                    ></path>
                                    <path
                                      d="M12 4.687c.807 0 1.533.278 2.102.823l1.578-1.578C14.727 3.045 13.483 2.5 12 2.5a5.498 5.498 0 00-4.915 3.03l1.838 1.425c.432-1.3 1.645-2.268 3.077-2.268z"
                                      fill="#EA4335"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="gg-icon_svg__clip0_8801_60807">
                                      <path
                                        fill="#fff"
                                        transform="translate(6 2)"
                                        d="M0 0h12v12H0z"
                                      ></path>
                                    </clipPath>
                                  </defs>
                                </svg>
                              </a>

                              {/* <!-- laban dictionary --> */}
                              <a
                                href={`https://dict.laban.vn/find?type=1&query=${selectedText}`}
                                target="”_blank”"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="16"
                                  width="16"
                                  viewBox="0 0 512 512"
                                >
                                  <rect
                                    x="0.5"
                                    y="0.5"
                                    width="23"
                                    height="15"
                                    rx="7.5"
                                    stroke="#8C8C8C"
                                  ></rect>
                                  <path
                                    opacity="1"
                                    fill="#1E3050"
                                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                                  />
                                </svg>
                              </a>

                              {/* <!-- //camprit dictionary --> */}
                              <a
                                href={`https://dictionary.cambridge.org/vi/dictionary/english/${selectedText}`}
                                target="”_blank”"
                              >
                                <svg width="24" height="16" fill="none">
                                  <rect
                                    x="0.5"
                                    y="0.5"
                                    width="23"
                                    height="15"
                                    rx="7.5"
                                    stroke="#8C8C8C"
                                  ></rect>
                                  <path
                                    d="M18.902 4.057H15.913v.511H16.212a.65.65 0 01.564.32c.119.201.123.444.012.649l-3.215 5.9-1.464-3.49 1.38-2.53a1.627 1.627 0 011.429-.85h.163v-.51h-3.087v.511H12.293a.65.65 0 01.564.32c.119.201.123.444.012.649l-1 1.836-.892-2.125a.483.483 0 01.044-.461.483.483 0 01.408-.22h.327v-.51H8.102v.511H8.248c.682 0 1.293.406 1.557 1.035l1.317 3.14-1.468 2.694-2.596-6.19a.483.483 0 01.044-.46.483.483 0 01.408-.22H7.96v-.51H4v.511h.329c.682 0 1.293.406 1.557 1.035l2.993 7.135a.335.335 0 00.603.03l.39-.716 1.49-2.735 1.436 3.42a.335.335 0 00.603.031l.39-.716 3.616-6.635a1.627 1.627 0 011.43-.85H19v-.51h-.098z"
                                    fill="#000"
                                  ></path>
                                </svg>
                              </a>

                              <div
                              // onClick={LookUpDictionary('video')}
                              // :className="lengthText > 1 ? 'margin-top-box' : ''"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="16"
                                  viewBox="0 0 24 16"
                                  fill="none"
                                >
                                  <path
                                    d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H16C20.1421 0.5 23.5 3.85786 23.5 8C23.5 12.1421 20.1421 15.5 16 15.5H8C3.85786 15.5 0.5 12.1421 0.5 8Z"
                                    stroke="#8C8C8C"
                                  ></path>
                                  <g clip-path="url(#clip0_1431_12482)">
                                    <path
                                      d="M8.61987 8.49037V12.6C8.61987 12.8449 8.81784 13.0428 9.06269 13.0428C9.30713 13.0428 9.50551 12.8449 9.50551 12.6V8.49037C9.50551 8.24585 9.30713 8.04755 9.06269 8.04755C8.81784 8.04755 8.61987 8.24564 8.61987 8.49037Z"
                                      fill="#8C8C8C"
                                    ></path>
                                    <path
                                      d="M7.22996 13.0478H8.20499V8.16864C8.20766 8.14526 8.21192 8.12192 8.21192 8.09795C8.21192 5.99296 9.91096 4.28064 11.9991 4.28064C14.0869 4.28064 15.786 5.99296 15.786 8.09795C15.786 8.13014 15.7907 8.16133 15.7955 8.19244V13.0478H16.7707C17.4494 13.0478 18 12.4782 18 11.7755V9.23111C18 8.65163 17.6247 8.16342 17.1123 8.0098C17.0651 5.21338 14.7903 2.95219 11.9993 2.95219C9.2075 2.95219 6.93236 5.21359 6.88568 8.01089C6.37396 8.16471 6 8.6525 6 9.23153V11.7755C6 12.4778 6.55063 13.0478 7.22996 13.0478Z"
                                      fill="#8C8C8C"
                                    ></path>
                                    <path
                                      d="M14.4954 8.49037V12.6C14.4954 12.8449 14.6936 13.0428 14.9381 13.0428C15.1827 13.0428 15.3809 12.8449 15.3809 12.6V8.49037C15.3809 8.24585 15.1827 8.04755 14.9381 8.04755C14.6932 8.04755 14.4954 8.24564 14.4954 8.49037Z"
                                      fill="#8C8C8C"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1431_12482">
                                      <rect
                                        width="12"
                                        height="12"
                                        fill="white"
                                        transform="translate(6 2)"
                                      ></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                          )}

                          <div>
                            <div
                              className="type-word none-select"
                              // :className="!dictionarys.word ? 'margin-box' : ''"
                            >
                              translate
                            </div>
                            <div className="translate-text none-select">
                              {translateContent}
                              {/* <div className="definition none-select">
                                định nghĩa giải thích cho từ
                              </div> */}
                            </div>
                            <div>
                              <div className="type-word none-select">Example</div>
                              <div className="translate-text">
                                {examples &&
                                  examples.map((value: any, idx: number) => {
                                    return (
                                      <div key={idx} className="mb-2">
                                        {idx + 1}. {value.example}
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                            <div>
                              <div className="type-word none-select">synonyms</div>
                              <div className="translate-text none-select">
                                <div>dog</div>
                              </div>
                            </div>
                            <div>
                              <div id="widget-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
