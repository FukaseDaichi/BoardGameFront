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
import styles from "../../styles/components/werewolf/room.module.scss";
import Router from "next/router";
import Start from "../../components/timebomb/start";
import RollCard from "../../components/werewolf/rollcard";
import ModalRollCard from "../../components/werewolf/modalrollcard";

// 接続切れ
const disconnect = () => {
  console.log("接続が切れました");
};

export default function WerewolfRoom() {
  // roomId取得
  const router = useRouter();
  const { roomId } = router.query;

  const [clientObj, setClientObj] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [playerName, setPlayerName] = useState(null);
  const [chatList, setChatList] = useState([]);

  // gamedata
  const [userList, setUserLst] = useState([]);
  const [turn, setTurn] = useState(0);
  const [winteamList, setWinteamList] = useState([]);
  const [staticRollList, setStaticRollList] = useState([]);

  // view
  const [startFlg, setStartFlg] = useState(false);
  const [rollcardFlg, setRollcardFlg] = useState(true);

  // ルーム入室
  const roomIn = (userName: string) => {
    if (userName === "") {
      return;
    }
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

  // アイコン変更
  const changeIcon = useCallback(
    (iconUrl: string) => {
      const url = "/app/game-changeIcon";
      const soketInfo: SocketInfo = {
        status: 600,
        roomId: roomId as string,
        userName: playerName,
        message: null,
        obj: iconUrl,
      };
      conect(url, soketInfo);
    },
    [clientObj, playerName]
  );

  const conect = (url: string, soketInfo: SocketInfo) => {
    try {
      clientObj.sendMessage(url, JSON.stringify(soketInfo));
    } catch (e) {
      setMessageList(messageList.concat("通信エラー。再度試してください"));
    }
  };

  const getMessage = (socketInfo: SocketInfo) => {
    console.log(socketInfo);

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
        dataSet(socketInfo.obj);
        break;

      case 300: // ゲーム開始
        // ゲームスタート
        setStartFlg(true);

        dataSet(socketInfo.obj);
        break;

      case 400: // ゲーム待機
        // 誰かが行動したらラッシュタイムを終了

        dataSet(socketInfo.obj);
        break;

      case 500: // 突入
        dataSet(socketInfo.obj);
        break;

      case 600: // アイコン変更
        setUserLst(socketInfo.obj);
        break;

      default:
        console.log(socketInfo);
    }
  };

  const dataSet = (obj) => {
    setUserLst(obj.userList);
    setWinteamList(obj.winteamList);
    setTurn(obj.turn);
    setStaticRollList(obj.staticRollList);
  };

  // スタートフラグの監視
  useEffect(() => {
    if (startFlg) {
      scrollTo(0, 0);
      window.setTimeout(() => {
        setStartFlg(false);
      }, 4000);
    }
  }, [startFlg]);

  // 勝敗監視
  useEffect(() => {
    console.log("勝敗決定");
  }, [winteamList]);

  // 入室時
  useEffect(() => {
    const userArray = userList.filter((element) => {
      return element.userName === playerName;
    });
    if (userArray.length > 0) {
      const btnDom = document.querySelector("." + styles.roominbtn);
      if (btnDom.classList.contains(styles.in)) {
        return;
      }
      btnDom.classList.add(styles.in);

      // アイコン初期設定
      if (userArray[0].userIconUrl === null) {
        changeIcon("/images/icon/icon" + userArray[0].userNo + ".jpg");
      }
    }
  }, [userList.length, playerName]);

  return (
    <Layout home={false}>
      <style jsx global>{`
        body {
          background-image: url(/images/hideout/hideoutbackground.png);
          background-attachment: fixed;
          background-size: 370px;
          background-position: bottom left;
          background-repeat: no-repeat;
          overflow-x: hidden;
          background-color: #ecebeb;
        }
      `}</style>
      <Head>
        <meta
          property="og:image"
          content={
            SystemConst.Server.SITE_URL +
            "/images/hideout/hideoutbackground.png"
          }
        />
        <meta property="og:title" content="セカンドワンナイト人狼" />
        <meta
          property="og:description"
          content="セカンドワンナイト人狼！　役職を選べる1日で終わる人狼ゲーム！ 初心者にもおすすめ！"
        />
        <title>セカンドワンナイト人狼</title>
      </Head>
      {/* 開始合図 */}
      {startFlg && <Start />}

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
      <div className={styles.roominbtn}>
        <p>
          <label htmlFor="username">Name</label>
        </p>
        <input type="text" id="username" maxLength={20} />
        <button
          onClick={() => {
            const usernameDom: HTMLInputElement = document.getElementById(
              "username"
            ) as HTMLInputElement;
            roomIn(usernameDom.value);
          }}
        >
          Room IN
        </button>
      </div>

      {/* ユーザ情報 */}
      <div className={styles.userfirld}>
        {userList.map((user, index: number) => {
          return (
            <UserInfo
              key={index}
              user={user}
              ownFlg={user.userName === playerName}
              userColor={SystemConst.PLAYER_COLOR_LIST[index]}
              changeIcon={changeIcon}
              userList={userList}
              wait={wait}
              winnerTeam={0}
              turn={turn}
            />
          );
        })}
      </div>

      {staticRollList.length > 0 && (
        <RollCard roll={staticRollList[0]} size={100} />
      )}
      {rollcardFlg && staticRollList.length > 0 && (
        <ModalRollCard roll={staticRollList[0]} />
      )}
      <div className={styles.btnarea}>
        <button
          onClick={() => {
            Router.push("/");
          }}
        >
          HOME
        </button>
        <button onClick={init}>{turn > 0 ? "GAME RESET" : "GAME START"}</button>
      </div>
      {/* チャットのやり取り（機能OFF） */}
      {false && <ChatComponent chatList={chatList} chat={chat} />}
    </Layout>
  );
}
