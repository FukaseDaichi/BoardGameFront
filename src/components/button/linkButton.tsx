import Link from "next/link";

export default function LinkButton({ href, clickFnk, value }) {
  return (
    <Link href={href} passHref>
      <button onClick={clickFnk}>{value}</button>
    </Link>
  );
}
