export type TopicInfo = {
  title: string;
  postCount: number;
  start: Date;
  end: Date;
  posts: {
    id: string;
    timestamp: Date;
    content: string;
  }[];
};

export type PostInfo = {
  id: string;
  author: {
    name: string;
  };
  timestamp: Date;
  content: string;
  entities: string;
};

export type TrackedEntity = {
  id: string;
  label: string;
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
