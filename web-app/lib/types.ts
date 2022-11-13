export type TopicInfo = {
  title: string;
  postCount: number;
  start: Date;
  end: Date;
  posts: PostInfo[];
};

export type PostInfo = {
  title: string;
  id: string;
  author: {
    name: string;
  };
  score: number;
  timestamp: Date;
  text: string;
};

export type Entity = {
  id: string;
  commonName: string;
};

/**
 * Graph data
 */
export type TimeData = {
  title: string;
  months: string[];
  counts: number[];
};
