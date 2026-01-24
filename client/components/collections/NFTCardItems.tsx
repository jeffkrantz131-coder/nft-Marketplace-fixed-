import { IItem } from '../../interfaces'
import { NFTCard } from './NFTCard'

export const NFTCardItems = (props: { items: IItem[], message?: string, isLoading?: boolean }) => {
  const {items, message = "NFT's not found", isLoading = false }  = props;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 py-8'>
      { items.length > 0 ? ( items.map((item:IItem) => (
       <div key={item.tokenId}>
         <NFTCard {...item} />
       </div>
      )) ) :
      (
      !isLoading && <div>
        <h3 className='text-white text-center text-2xl'>{message}</h3>
      </div>
      )
      }
    </div>
  )
}
