import Head from "next/head";
import styles from "../styles/components/layout.module.css";
import { SystemConst } from "../const/next.config";

const name: string = "Franc";
export const siteTitle: string = "ボードゲームの部屋";

export default function Layout({ children, home }) {
	return (
		<div className={styles.container}>
			<Head>
				<meta name="description" content="ボードゲームの部屋" />
				<link rel="icon" href="/favicon.png" />
				<meta property="og:url" content={SystemConst.Server.SITE_URL} />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@2d7rqU5gFQ6VpGo" />
			</Head>
			<header className={styles.header}></header>
			<main>{children}</main>
		</div>
	);
}
