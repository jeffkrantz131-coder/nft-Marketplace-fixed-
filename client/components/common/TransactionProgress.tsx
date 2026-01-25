// export const TransactionProgress = () => (
//   <div className="font-bold mt-4 p-4 flex">
//   <h4 className="text-white mr-2 text-xl">Transaction in progress</h4>
//   <svg
//     width="60"
//     height="30"
//     viewBox="0 0 120 30"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="#fff"
//   >
//     <circle cx="15" cy="15" r="15">
//       <animate
//         attributeName="r"
//         from="15"
//         to="15"
//         begin="0s"
//         dur="0.8s"
//         values="15;9;15"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//       <animate
//         attributeName="fill-opacity"
//         from="1"
//         to="1"
//         begin="0s"
//         dur="0.8s"
//         values="1;.5;1"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//     </circle>
//     <circle cx="60" cy="15" r="9" fillOpacity="0.3">
//       <animate
//         attributeName="r"
//         from="9"
//         to="9"
//         begin="0s"
//         dur="0.8s"
//         values="9;15;9"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//       <animate
//         attributeName="fill-opacity"
//         from="0.5"
//         to="0.5"
//         begin="0s"
//         dur="0.8s"
//         values=".5;1;.5"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//     </circle>
//     <circle cx="105" cy="15" r="15">
//       <animate
//         attributeName="r"
//         from="15"
//         to="15"
//         begin="0s"
//         dur="0.8s"
//         values="15;9;15"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//       <animate
//         attributeName="fill-opacity"
//         from="1"
//         to="1"
//         begin="0s"
//         dur="0.8s"
//         values="1;.5;1"
//         calcMode="linear"
//         repeatCount="indefinite"
//       />
//     </circle>
//   </svg>
// </div>
// )
export const TransactionProgress = () => (
  <div className="font-bold mt-4 p-4 flex items-center gap-3 
                  bg-white/10 backdrop-blur-xl border border-white/20 
                  rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.2)]">

    <h4 className="text-cyan-300 text-xl drop-shadow-[0_0_10px_cyan]">
      Transaction in progress
    </h4>

    <svg width="60" height="30" viewBox="0 0 120 30">
      <defs>
        <linearGradient id="neonGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="120" y2="0">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="50%" stopColor="#ff00ff" />
          <stop offset="100%" stopColor="#00ffff" />
        </linearGradient>
      </defs>

      <circle cx="15" cy="15" r="15" fill="url(#neonGradient)">
        <animate attributeName="r" values="15;9;15" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;.4;1" dur="0.8s" repeatCount="indefinite" />
      </circle>

      <circle cx="60" cy="15" r="9" fill="url(#neonGradient)">
        <animate attributeName="r" values="9;15;9" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".4;1;.4" dur="0.8s" repeatCount="indefinite" />
      </circle>

      <circle cx="105" cy="15" r="15" fill="url(#neonGradient)">
        <animate attributeName="r" values="15;9;15" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;.4;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);
