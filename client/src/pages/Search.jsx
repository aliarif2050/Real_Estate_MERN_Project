import React from 'react'

const Search = () => {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-1 md:border-r-1 md:min-h-screen'>
        <form className='flex flex-col gap-4'>
            <div className='flex items-center gap-2 '>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input type="text" id='searchTerm' 
                placeholder='Search'
                className='border rounded-lg p-3 w-full'/>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
                <label className='font-semibold'>Type:</label>
                
                <div className='flex gap-3'>
                    <input type="checkbox" id="all" className='w-5'/>
                    <span>Rent & Sale</span>
                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id="sale" className='w-5'/>
                    <span>For Sale</span>
                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id="rent" className='w-5'/>
                    <span>For Rent</span>
                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id="offer" className='w-5'/>
                    <span>On Offer</span>
                </div>
                
            </div>
            <div className='flex flex-wrap items-center gap-2'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-3'>
                    <input type="checkbox" id="parking" className='w-5'/>
                    <span>Parking</span>
                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id="furnished" className='w-5'/>
                    <span>Furnished</span>
                </div>     
            </div>
            <div className='flex flex-wrap items-center gap-2'>
                <label className='font-semibold'>Sort By:</label>
                <select id="sort_order" className='border rounded-lg p-3'>
                    <option value="">Price: High to Low</option>
                    <option value="">Price: Low to High</option>
                    <option value="">Latest</option>
                    <option value="">Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-80'>Search</button>
        </form>
        </div>
        <div className='p-7 flex-1'>
            <h1 className='text-slate-700 text-2xl font-semibold border-b'>Search Results:</h1>
        </div>
    </div>
  )
}

export default Search