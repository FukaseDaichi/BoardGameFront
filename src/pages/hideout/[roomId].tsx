import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Head from "next/head";
import { SocketInfo } from "../../type";
import Chatmessage from "../../components/message/chatmessage";
import { useEffect, useState, useCallback } from "react";
import ChatComponent from "../../components/chatcomponent";
import UserInfo from "../../components/hideout/userInfo";
import styles from "../../styles/components/hideout/room.module.scss";

// 接続切れ
const disconnect = () => {
  console.log("接続が切れました");
};

export default function HideoutRoom() {
  // roomId取得
  const router = useRouter();
  const { roomId } = router.query;

  const [clientObj, setClientObj] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [playerName, setPlayerName] = useState(null);
  const [chatList, setChatList] = useState([]);

  // gamedata
  const [userList, setUserLst] = useState([]);
  const [memberFirldList, setMemberFirldList] = useState([]);
  const [rushFlg, setRushFlg] = useState(false);
  const [firldBuilding, setFirldBuilding] = useState({});

  // ルーム入室
  const roomIn = (userName: string) => {
    const url = "/app/game-roomin";
    const soketInfo: SocketInfo = {
      status: 100,
      roomId: roomId as string,
      userName: userName,
      message: null,
      obj: null,
    };
    setPlayerName(userName);
    conect(url, soketInfo);
  };

  // チャット
  const chat = useCallback(
    (message: string) => {
      if (playerName) {
        const url = "/app/game-chat";
        const soketInfo: SocketInfo = {
          status: 101,
          roomId: roomId as string,
          userName: playerName,
          message: message,
          obj: null,
        };
        conect(url, soketInfo);
        setMessageList(messageList.concat(message));
      }
    },
    [playerName, messageList]
  );

  // ゲーム開始
  const init = () => {
    const url = "/app/hideout-init";
    const soketInfo: SocketInfo = {
      status: 300,
      roomId: roomId as string,
      userName: playerName,
      message: null,
      obj: null,
    };
    conect(url, soketInfo);
  };

  const wait = (index: number) => {
    const url = "/app/hideout-wait";
    const soketInfo: SocketInfo = {
      status: 400,
      roomId: roomId as string,
      userName: playerName,
      message: null,
      obj: index,
    };
    conect(url, soketInfo);
  };

  const rush = (index: number) => {
    const url = "/app/hideout-rush";
    const soketInfo: SocketInfo = {
      status: 500,
      roomId: roomId as string,
      userName: playerName,
      message: null,
      obj: index,
    };
    conect(url, soketInfo);
  };

  const conect = (url: string, soketInfo: SocketInfo) => {
    try {
      clientObj.sendMessage(url, JSON.stringify(soketInfo));
    } catch (e) {
      setMessageList(messageList.concat("通信エラー。再度試してください"));
    }
  };

  const getMessage = (socketInfo: SocketInfo) => {
    switch (socketInfo.status) {
      case 100: // ルーム入室
        dataSet(socketInfo.obj);
        break;
      case 101: // チャット
        setChatList(socketInfo.obj);
        const messageFirld = document.getElementById("chat-firld");
        messageFirld.scrollTop = messageFirld.scrollHeight;
        break;

      case 200:
        // ルーム入室(同一名ユーザ入室)
        console.log(socketInfo);
        dataSet(socketInfo.obj);
        break;

      case 300: // ゲーム開始
        console.log(socketInfo);
        dataSet(socketInfo.obj);
      default:
        console.log(socketInfo);
    }
  };

  const dataSet = (obj) => {
    setUserLst(obj.userList);
    setRushFlg(obj.rushFlg);
    setFirldBuilding(obj.firldBuilding);
    setMemberFirldList(obj.memberFirldList);
  };

  return (
    <Layout home={false}>
      <style jsx global>{`
        body {
          background-image: url(/images/background.jpg);
          background-attachment: fixed;
          background-size: 370px;
          background-position: bottom left;
          background-repeat: no-repeat;
          overflow-x: hidden;
        }
      `}</style>
      <Head>
        <meta
          property="og:image"
          content={SystemConst.Server.SITE_URL + "/images/background.jpg"}
        />
        <meta property="og:title" content="ハイドアウトオンライン" />
        <meta
          property="og:description"
          content="オンライン上でみんなでハイドアウト！"
        />
        <title>Hideout</title>
      </Head>

      {messageList.map((value, index) => {
        if (index === messageList.length - 1) {
          return <Chatmessage value={value} type="info" key={index} />;
        }
      })}

      <SockJsClient
        url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
        topics={["/topic/" + roomId]}
        ref={(client) => {
          setClientObj(client);
        }}
        onMessage={(msg) => {
          getMessage(msg);
        }}
        onDisconnect={disconnect}
      />

      <p>プレイヤーネーム：{playerName}</p>
      <div>
        <input type="text" id="username" />
        <button
          onClick={() => {
            const usernameDom: HTMLInputElement = document.getElementById(
              "username"
            ) as HTMLInputElement;
            roomIn(usernameDom.value);
          }}
        >
          入室
        </button>
      </div>
      <div>
        <button onClick={init}>開始</button>
      </div>
      <div>
        <input type="number" id="taiki" />
        <button
          onClick={() => {
            const taikiDom: HTMLInputElement = document.getElementById(
              "taiki"
            ) as HTMLInputElement;
            wait(Number(taikiDom.value));
          }}
        >
          待機
        </button>
      </div>
      <div>
        <input type="number" id="rush" />
        <button
          onClick={() => {
            const rushDom: HTMLInputElement = document.getElementById(
              "rush"
            ) as HTMLInputElement;
            rush(Number(rushDom.value));
          }}
        >
          突入
        </button>
      </div>
      <div className={styles.userfirld}>
        {userList.map((user, index: number) => {
          return (
            <UserInfo
              key={index}
              user={user}
              ownFlg={user.userName === playerName}
              userColor={SystemConst.PLAYER_COLOR_LIST[user.userNo]}
            />
          );
        })}
      </div>

      {false && <ChatComponent chatList={chatList} chat={chat} />}
    </Layout>
  );
}
