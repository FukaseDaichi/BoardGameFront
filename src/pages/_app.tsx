import React from 'react';
import '../styles/bootstrap.min.css';
import '../styles/global.scss';
import { useEffect } from 'react';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pageProps: any;
}

export default function App(props: Props): JSX.Element {
    useEffect(() => {
        document.querySelector('body').setAttribute('ontouchstart', '');
    });

    return <props.Component {...props.pageProps} />;
}
