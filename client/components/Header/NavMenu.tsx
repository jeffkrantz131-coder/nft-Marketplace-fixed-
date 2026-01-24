import { NextPage } from "next";
import Link from "next/link";
import React, { useContext } from "react";
import { MarketContext } from "../../context";

const styles = {
  menu: "col-[4] flex items-center justify-around",
  menuItemButton:
    "cursor-pointer hover:text-pink-600 font-bold",
  menuItemLink: "cursor-pointer hover:text-pink-600 font-bold",
};

export const NavMenu: NextPage = () => {
  const { isConnected, connectWallet } = useContext(MarketContext);
  return (
    <ul className={styles.menu}>
      <li>
        <Link href="/auction">
          <a className={styles.menuItemLink}>Auction</a>
        </Link>
      </li>

      <li>
        <Link href="/explore">
          <a className={styles.menuItemLink}>Explore</a>
        </Link>
      </li>
      {isConnected && (
        <li>
          <Link href="/create">
            <a className={styles.menuItemButton}>Create</a>
          </Link>
        </li>
      )}
      <li>
        <a>|</a>
      </li>

      <li>
        {!isConnected ? (
          <a className={styles.menuItemButton} onClick={connectWallet}>
            Connect
          </a>
        ) : (
          <Link href="/dashboard">
            <a className={styles.menuItemLink}>Dashboard</a>
          </Link>
        )}
      </li>
    </ul>
  );
};
