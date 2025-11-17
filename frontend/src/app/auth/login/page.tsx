import { useAuth } from "@/hook/useAuth";

export default function Login()
const {login, loading, error} = useAuth();

    return (
        <div>
            {!loading && <p> Definitivamente nao está carregando</p>}
            {!error && <p> Definitivamente nao está com erro</p>}
            <h1 className='text-6xl font-black'>Login bem legal</h1>
        </div>
    );
}