import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import PinGate from '@/components/PinGate'

export default async function Home() {
  const cookieStore = await cookies()
  if (cookieStore.get('noxil-auth')) redirect('/hub')

  return (
    <div className="max-w-[720px] mx-auto px-10">
      <Header />
      <PinGate />
    </div>
  )
}
