import { selectUptrainAccessKey } from "@/store/reducers/userInfo";
import { changeDateFormat } from "@/utils/changeDateFormat";
import { scoreColorCalculator } from "@/utils/scoreColorCalculator";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllLogsRowTop = (props) => {
  const [liked, setLiked] = useState();
  const formattedDate = changeDateFormat(props.date);
  const uptrainAccessKey = useSelector(selectUptrainAccessKey);

  useEffect(() => {
    if (liked == false) {
      props.setShowLikeModal(true);
    }
  }, [liked]);

  const likeHandler = async () => {
    setLiked(true);
    try {
      const data = {
        row_uuid: props.uuid,
        check: props.selectedTab,
        project_name: props.projectName,
        human_score: props.score,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `api/public/human_feedback`,
        {
          method: "POST",
          headers: {
            "uptrain-access-token": `${uptrainAccessKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
      } else {
        console.error("Failed to submit:", response.statusText);
        // Handle error cases
      }
    } catch (error) {
      console.error("Error submitting:", error.message);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="flex gap-4">
      <p className="text-[#B6B6B9] font-medium text-base">{props.index}</p>
      <div className="flex-1">
        <h3 className="text-[#B6B6B9] font-medium text-base pb-4">
          {props.question}
        </h3>
        <div className="flex justify-between ">
          <div className="flex gap-x-3 items-center  flex-wrap ">
            <p className="font-medium text-base text-[#4F4F56]">
              Score:{" "}
              <span
                className="text-lg "
                style={{ color: scoreColorCalculator(props.score) }}
              >
                {props.score}
              </span>
            </p>
            {props.AiConfidence && (
              <>
                <div className="h-4 w-[1px] bg-[#4F4F56] "></div>
                <p className="font-medium text-base text-[#4F4F56]">
                  Confidence:{" "}
                  <span
                    className="text-lg text-[#F8F14A]"
                    style={{ color: scoreColorCalculator(props.AiConfidence) }}
                  >
                    {props.AiConfidence}
                  </span>
                </p>
              </>
            )}
            <div className="h-4 w-[1px] bg-[#4F4F56] "></div>
            <p className="font-medium text-base text-[#4F4F56]">
              {formattedDate}
            </p>
            {props.updated ? (
              <>
                <div className="h-4 w-[1px] bg-[#4F4F56] "></div>
                <p className="font-medium text-base text-[#4F4F56]">
                  {props.updated}
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          {!props.inModal ? (
            <button onClick={() => props.setExpand((prev) => !prev)}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/DropDownIcon.svg`}
                height={5.5}
                width={11}
                className={`${
                  props.expand && "rotate-180"
                } transition-all delay-150 w-auto h-auto`}
                alt="Drop-down Icon"
              />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLogsRowTop;
