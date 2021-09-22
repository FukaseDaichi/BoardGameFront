import React from 'react';
import Head from 'next/head';
import styles from '../styles/components/layout.module.css';
import { SystemConst } from '../const/next.config';

export const siteTitle = 'ボードゲームの部屋';
interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any;
    home?: boolean;
}

export default function Layout(props: Props): JSX.Element {
    return (
        <div className={styles.container}>
            <Head>
                <meta name="description" content="ボードゲームの部屋" />
                <meta property="og:url" content={SystemConst.Server.SITE_URL} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@2d7rqU5gFQ6VpGo" />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicons/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicons/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicons/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/favicons/safari-pinned-tab.svg"
                    color="#000000"
                />
                <link rel="shortcut icon" href="/favicons/favicon.ico" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta
                    name="msapplication-config"
                    content="/favicons/browserconfig.xml"
                />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <header className={styles.header}></header>
            <main>{props.children}</main>
        </div>
    );
}
