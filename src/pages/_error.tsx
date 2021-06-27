import React from "react";
import Router from "next/router";

const Error = () => {
  return <div>エラーが発生しました</div>;
};

Error.getInitialProps = async ({ res }) => {
  // サーバー側でリダイレクト
  if (typeof window === "undefined") {
    res.writeHead(302, { Location: "/" });
    res.end();
    return {};
  }

  // フロントエンド側でリダイレクト
  Router.push("/");

  return {};
};

export default Error;
