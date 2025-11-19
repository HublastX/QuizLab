import React from 'react'
import { FiUser } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import Divider from '@/components/ui/divider';

function page() {
  return (
    <div className='flex items-start flex-col'>
        <div className='flex items-center gap-10'>
            <div className='flex flex-col items-center'>
                <div className='size-32 bg-neutral-50 rounded-full'>
                    <div className='w-[100%] h-[100%] flex items-center justify-center'>
                        <FiUser className='size-24 text-qorange-400' />
                    </div>
                </div>
                <div>
                    <Button className='mt-4 bg-qorange-400 text-center px-4 py-2 text-white rounded hover:animate-píng'>
                        Mudar Foto
                    </Button>
                </div>
            </div>
            <div>
                <h1 className='text-5xl mt-2 font-semibold'>Jornas Farias</h1>
                <p>suamãe@gmail.com</p>
                <Divider dotted={false} />
            </div>
        </div>
    </div>
  );
};

export default page;
