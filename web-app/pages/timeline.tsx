import { TextField } from "@mui/material";
import {
  getFirestore,
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Gallery } from "react-grid-gallery";
import SiteHeader from "../components/SiteHeader";
import { PostInfo, TopicInfo } from "../lib/types";

type TimelineElementBaseData = {
  type: string;
};

type TopicTimelineElementData = TimelineElementBaseData & {
  type: "topic";
};

type GalleryTimelineElementData = TimelineElementBaseData & {
  type: "gallery";
};

interface GalleryTimelineElementProps extends GalleryTimelineElementData {
  photos: [];
}

function GalleryTimelineElement({ photos }: GalleryTimelineElementProps) {
  return (
    <section>
      <Gallery images={photos} />
    </section>
  );
}

type PhotoInfo = {
  source: "user" | "other";
  src: string;
  height: number;
  width: number;
};

type TimelineDay = {
  date: Date;
  topics: TopicInfo[];
  photos: PhotoInfo[];
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface TimelineMonthProps {
  year: number;
  month: number;
}

function TimelineMonth({ year, month }: TimelineMonthProps) {
  const monthName = MONTH_NAMES[month];
  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-4xl font-semibold">
        {monthName} {year}
      </div>

    </section>
  );
}

interface TimelineProps {
  data: PostInfo[];
}

function Timeline({ data }: TimelineProps) {
  console.log(data);
  // const
  const postElements = data.map((post) => {
    const date = new Date(post.timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    return (
      <div className='max-w-4xl mx-auto'>
        <TimelineMonth year={year} month={month} />
        <div className='py-2'>{post.title}</div>
      </div>
    );
  });
  return <div>{postElements}</div>;
}

const MARGARETS_MAGIC_NUMBER = 40;

const TimelinePage: NextPage = () => {
  const [timelineData, setTimelineData] = React.useState([]);

  const inputFile = React.useRef<HTMLInputElement | null>(null);

  const handleUploadToTimeline = () => {
    if (inputFile.current != null) {
      // This does work.
      /* @ts-ignore */
      inputFile.current.click();
    }
  };

  const [scoreMin, setScoreMin] = React.useState(MARGARETS_MAGIC_NUMBER);

  const [triggerRefresh, setTriggerRefresh] = React.useState(false);

  React.useEffect(() => {
    async function loadTimeline() {
      const db = getFirestore();
      // Filter posts by upvotes
      const topicsRef = collection(db, "posts");
      const timelineQuery = query(
        topicsRef,
        orderBy("score", "desc"),
        where("score", ">=", MARGARETS_MAGIC_NUMBER),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(timelineQuery);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTimelineData(data);
      setTriggerRefresh(false);
    }
    loadTimeline();
  }, [scoreMin]);

  const handleMinFieldUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setScoreMin(newValue);
  };

  return (
    <div className="">
      <Head>
        <title>Timeline - Horizon</title>
        <meta name="description" content="A timeline of events." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader>
        {/* <input
          type="file"
          id="file"
          ref={inputFile}
          className="hidden"
          accept="image/*"
        />
        <button className="inline-block" onClick={handleUploadToTimeline}>
          Upload
        </button> */}
      </SiteHeader>
      <main>
        <section className="max-w-4xl mx-auto pt-8">
          <div>
            <div className="text-5xl font-bold">Timeline</div>

            <div className="mt-4 text-xl">Filter options</div>
            {/* <div className="my-4 text-3xl">Global</div> */}
            <div className='py-4'>
              <TextField
                label="Filter by min score"
                value={scoreMin}
                variant="filled"
                onChange={handleMinFieldUpdate}
              />
            </div>
            {/* TODO: Change to dropdown */}
          </div>
        </section>
        <Timeline data={timelineData} />
      </main>
    </div>
  );
};

export default TimelinePage;
