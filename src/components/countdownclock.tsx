import styles from "../styles/components/countdownclock.module.scss";
import { useEffect, useState } from "react";

type CountdownClockProps = {
	timeLimit: number; // 秒
	turn: number;
	limitDone: () => void;
};

export default function CountdownClock(props: CountdownClockProps) {
	const [limitTime, setLimitTime] = useState(props.timeLimit);
	const [timer, setTimer] = useState(false);
	const [turn, setTurn] = useState(props.turn);

	const countdown = () => {
		setLimitTime((prevLimitTime) => prevLimitTime - 1);
	};

	useEffect(() => {
		console.log("start");
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

	useEffect(() => {
		setLimitTime(props.timeLimit);
		console.log(props.timeLimit + "で更新");
	}, [turn]);

	return (
		<div className={styles.clock}>
			LIMIT
			<img src="/images/sunadokei.png" alt="砂時計" /> {limitTime} sec　
			{props.turn}
		</div>
	);
}
