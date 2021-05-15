import styles from "../../styles/components/button/circlebtn.module.scss";

type CirclebtnProps = {
	value: string;
	onClickFnc: () => void;
	size: number;
};
export default function AnimationBtn(props: CirclebtnProps) {
	const btnstyle = {
		width: props.size + "px",
		height: props.size + "px",
	};
	return (
		<button className={styles.btn} onClick={props.onClickFnc} style={btnstyle}>
			{props.value}
		</button>
	);
}
