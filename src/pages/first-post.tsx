import Link from "next/link";
import Head from "next/head";
import Layout from "../components/layout";

export default function FirstPost() {
  return (
    <Layout home={false}>
      <Head>
        <title>second Post</title>
      </Head>
      <h1>最初の投稿</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  );
}
