import Link from 'next/link'
import {ReactNode} from 'react'
import Image from 'next/image'

const RootLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='root-layout'>
      <nav className=''>
        <Link href="/" className='flex items-center gap-2'>
        <Image src="/globe.svg" alt='' height={32} width={38}></Image>
        <h2 className='text-primary-100'>Prepwise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
