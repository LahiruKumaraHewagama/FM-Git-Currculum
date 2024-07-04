"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Header from '../components/header';
import Footer from '../components/footer';
import Error from '../components/error';
import { createDay,createLessons } from '../supabase/supabaseRequest';
import { useSession } from '@clerk/nextjs';
import Link from 'next/link';

const Manage = () => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useSession();
    const { isSignedIn, user } = useUser();

    const [title, setTitle] = useState('');
    const [dayId, setDayId] = useState<number>();
    const [days, setDays] = useState<any[] | null>([]);

    const [topic, setTopic] = useState('');
    const [day_Id, setDay] = useState<number>();
    const [content, setContent] = useState('');
    const [imageUrl, setImage] = useState('');
    const [isPractical, setPractical] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const loadSession = async () => {
            if (session) {
                const supabaseAccessToken = await session.getToken({
                    template: 'supabase'
                });
                setToken(supabaseAccessToken);
            }
        };
        loadSession();
    }, [session]);

    const handleCreateDay = async () => {
        if (token) {
            await createDay(title, dayId, token);
            alert("Successfully added new date!");
        }
    };

    const handleCreateLessons = async () => {
        if (token) {
            await createLessons(topic, day_Id, content, isPractical, imageUrl, token);
            alert("Successfully created new lesson!");
        }
    };

    if (!isSignedIn || user?.publicMetadata.role == "user") {
        return ( <div className='flex justify-center items-center pt-10'>Loading...</div>)
    }

    // if (token) {
    //     return ( <div className='flex justify-center items-center pt-10'>Loading...</div>)
    // }

    console.log(user?.publicMetadata.role);

    return (
        <>
            <Header />
            <div className='flex min-h-screen flex-col p-1'>
                <div className="flex flex-col text-center items-center">
                    <div className="grid">
                        <div className="flex justify-center">
                            <img src="/logo.png" alt="Description of GIF" width="150" height="90" />
                        </div>
                        <div className="text-4xl font-semibold text-slate-900 mb-10">Managing Lessons Content<span className=' text-slate-600 text-3xl'>{user?.username}</span></div>
                        <div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 p-4">
                    <div className='col-span-2'></div>
                    <div className='col-span-5'>
                        <h4 className="text-2xl font-semibold" >Adding Date</h4>
                        <form>
                            <input type="text" className="block py-2.5 px-0  w-[500px] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
                            <input type="number" className="block py-2.5 px-0  text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer" value={dayId} onChange={(e) => setDayId(parseInt(e.target.value))} placeholder="Enter day ID" />
                            <button type="submit" onClick={handleCreateDay} className=" mt-5 text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">
                                ADD
                            </button>
                        </form>
                    </div>
                    <div className='col-span-5'>

                        <h4 className="text-2xl font-semibold" >Adding Lessons</h4>
                        <form>
                            <input type="text" className="block py-2.5 px-0  w-[500px] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic" />
                            <input type="number" className="block py-2.5 px-0  text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer" value={day_Id} onChange={(e) => setDay(parseInt(e.target.value))} placeholder="Enter day ID" />
                            <input type="text" className="block py-2.5 px-0  w-[500px] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer" value={imageUrl} onChange={(e) => setImage(e.target.value)} placeholder="Enter Image URL" />
                            <div className="flex items-start mb-5 pt-5">
                                <div className="flex items-center h-5">
                                    <input
                                        id="practical"
                                        type="checkbox"
                                        checked={isPractical}
                                        onChange={(e) => setPractical(e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                    />
                                </div>
                                <label htmlFor="practical" className="ms-2 text-sm font-medium text-black-900 dark:text-gray-400">
                                    Is Practical
                                </label>
                            </div>
                            <textarea id="content" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>
                            <button type="submit" onClick={handleCreateLessons} className=" mt-5 text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">
                                Create
                            </button>
                        </form>
                        {/* <div className='text-center'>
                            <h4 className="text-2xl font-semibold" >Date</h4>
                            <br />
                        </div>

                        <table className="min-w-full bg-white border-gray-400 overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Title</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {days?.map((day: any) => (
                                    <tr key={day.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.day_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}

export default Manage