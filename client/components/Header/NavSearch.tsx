import React, { ChangeEvent, useContext, useState } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { MarketContext } from '../../context';

const styles = {
  searchContainer: `
    relative flex items-center w-full max-w-[400px]
    px-3 py-2 rounded-3xl
    bg-white/10 backdrop-blur-xl border border-white/20
    shadow-[0_0_20px_rgba(0,255,255,0.2)]
  `,
  icon: `
    w-5 h-5 text-cyan-400
  `,
  inputField: `
    ml-2 w-full bg-transparent outline-none text-white
    placeholder:text-white/50
  `
}

export const NavSearch = () => {
  const { filterNFT } = useContext(MarketContext);
  const [searchText, setSearchText] = useState('');
  const router = useRouter(); 
  const handleSearch = (ev:ChangeEvent<HTMLInputElement>) => {
    if(router.pathname !== '/explore') return;
    setSearchText(ev.target.value);
    filterNFT(ev.target.value);
  }

  const handleFocus = () => {
    if(router.pathname !== '/explore') {
      toast.info('The search bar only works on the explore page', { autoClose: 3000 });
      return;
    }
  }


  return (
      <div className={styles.searchContainer}>
       <SearchIcon className={styles.icon} />
       <input type='search' placeholder='Search collectibles by name' className={styles.inputField} value={searchText} onChange={handleSearch} onFocus={handleFocus}/>
      </div>
  )
}
