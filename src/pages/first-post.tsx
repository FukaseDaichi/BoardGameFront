import Link from "next/link";
import Head from "next/head";
import Layout from "../components/layout";
import LinkButton from "../components/button/linkButton";
import Chatmessage from "../components/message/chatmessage";

const testFnc = (e) => {
	console.log(e);
	console.log("あいうえお");
};

export default function FirstPost() {
	return (
		<Layout home={false}>
			<Chatmessage value="てすとのメッセージあいうえ" type="info" />
			<Head>
				<title>second Post</title>
			</Head>
			<h1>最初の投稿</h1>
			<h2>
				<Link href="/">
					<a>Back to home</a>
				</Link>
			</h2>
			<LinkButton href="/" clickFnk={testFnc} value="ボタン"></LinkButton>
		</Layout>
	);
}
