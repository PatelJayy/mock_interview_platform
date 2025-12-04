import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  // FIX: Fetch the real feedback data instead of using null
  const feedback = await getFeedbackByInterviewId({
    interviewId,
    userId,
  });

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  
  // Use feedback date if available, otherwise interview creation date
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              {/* If feedback exists, show score. If not, show dashes */}
              <p>{feedback ? feedback.totalScore : "---"}/100</p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5 text-sm text-gray-500">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-end mt-4">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary" asChild>
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "Start"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;