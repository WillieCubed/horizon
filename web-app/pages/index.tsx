import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Horizon - See timeline </title>
        <meta
          name="description"
          content="A place to see Comets' collective memory."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader />
      <main>
        <section id="hero" className="bg-blue-200">
          <div className="max-w-6xl mx-auto text-center py-16">
            <div className="text-center text-4xl font-bold">
              Horizon is your realtime time capsule.
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
        <section></section>
      </main>
    </div>
  );
};

export default Home;
