import styles from "../styles/components/modal.module.scss";
import { useCallback, useEffect, useState } from "react";

const view = (value: string) => {
  document.getElementById(styles.modal_container).removeAttribute("class");
  document.getElementById(styles.modal_container).classList.add(styles[value]);
  document.querySelector("body").classList.add(styles.modal_active);
};

const modalClick = () => {
  document.getElementById(styles.modal_container).classList.add(styles.out);
  document.querySelector("body").classList.remove("modal_active");
};

type ModalProps = {
  children: any;
  type: string;
};

export default function Modal(props: ModalProps) {
  const [viewType, setViewType] = useState(props.type);
  useEffect(() => {
    if (viewType) {
      view(viewType);
    }
  }, [viewType]);
  return (
    <div className={styles.modal}>
      <div id={styles.modal_container} onClick={modalClick}>
        <div className={styles.modal_background}>
          <div className={styles.modal}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
