import React from 'react'

const styles = {
  container: 'text-white flex flex-col items-center justify-center py-2 mb-[30px]',
  title: 'text-[50px] font-bold m-[0px 0px 12px]',
  subTitle: 'text-[20px] font-bold'
}

export const HeroTitle = () => {
  return (
      <h1 className={styles.container}>
        <span  className='text-center text-6xl font-black mb-6 
                        text-blue-400 drop-shadow-[0_0_20px_cyan]'>Welcome</span>
        <span  className='text-center text-3xl font-black mb-6 
                        text-blue-400 drop-shadow-[0_0_20px_cyan]'>To Our NFT Marketplace</span>
      </h1>
  )
}
