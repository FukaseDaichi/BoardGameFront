import React from 'react';

import Document, { Html, Head, Main, NextScript } from 'next/document';
class DocumentTsx extends Document {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    render() {
        return (
            <Html lang="ja">
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default DocumentTsx;
