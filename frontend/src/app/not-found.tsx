import { FiAlertTriangle } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="font-sans absolute inset-0 flex items-center justify-center bg-layout-background z-50">
      <div className="text-5xl">
        <div className= "text-9xl gap-6 justify-center flex">
        <FiAlertTriangle className='stroke-qorange-default'/>
        <h1 className="text-semibold">404</h1>
        </div>
        <h2>Pagina não encontrada.</h2>
      </div>
    </div>
  )
}

export default NotFound;
