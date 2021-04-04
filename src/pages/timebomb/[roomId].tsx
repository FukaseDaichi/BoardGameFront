import { useRouter } from "next/router";

export default function Room() {
  const router = useRouter();
  const { roomId } = router.query;
  return <p>{roomId}aaa</p>;
}
