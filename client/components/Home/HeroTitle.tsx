import React from 'react'

const styles = {
  container: 'text-white flex flex-col items-center justify-center py-2 mb-[30px] mt-[30px]',
  title: 'text-center text-6xl font-black mb-6 bg-gradient-to-r from-[#1199fa] to-[#11d0fa] bg-clip-text text-transparent',
  subTitle: 'text-[20px] font-bold'
}

export const HeroTitle = () => {
  return (
      <h1 className={styles.container}>
        <span className={`${styles.title} text-glow`}>
  Welcome!
</span>
      </h1>
  )
}
