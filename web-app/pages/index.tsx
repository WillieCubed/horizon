import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Timebook</title>
        <meta name="description" content="A place to see collective memory." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section id="hero" className="bg-blue-200">
          <div className="max-w-6xl mx-auto text-center p-8">
            <div className="text-center text-4xl font-bold">
              Timebook is your realtime time capsule.
            </div>
            <div>
              <Link
                href="/timeline"
                className="my-4 inline-block py-4 text-blue-500 text-3xl font-bold underline rounded-md bg-blue-200"
              >
                See the timeline.
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
