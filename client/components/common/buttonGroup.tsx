import { FC } from "react";

export interface IButtonGroup {
   items: ButtonGroupItemType[],
   handleButtonGroup: (item:ButtonGroupItemType) => (ev:React.MouseEvent) => void
}

export type ButtonGroupItemType = {
  id: string;
  title: string;
  active: boolean;
}


const styles = {
  buttonGroup: 'flex flex-wrap items-center justify-center gap-4', // responsive gap
  buttonGroupItem: `
    relative px-5 py-2 rounded-full min-w-[120px] 
    bg-[#0f1c39] text-white
    border border-cyan-400/30
    backdrop-blur-xl
    shadow-[0_0_15px_rgba(0,255,255,0.2)]
    transition-all
    hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]
    hover:text-cyan-300
  `,
  buttonGroupActive: `
    bg-gradient-to-r from-[#1199fa] to-[#11d0fa]
    text-white
    shadow-[0_0_30px_rgba(17,208,250,0.5)]
    hover:shadow-[0_0_35px_rgba(17,208,250,0.7)]
  `,
};

export const ButtonGroup:FC<IButtonGroup> = ({ items, handleButtonGroup }) => {
  return (
    <div className={styles.buttonGroup}>
    {items.map((item:ButtonGroupItemType) =>(
      <button key={item.id} className={`${styles.buttonGroupItem} ${item.active ? styles.buttonGroupActive : '' }`} onClick={handleButtonGroup(item)}>{item.title}</button>
    ))}
  </div>
  )
}

