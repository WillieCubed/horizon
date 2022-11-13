import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import SiteHeader from '../../components/SiteHeader';
import { PostInfo, TopicInfo } from "../../lib/types";

function Post({ content, timestamp }: Omit<PostInfo, "author" | "entities">) {
  const date = timestamp.toDateString();
  return (
    <article className="pt-2">
      <div className="text-lg">{date}</div>
      <p>{content}</p>
    </article>
  );
}

function TopicCard({ title, postCount, start, end, posts }: TopicInfo) {
  const startDate = start.toLocaleDateString();
  const endDate = end.toLocaleDateString();
  return (
    <div className="p-4 rounded-md bg-white shadow-sm">
      <div className="mt-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="my-2">
          {postCount} posts • {startDate} - {endDate}
        </div>
      </div>
      <div>
        {posts.map((post) => {
          // TODO: Fix this obviously
          return <Post key={post.id} {...post} />;
        })}
      </div>
    </div>
  );
}

interface TopicListProps {
  topics: TopicInfo[];
}

function TopicList({ topics }: TopicListProps) {
  const items = topics.map((topic) => {
    return <TopicCard key={topic.title} {...topic} />;
  });
  return <div className="space-y-4">{items}</div>;
}

const TEST_TOPICS = [
  {
    id: "0-0001",
    title: "Academic advising",
    postCount: 24,
    start: new Date(2015, 4, 1),
    end: new Date(),
    posts: [
      {
        id: 'asfjoisjfd',
        timestamp: new Date(2022, 11, 11),
        content:
          "I have had enough of ECS advisors and UTD in general. The instruction we get from most professors is already trash (excluding a handful of professors who actually care), but the advising system is even worse.",
      },
      {
        id: 'fjafqrttaf',
        timestamp: new Date(2022, 11, 11),
        content:
          "I have had enough of ECS advisors and UTD in general. The instruction we get from most professors is already trash (excluding a handful of professors who actually care), but the advising system is even worse.",
      },
    ],
  },
  {
    id: "0-0002",
    title: "Fanfiction",
    postCount: 24,
    start: new Date(2015, 4, 1),
    end: new Date(),
    posts: [],
  },
  {
    id: "0-0003",
    title: "Driving",
    postCount: 24,
    start: new Date(2015, 4, 1),
    end: new Date(),
    posts: [],
  },
  {
    id: "0-0003",
    title: "COVID-19",
    postCount: 24,
    start: new Date(2015, 4, 1),
    end: new Date(),
    posts: [],
  },
];

export const TopicsPage: NextPage = () => {
  const topics = TEST_TOPICS;
  // TODO: Load topics from database
  const sidebarItems = topics.map(({ id, title }) => {
    return <div key={id}>{title}</div>;
  });

  return (
    <div className="bg-slate-200 min-h-screen">
      <Head>
        <title>All Topics - Timebook</title>
        <meta name="description" content="A place to see collective memory." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader />
      <main className="grid px-4 grid-cols-[2fr_4fr_3fr] gap-x-4">
        <aside id="sidebar">
          <div>
            <div>Sort by</div>
            <div>Newness</div>
            <div>{sidebarItems}</div>
            <div className="p-4 font-bold">See all topics</div>
          </div>
        </aside>
        <div>
          <section className="max-w-4xl mx-auto mt-8">
            <div className="font-bold text-2xl">At a Glance</div>
            <div>
              <div className="text-xl">Common topics</div>
            </div>

          </section>
          <section className="max-w-4xl mx-auto mt-8">
            <div className="font-bold text-2xl">Browse Topics</div>
            {/* TODO: Search */}
          </section>
          <section className="max-w-4xl mx-auto mt-4">
            <TopicList topics={topics} />
          </section>
        </div>
        <section id="more">
          <div className="mt-4 bg-white">
            <div className="p-4 text-xl">Useful info</div>
            <div>See more info</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TopicsPage;
