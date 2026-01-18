import React from 'react'

const styles = {
  container: 'text-white flex flex-col items-center justify-center py-2 mb-[30px]',
  title: 'text-[50px] font-bold m-[0px 0px 12px]',
  subTitle: 'text-[20px] font-bold'
}

export const HeroTitle = () => {
  return (
      <h1 className={styles.container}>
        <span  className={styles.title}>Hot Users</span>
        <span  className={styles.subTitle}>Of Our NFT Marketplace</span>
      </h1>
  )
}
