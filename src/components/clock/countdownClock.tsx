import React from 'react';
import styles from '../../styles/components/clock/countdownclock.module.scss';
import { useEffect, useState } from 'react';

type CountdownClockProps = {
    timeLimit: number; // 秒
    limitDone: () => void;
};

export default function CountdownClock(
    props: CountdownClockProps
): JSX.Element {
    const [limitTime, setLimitTime] = useState(props.timeLimit);
    const [timer, setTimer] = useState(false);

    const countdown = () => {
        setLimitTime((prevLimitTime) => prevLimitTime - 1);
    };

    useEffect(() => {
        setTimer(true);
    }, []);

    useEffect(() => {
        if (timer) {
            const timerId = setInterval(countdown, 1000);
            return () => clearInterval(timerId);
        }
    }, [timer]);

    useEffect(() => {
        if (limitTime <= 0) {
            setTimer(false);
            props.limitDone();
        }
    }, [limitTime]);

    return (
        <div className={styles.clock}>
            <div>
                残り時間
                <svg viewBox="0 0 512 512">
                    <g>
                        <path
                            d="M315.883,231.155l82.755-115.143c7.152-9.942,11.038-21.785,11.038-33.92V46.12h23.912V0H78.412v46.12h23.912
		v35.971c0,12.135,3.886,23.978,11.038,33.92l82.755,115.143c2.963,4.135,4.472,8.856,4.483,13.655v22.371
		c-0.011,4.797-1.52,9.519-4.483,13.666l-82.755,115.132c-7.152,9.942-11.038,21.784-11.038,33.93v35.96H78.412V512h355.177v-46.131
		h-23.912v-35.96c0-12.146-3.886-23.988-11.038-33.93l-82.755-115.132c-2.963-4.147-4.482-8.868-4.482-13.666V244.81
		C311.4,240.011,312.92,235.29,315.883,231.155z M386.61,461.267H125.39v-31.358c0-7.229,2.29-14.328,6.697-20.471l82.754-115.132
		c5.71-7.935,8.825-17.41,8.825-27.125V244.81c0-9.714-3.116-19.191-8.825-27.115l-82.743-115.144
		c-4.418-6.143-6.708-13.231-6.708-20.46V50.733h261.22v31.358c-0.01,7.229-2.29,14.317-6.708,20.46l-82.754,115.144
		c-5.698,7.924-8.814,17.4-8.814,27.115v22.371c0,9.714,3.116,19.19,8.814,27.125l82.765,115.132
		c4.407,6.143,6.686,13.242,6.696,20.471V461.267z"
                        ></path>
                        <path
                            d="M271.5,337.571c-8.564-8.543-22.436-8.543-31,0l-99.155,99.166c-1.866,1.877-2.431,4.688-1.41,7.131
		c1.009,2.442,3.397,4.037,6.034,4.037h220.062c2.637,0,5.025-1.595,6.034-4.037c1.02-2.443,0.457-5.254-1.41-7.131L271.5,337.571z"
                        ></path>
                    </g>
                </svg>
                {Math.floor(limitTime / 60) > 0 && (
                    <span className={styles.min}>
                        <span>{Math.floor(limitTime / 60)}</span>分
                    </span>
                )}
                <span className={styles.sec}>
                    <span>
                        {limitTime % 60 < 10
                            ? '  ' + (limitTime % 60)
                            : limitTime % 60}
                    </span>
                    秒
                </span>
            </div>
        </div>
    );
}
