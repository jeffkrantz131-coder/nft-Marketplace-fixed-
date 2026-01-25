import { NextPage } from "next";
import Link from "next/link";
import React, { useContext } from "react";
import { MarketContext } from "../../context";

// const styles = {
//   menu: "col-[4] flex items-center justify-around",
//   menuItemButton:
//     "cursor-pointer hover:text-pink-600 font-bold",
//   menuItemLink: "cursor-pointer hover:text-pink-600 font-bold",
// };

const styles = {
  menu: "col-[6] flex items-center justify-around gap-4 text-white",

  menuItemLink: `
    px-4 py-2 rounded-xl font-bold cursor-pointer
    text-white/100 hover:text-white
    hover:bg-white/10 backdrop-blur-md
    border border-white/10 hover:border-cyan-400
    transition-all duration-300 hover:shadow-[0_0_15px_cyan]
  `,

  menuItemButton: `
    px-5 py-2 rounded-xl font-bold cursor-pointer
    bg-gradient-to-r from-[#1199fa] to-[#11d0fa]
    text-black hover:scale-105
    shadow-[0_0_15px_rgba(0,255,255,0.5)]
    transition-all duration-300
  `,
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
