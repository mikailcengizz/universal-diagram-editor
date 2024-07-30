import React from 'react'

function Header() {
  return (
    <header>
        <div className='flex w-full bg-orange-300 px-12 align-middle items-center h-14 justify-between'>
            <div className='flex w-1/2'>
                <a href='/'>Universal Diagram Editor</a>
            </div>

            <div className='flex w-1/2 justify-end'>
                <a href='/editor'>Editor</a>
            </div>
        </div>
    </header>
  )
}

export default Header