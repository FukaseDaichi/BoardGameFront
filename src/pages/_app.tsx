import "../styles/bootstrap.min.css";
import "../styles/global.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
	useEffect(() => {
		document.querySelector("body").setAttribute("ontouchstart", "");
	});

	return <Component {...pageProps} />;
}
