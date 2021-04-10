import Head from "next/head";
import styles from "../styles/components/layout.module.css";
import Link from "next/link";

const name: string = "Franc";
export const siteTitle: string = "ボードゲームの部屋";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={siteTitle} />
        <meta
          property="og:image"
          content="https://board-game-blldc84hf-whitefranc.vercel.app/images/logo.png"
        />
        <meta name="og:title" content={siteTitle} />

        <meta property="og:site_name" content={siteTitle} />
        <meta
          property="og:description"
          content="オンライン上でボードゲームができます"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@2d7rqU5gFQ6VpGo" />
      </Head>
      <header className={styles.header}></header>
      <main>{children}</main>
    </div>
  );
}
