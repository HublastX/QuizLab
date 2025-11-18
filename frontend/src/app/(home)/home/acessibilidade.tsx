export default function Acessibilidade() {
    return (
        <div className="bg-layout-card p-4 rounded-lg border">
            <div className="overflow-hidden">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold ">
                        Configurações de Acessibilidade
                    </h1>
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <div className="flex items-center justify-between p-4 rounded-lg border  cursor-pointer hover:bg-hover transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-black to-white rounded-lg flex items-center justify-center">
                                <span className=" font-bold text-xs">A/C</span>
                            </div>
                            <div>
                                <h2 className="font-semibold ">Auto Contraste</h2>
                                <p className="text-sm text-text-secondary">Otimiza cores para melhor visibilidade</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                            <div className="w-6 h-6 bg-white border border-gray-400 rounded-full absolute left-0 top-0 shadow-sm transform transition-transform duration-200"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border  cursor-pointer hover:bg-hover transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className=" font-bold text-lg">A+</span>
                            </div>
                            <div>
                                <h2 className="font-semibold ">Aumentar Fonte</h2>
                                <p className="text-sm text-text-secondary">Alterar o tamanho do texto</p>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <button className="w-8 h-8 bg-blue-500  rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-sm font-medium">
                                A-
                            </button>
                            <button className="w-8 h-8 bg-blue-500  rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-sm font-medium">
                                A+
                            </button>
                        </div>
                    </div>

                    {/* Fonte para Dislexia */}
                    <div className="flex items-center justify-between p-4 rounded-lg border  cursor-pointer hover:bg-hover transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <span className=" font-bold text-xs">Dys</span>
                            </div>
                            <div>
                                <h2 className="font-semibold ">Fonte Dislexia</h2>
                                <p className="text-sm text-text-secondary">Usa fonte especial para dislexia</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                            <div className="w-6 h-6 bg-white border border-gray-400 rounded-full absolute left-0 top-0 shadow-sm transform transition-transform duration-200"></div>
                        </div>
                    </div>

                    {/* Modo Daltonismo */}
                    <div className="flex items-center justify-between p-4 rounded-lg border  cursor-pointer hover:bg-hover transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <span className=" font-bold text-xs">CD</span>
                            </div>
                            <div>
                                <h2 className="font-semibold ">Modo Daltonismo</h2>
                                <p className="text-sm text-text-secondary">Ajusta cores para diferentes tipos</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                            <div className="w-6 h-6 bg-white border border-gray-400 rounded-full absolute left-0 top-0 shadow-sm transform transition-transform duration-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}