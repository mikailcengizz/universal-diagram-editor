import React from 'react'

function Header() {
  return (
    <header>
        <div className='flex w-full bg-red-300 px-12 align-middle items-center h-14 justify-between'>
            <div>
                <a href='/'>Home</a>
            </div>

            <div>
                <a href='/contact'>Contact</a>
            </div>
        </div>
    </header>
  )
}

export default Header