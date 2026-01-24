// import { NextPage } from 'next'
// import React, { useState } from 'react'
// import { ChevronDownIcon } from '@heroicons/react/solid'
// import { ButtonGroup, ButtonGroupItemType } from '../common/buttonGroup'

// const styles = {
//   container: 'flex flex-row items-center justify-between text-white',
//   sort: 'flex flex-row items-center justify-evenly bold',
//   sortButton: 'border-2 border-blue-500 rounded-3xl',
//   icon: 'w-6 h-6 absolute top-2 right-1 cursor-pointer',
// }

// const itemsState = {
//   dayItems : [
//     { id: 'day-item-1', title: 'Today', active: false },
//     { id: 'day-item-2', title: 'Last 7 Days', active: false },
//     { id: 'day-item-3', title: 'Last 30 Days', active: false },
//     { id: 'day-item-4', title: 'All Time', active: true },
//   ],
//   sortItems: [
//     { id: 'sort-item-1', title: 'All Categories', pos: 0 },
//     { id: 'sort-item-2', title: 'Art', pos: 1 },
//     { id: 'sort-item-3', title: 'Game', pos: 2 },
//     { id: 'sort-item-3', title: 'Music', pos: 3 },
//     { id: 'sort-item-3', title: 'Sports', pos: 4 },
//   ]
// }

// type SortItemType = {
//   id: string;
//   title: string;
//   pos: number;
// } 

// export const CollectiblesMenu:NextPage = () => {
//   const [dayItems, setDayItems] = useState(itemsState.dayItems);
//   const [sortItems, setSortItems] = useState(itemsState.sortItems);

//   const [currentSortItem, setCurrentSortIem] = useState(0);

//   const handleButtonGroup = (item:ButtonGroupItemType) => (ev:React.MouseEvent) => {
//     const items = dayItems.map(i => {
//       if(item.id === i.id) {
//         i.active = true;
//       } else {
//         i.active = false;
//       }
//       return i;
//     });
//     setDayItems(items);
//   }

//   const handleSortItem = (ev:React.MouseEvent) => {
//     console.log('click')
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.sort}>
//         <div>Sort By</div>
//         <div className='ml-3 relative' onClick={handleSortItem}>
//           <button style={{padding: '5px 25px 5px 8px'}} className={styles.sortButton}>{sortItems[currentSortItem].title}</button>
//           <ChevronDownIcon className={styles.icon} />
//         </div>
//       </div>
//       <ButtonGroup items={dayItems} handleButtonGroup={handleButtonGroup} />
//     </div>
//   )
// }

import { NextPage } from "next";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ButtonGroup, ButtonGroupItemType } from "../common/buttonGroup";


const styles = {
  container: "flex flex-row items-center justify-between text-white",
  sort: "flex flex-row items-center justify-evenly",
  sortButton: "border-2 border-blue-500 rounded-3xl bg-[#0f1c39] px-4 py-1 flex justify-between items-center text-white mr-[8px]",
  icon: "w-5 h-5 absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none text-white",
};

const itemsState = {
  dayItems: [
    { id: "day-item-1", title: "Today", active: false },
    { id: "day-item-2", title: "Last 7 Days", active: false },
    { id: "day-item-3", title: "Last 30 Days", active: false },
    { id: "day-item-4", title: "All Time", active: true },
  ],
  sortItems: [
    { id: "sort-item-1", title: "All Categories", pos: 0 },
    { id: "sort-item-2", title: "Art", pos: 1 },
    { id: "sort-item-3", title: "Game", pos: 2 },
    { id: "sort-item-4", title: "Music", pos: 3 },
    { id: "sort-item-5", title: "Sports", pos: 4 },
  ],
};

type SortItemType = {
  id: string;
  title: string;
  pos: number;
};

type CollectiblesMenuProps = {
  onCategoryChange?: (category: string) => void;
  onTimeChange?: (time: string) => void;
};

export const CollectiblesMenu: NextPage<CollectiblesMenuProps> = ({ onCategoryChange, onTimeChange }) => {
  const [dayItems, setDayItems] = useState(itemsState.dayItems);
  const [sortItems] = useState(itemsState.sortItems);
  const [currentSortItem, setCurrentSortItem] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 👇 close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortSelect = (pos: number) => {
    setCurrentSortItem(pos);
    setIsOpen(false);
    if (onCategoryChange) onCategoryChange(sortItems[pos].title); // ✅ notify parent
  };

  const handleButtonGroup = (item: ButtonGroupItemType) => () => {
    const items = dayItems.map((i) => ({
      ...i,
      active: item.id === i.id,
    }));
    setDayItems(items);

    if (onTimeChange) onTimeChange(item.title); // ✅ notify parent
  };

  // const handleButtonGroup = (item: ButtonGroupItemType) => () => {
  //   const items = dayItems.map((i) => ({
  //     ...i,
  //     active: item.id === i.id,
  //   }));
  //   setDayItems(items);
  // };

  const handleSortToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // const handleSortSelect = (pos: number) => {
  //   setCurrentSortItem(pos);
  //   setIsOpen(false);
  // };

  return (
    <div className={styles.container}>
      {/* SORT DROPDOWN */}
      <div className={styles.sort}>
        <div>Sort By</div>

        <div className="ml-3 relative" ref={dropdownRef}>
          <button
            onClick={handleSortToggle}
            className={styles.sortButton}
          >
            {sortItems[currentSortItem].title}
          </button>

          <ChevronDownIcon onClick={handleSortToggle} className={styles.icon} />

          {isOpen && (
            <div className="absolute bg-black border border-blue-500 rounded-xl mt-2 w-40 z-50 shadow-lg">
              {sortItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSortSelect(item.pos)}
                  className="px-3 py-2 hover:bg-blue-500 cursor-pointer"
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DAY FILTER BUTTONS */}
      <ButtonGroup items={dayItems} handleButtonGroup={handleButtonGroup} />
    </div>
  );
};
