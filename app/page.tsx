"use client";
import Image from 'next/image';
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  useSession
} from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Header from "./components/header";
import Footer from "./components/footer";
import { useEffect } from 'react';
import { initiateRole } from './clerk/initiateRole';
import { sysncUser } from './supabase/supabaseRequest';
import Dashboard from './dashboard/page';

export default function Home() {
  const { isSignedIn, user } = useUser();

  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    const syncUserData = async () => {
      if (user) {

        if (!user.publicMetadata.role){
          initiateRole(user?.id,"user")
        }
        
        if (!session) return; // Check if session exists
        const supabaseAccessToken = await session.getToken({
          template: 'supabase'
        }) as string;
        
        await sysncUser(user,supabaseAccessToken);
      }
    };

    syncUserData();
  }, [user]);


  if (isSignedIn) {
    router.push('/dashboard')
  }

  return (
    <main>
      <Header />

      <div className="flex min-h-screen flex-col p-1">
        {isSignedIn ? (
          <Dashboard />
        ) : (
          <div className="text-center items-center pt-10">
            <div className="flex justify-center">
              <img src="/logo.png" alt="Description of GIF" width="80" height="90" />
            </div>
            <div >
              <h1 className=" font text-base sm:text-lg lg:text-4xl font-bold text-blue-700 pb-5"> CLERK - SUPABASE CURRICULUM </h1>
              <h6 className=' text-sm lg:text-md text-zinc-800 pb-1'>Welcome to the Curriculum platform</h6>
              <h6 className=' text-sm lg:text-md text-zinc-800 pb-10'>Designed to learn and enhance your skills with clerk authentication and Supabase Role-based Access Control (RBAC).</h6>
              <button className="bg-transparent hover:bg-blue-dark text-blue-dark font-semibold hover:text-white py-2 mb-10 px-4 border border-blue-700 hover:border-transparent rounded">
                <SignInButton>Get Start</SignInButton>
              </button>
            </div>
            <div className="flex justify-center">
              <img src="/bg.gif" alt="Description of GIF" width="800" height="900" />
            </div>
            <h1 className=" font text-base sm:text-lg lg:text-4xl font-bold text-blue-700 pb-5">__________________________</h1>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

