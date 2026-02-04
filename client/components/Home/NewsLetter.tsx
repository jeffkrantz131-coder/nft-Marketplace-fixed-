// import { NextPage } from 'next'
// import Image from 'next/image';
// import React, { useState } from 'react'
// import subscribe from '../../assets/subscribe-v2.webp';

// const styles = {
//   container: 'relative w-[100%] h-[50vh] mb-[80px] bg-gradient text-white',
//   subscribeContainer: 'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col w-[75%] items-center justify-center',
//   title: 'text-[50px] leading-[65px]',
//   subTitle: 'mb-[25px] text-[28px]',
//   inputField: 'p-3 w-[85%] rounded-md focus:outline-none',
//   button: 'bg-gradient-to-r from-[#1199fa] to-[#11d0fa] p-3 rounded-r-md cursor-pointer w-[15%] -ml-2',
//   privacy: 'my-[25px] mx-auto w-[85%]',
//   accept: 'flex flex-row w-[80%] my-0 mx-auto'
// }
// export const NewsLetter:NextPage = () => {
//   const [checked, setChecked] = useState(false);
//   return (
//     <div className={styles.container}>
//       <Image src={subscribe} alt="subscribe" layout='fill' objectFit='cover'/>
//       <div className={styles.subscribeContainer}>
//           <div className='text-center'>
//             <h2 className={styles.title}>Never miss a drop</h2>
//             <div className={styles.subTitle}>Subscribe for the latest news, drops & collectibles</div>
//           </div>
//           <div className='w-[60%]'>
//             <input type='email' placeholder='email' className={styles.inputField}/>
//             <button className={styles.button}>Subscribe</button>
//             <div className={styles.privacy}>
//               After reading the <span className='text-blue-500'>Privacy Notice</span>, you may subscribe for our newsletter to get special offers and occasional surveys delivered to your inbox. Unsubscribe at any time by clicking on the link in the email.
//             </div>
//             <div className={styles.accept}>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer" onClick={() => setChecked( prev => !prev)}>
//                 <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="white" stroke="#E3E3E3"></rect>
//                 { checked && <path d="M6.5 13L10 16.5L18.5 8" stroke="black"></path>}
//               </svg>
//               <div className='ml-2 text-[14px]'>
//                 By entering my email and subscribing I confirm and agree to the above.
//               </div>
//             </div>
//           </div>
//       </div> 
//     </div>
//   )
// }
import { NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import subscribe from '../../assets/subscribe-v2.webp';

const styles = {
  container: 'relative w-full h-[60vh] mb-20 text-white flex items-center justify-center',
  overlay: 'absolute inset-0 bg-gradient-to-r from-[#0f1c39]/70 to-[#0f1c39]/70 backdrop-blur-md z-10',
  subscribeContainer: 'relative z-20 flex flex-col items-center justify-center w-[85%] md:w-[70%] text-center gap-6',
  title: 'text-[50px] md:text-[60px] font-black bg-gradient-to-r from-[#1199fa] to-[#11d0fa] bg-clip-text text-transparent',
  subTitle: 'text-[20px] md:text-[28px] font-semibold',
  form: 'flex w-full gap-0 max-w-3xl mx-auto mt-4',
  inputField: 'flex-1 p-4 rounded-l-3xl bg-[#0f1c39]/50 backdrop-blur-md text-white placeholder-white/70 focus:outline-none border border-white/20',
  button: 'p-4 rounded-r-3xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] font-bold hover:brightness-110 transition-all cursor-pointer',
  privacy: 'text-sm text-white/70 mt-4',
  accept: 'flex items-center gap-2 justify-start mt-3 text-sm text-white/80 cursor-pointer'
};

export const NewsLetter: NextPage = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.container}>
      {/* Background Image */}
      <Image src={subscribe} alt="subscribe" layout="fill" objectFit="cover" className="absolute inset-0 z-0"/>
      
      {/* Glass overlay */}
      <div className={styles.overlay}></div>

      {/* Main content */}
      <div className={styles.subscribeContainer}>
        <h2 className={styles.title}>Never miss a drop</h2>
        <div className={styles.subTitle}>Subscribe for the latest news, drops & collectibles</div>

        {/* Form */}
        <div className={styles.form}>
          <input type="email" placeholder="Enter your email" className={styles.inputField} />
          <button className={styles.button}>Subscribe</button>
        </div>

        {/* Privacy notice */}
        <div className={styles.privacy}>
          <span className="block">After reading the <span className="text-blue-500">Privacy Notice</span>, you may subscribe for our newsletter </span>
          <span className="block">to get special offers and occasional surveys delivered to your inbox.</span>
          <span className="block">Unsubscribe at any time by clicking on the link in the email.</span>
        </div>



        {/* Checkbox */}
        <div className={styles.accept} onClick={() => setChecked(prev => !prev)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
            <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={checked ? "#1199fa" : "white"} stroke="#E3E3E3"></rect>
            {checked && <path d="M6.5 13L10 16.5L18.5 8" stroke="white" strokeWidth={2}></path>}
          </svg>
          <span>By entering my email and subscribing I confirm and agree to the above.</span>
        </div>
      </div>
    </div>
  );
};
