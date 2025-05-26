import React from "react";
import styles from "../components/styles/devButton.module.css";

const DevButton = () => {
  return (
        <div className={styles.logoContainer}>
          <img
            src="../images/dev-logo.png"
            alt="logo desenvolvedor"
            className={styles.logoDev}
          />
        </div>
  );
};

export default DevButton;
