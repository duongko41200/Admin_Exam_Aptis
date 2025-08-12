import { POINT_REPLACE, RES_DATA } from "@/Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_READING,
} from "@/store/feature/testBank";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";

const ItemTypes = {
  BOX: "box",
};

const PART_TWO = 2;

const TITLE = 0;
const DEAR_PERSON = 1;
const FOOT_FISH = 2;

const BoxText = ({ id, content, column }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOX,
    item: { id, content, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        margin: "4px",
        backgroundColor: column === 2 ? "lightblue" : "lightgreen",
        cursor: "move",
        zIndex: 1,
        position: "relative",
      }}
    >
      <div className="border border-gray-200 my-1 bg-white rounded">
        <div className="w-full h-24 border border-[#939393] bg-white rounded-sm h-fit">
          <div className="flex justify-center items-center w-full">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 stroke-2"
              >
                <path d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </div>
          </div>

          <div className="text-left text-sm p-2.5">{content}</div>
        </div>
      </div>
    </div>
  );
};

const DropBox = ({ id, content, acceptBox, column, setIsDragging }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOX,
    item: { id, content, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (item) => acceptBox(item.id, id, item.content, item.column),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className="bg-[#F4F6F9]  rounded min-h-[3.5em] border-2 border-dashed border-gray-400  flex justify-center cursor-move w-full mb-2 gap-4  relative"
    >
      <div className={`w-full   h-fit bg-[#F4F6F9] rounded text-[14.5px]  p-1.5 `}>
        {content}
      </div>
    </div>
  );
};

const DropBoxColumn2 = ({ id, content, acceptBox, column, isDraggings }) => {
  const [{}, drag] = useDrag({
    type: ItemTypes.BOX,
    item: { id, content, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (item) => acceptBox(item.id, id, item.content, item.column),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      style={{
        opacity: 0,
        padding: "8px",
        margin: "4px",
        backgroundColor: content ? "lightgreen" : "lightgray",
        minHeight: "50px",
        cursor: "move",
        position: "absolute",
        height: "100%",
        zIndex: isDraggings ? 5 : 0,
        width: "100%",
      }}
    ></div>
  );
};

const DragDropApp = () => {
  const [column1, setColumn1] = useState(Array(5).fill(null));
  const [column2, setColumn2] = useState([]);
  const [contentPartTwo, setContentPartTwo] = useState();
  const dispatch = useDispatch();

  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const [isDragging, setIsDragging] = useState(false);

  /**
   *
   * @param {*} draggedId : id của item được kéo cootj 2
   * @param {*} dropId : id vi trí thả vào cột 1
   * @param {*} draggedContent : noi dung
   * @param {*} fromColumn : keo tu cot nao
   */

  // Handle dropping an item into another column
  const handleDrop = (draggedId, dropId, draggedContent, fromColumn) => {
    setIsDragging(false);
    console.log(draggedId, dropId, draggedContent, fromColumn);
    if (fromColumn === 2) {
      // Kéo item từ cột 2 vào cột 1

      if (dropId === -1) return;
      setColumn2(column2.filter((box) => box.id !== draggedId));
      const updatedColumn1 = [...column1];
      const updatedColumn2 = [...column2].filter((box) => box.id !== draggedId);

      console.log({ updatedColumn2 });

      if (updatedColumn1[dropId] === null) {
        updatedColumn1[dropId] = {
          id: draggedId,
          content: draggedContent,
        };
      } else {
        const temp = updatedColumn1[dropId];

        updatedColumn1[dropId] = {
          id: draggedId,
          content: draggedContent,
        };

        updatedColumn2.push(temp);
        setColumn2(updatedColumn2);
      }

      console.log({ updatedColumn1 });
      setColumn1(updatedColumn1);

      dispatch(
        SET_RESPONSE_RESULT_READING({
          part: PART_TWO,
          value: updatedColumn1,
        })
      );
      dispatch(
        SET_ATTEMPTED_QUESTION({
          numberQuestion: 2,
          currentExamPart: "reading",
        })
      );
    } else if (fromColumn === 1) {
      // Kéo item trong cột 1 để thay đổi vị trí

      if (dropId === -1) {
        // Thả vào cột 2

        console.log("column1 test", column1);
        if (column1[draggedId] === null) return;

        console.log("column1", column1);
        const updatedColumn1 = column1.map((box, index) => {
          if (index === draggedId) {
            box = null;
          }

          return box;
        });
        setColumn1(updatedColumn1);
        setColumn2([
          ...column2,
          { id: column1[draggedId].id, content: draggedContent },
        ]);

        dispatch(
          SET_RESPONSE_RESULT_READING({
            part: PART_TWO,
            value: updatedColumn1,
          })
        );
      } else {
        const updatedColumn1 = [...column1];

        const temp = updatedColumn1[dropId];
        updatedColumn1[dropId] = {
          id: updatedColumn1[draggedId].id,
          content: draggedContent,
        };
        updatedColumn1[draggedId] = temp;
        setColumn1(updatedColumn1);

        dispatch(
          SET_RESPONSE_RESULT_READING({
            part: PART_TWO,
            value: updatedColumn1,
          })
        );
      }
    }
  };

  useEffect(() => {
    const readingPartTwo = testBankData.reading.part2[RES_DATA].data;

    const answerList = readingPartTwo?.questions?.answerList;

    const responseUser = readingPartTwo?.questions?.responseUser;

    console.log({ responseUser });
    console.log({testBankData})

    let answerListPart2 = [];

    for (let i = 0; i < answerList.length; i++) {
      let isExist = false;
      for (let j = 0; j < responseUser?.length; j++) {
        if (+responseUser[j]?.id == answerList[i].numberOrder) {
          isExist = true;
          break;
        }
      }

      if (isExist == true) continue;

      answerListPart2 = [
        ...answerListPart2,
        {
          id: answerList[i].numberOrder.toString(),
          content: answerList[i].content,
        },
      ];
    }
    if (responseUser) {
      setColumn1(responseUser);
    }

    setColumn2(answerListPart2);
    setContentPartTwo(readingPartTwo?.questions);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-fit">
        <div className="font-semibold text-[16px]">
          {contentPartTwo?.content.split(POINT_REPLACE)[TITLE]}
        </div>
        <div className="border border-[#b0b0b0] mt-4 w-full flex">
          {/* Box Left  */}
          <div className=" box-left p-4 w-[60%]">
            <div className="w-1/1 h-[550px] gap-2 flex flex-col rounded">
              <div className="w-full">
                <div className="font-sans text-[15px]">
                  <strong>
                    {contentPartTwo?.content.split(POINT_REPLACE)[DEAR_PERSON]}
                  </strong>
                </div>
                <div>
                  <div className="mt-[10px]">
                    {contentPartTwo?.content.split(POINT_REPLACE)[FOOT_FISH]}
                  </div>
                </div>
              </div>
              {column1 &&
                column1?.map((content, index) => (
                  <DropBox
                    key={index}
                    id={index}
                    content={content?.content}
                    acceptBox={handleDrop} // Truyền acceptBox cho DropBox trong cột 1
                    column={1}
                    moveItem={handleDrop}
                    setIsDragging={setIsDragging}
                  />
                ))}
            </div>
          </div>

          {/* box right */}
          <div className="colum-right bg-[#F4F6F9] min-w-[279px] h-auto p-3.5 overflow-hidden flex flex-col gap-2 w-[40%]">
            {/* // box element */}

            {/* //Draggable items */}

            <div className="w-1/1 h-full  rounded relative">
              <DropBoxColumn2
                key="-1"
                id={-1}
                content={null}
                acceptBox={handleDrop}
                column={2}
                isDraggings={isDragging}
              />
              {column2.map((box) => (
                <BoxText
                  key={box.id}
                  id={box.id}
                  content={box.content}
                  column={2}
                  moveItem={handleDrop}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default DragDropApp;
