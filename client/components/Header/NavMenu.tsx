import { NextPage } from "next";
import Link from "next/link";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import { MarketContext } from "../../context";

const styles = {
  menu: "col-[6] flex items-center justify-around gap-4 text-white",

  base: `
    relative px-5 py-2 rounded-full min-w-[120px] 
    bg-[#0f1c39] text-white
    border border-cyan-400/30
    backdrop-blur-xl
    shadow-[0_0_15px_rgba(0,255,255,0.2)]
    transition-all
    hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]
    hover:text-cyan-300
  `,

  active: `
    bg-gradient-to-r from-[#1199fa] to-[#11d0fa]
    text-white
    shadow-[0_0_30px_rgba(17,208,250,0.5)]
    hover:shadow-[0_0_35px_rgba(17,208,250,0.7)]
  `,
};

export const NavMenu: NextPage = () => {
  const { isConnected, connectWallet } = useContext(MarketContext);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <ul className={styles.menu}>
      
      {/* HOME LINK */}
      <li>
        <Link href="/">
          <a className={`${styles.base} ${isActive("/") ? styles.active : ""}`}>
            Home
          </a>
        </Link>
      </li>

      {/* EXPLORE LINK (always visible) */}
      <li>
        <Link href="/explore">
          <a className={`${styles.base} ${isActive("/explore") ? styles.active : ""}`}>
            Explore
          </a>
        </Link>
      </li>

      {/* ONLY SHOW THESE WHEN CONNECTED */}
      {isConnected && (
        <>
          <li>
            <Link href="/auction">
              <a className={`${styles.base} ${isActive("/auction") ? styles.active : ""}`}>
                Auction
              </a>
            </Link>
          </li>

          <li>
            <Link href="/create">
              <a className={`${styles.base} ${isActive("/create") ? styles.active : ""}`}>
                Create
              </a>
            </Link>
          </li>

          <li className="text-cyan-400">|</li>

          <li>
            <Link href="/dashboard">
              <a className={`${styles.base} ${isActive("/dashboard") ? styles.active : ""}`}>
                Dashboard
              </a>
            </Link>
          </li>
        </>
      )}

      {/* CONNECT BUTTON (only when NOT connected) */}
      {!isConnected && (
        <li>
          <button onClick={connectWallet} className={styles.base}>
            Connect
          </button>
        </li>
      )}
    </ul>
  );
};
