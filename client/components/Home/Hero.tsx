import { NextPage } from 'next'
import React from 'react'
// import { Carousel, HeroTitle, NewsLetter, TopCollectibles } from '../../components'
import { Footer } from '../footer/Footer'
import dynamic from "next/dynamic";
import { HeroTitle, NewsLetter } from '../../components'
const styles = {
  container: 'bg-gradient'
}
const Carousel = dynamic(() => import("../../components/Home/Carousel"), { ssr: false });
const TopCollectibles = dynamic(() => import("../../components/Home/TopCollectibles"), { ssr: false });

export const Hero:NextPage = () => {
  return (
    <div className={styles.container}>
      <HeroTitle />
      <Carousel />
      <NewsLetter />
      <TopCollectibles />
      <Footer />
    </div>
  )
}
