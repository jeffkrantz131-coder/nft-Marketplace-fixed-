import { NextPage } from "next";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ButtonGroup, ButtonGroupItemType } from "../common/buttonGroup";

const styles = {
  container: "flex flex-col md:flex-row items-center justify-between text-white gap-4",

  sort: "flex items-center gap-2",

  sortButton: `
    relative flex items-center justify-between
    px-4 py-1.5 min-w-[100px]
    rounded-full border border-cyan-400/40
    bg-white/5 backdrop-blur-xl
    text-white font-medium
    shadow-[0_0_20px_rgba(0,255,255,0.15)]
    hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]
    transition-all
  `,

  icon: `
    w-5 h-5 ml-2 text-cyan-400 pointer-events-none
  `,
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
    if (onCategoryChange) onCategoryChange(sortItems[pos].title); // notify parent
  };

  const handleButtonGroup = (item: ButtonGroupItemType) => () => {
    const items = dayItems.map((i) => ({
      ...i,
      active: item.id === i.id,
    }));
    setDayItems(items);

    if (onTimeChange) onTimeChange(item.title); // notify parent
  };

 
  const handleSortToggle = () => {
    setIsOpen((prev) => !prev);
  };

 

  return (
    <div className={styles.container}>
      {/* SORT DROPDOWN */}
      <div className={styles.sort}>
        <div>Sort By</div>

        <div className="ml-3 relative" ref={dropdownRef}>
          <button
            onClick={handleSortToggle} className={styles.sortButton}
          >
            {sortItems[currentSortItem].title}
            <ChevronDownIcon onClick={handleSortToggle} className={styles.icon} />
          </button>

          {isOpen && (
            <div className="
              absolute mt-2 w-full rounded-xl
              bg-black/80 backdrop-blur-xl
              border border-cyan-400/30
              shadow-[0_0_25px_rgba(0,255,255,0.25)]
              z-50 overflow-hidden
            ">
              {sortItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSortSelect(item.pos)}
                  className="
                    px-4 py-2 cursor-pointer
                    hover:bg-cyan-500/20 hover:text-cyan-300
                    transition-all
                  "
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
