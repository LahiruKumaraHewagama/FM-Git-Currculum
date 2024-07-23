"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Header from '../components/header';
import Footer from '../components/footer';
import Error from '../components/error';
import { getLessonsList } from '../supabase/supabaseRequest';
import { useSession } from '@clerk/nextjs';
import Link from 'next/link';

const Dashboard = () => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useSession();
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const loadLessons = async () => {
            if (session) {
                const supabaseAccessToken = await session.getToken({
                    template: 'supabase'
                });
                const { data, error } = await getLessonsList(supabaseAccessToken);

                if (error) {
                    console.error(error);
                    setLessons([]);
                } else {
                    if (data) {
                        setLessons(data);
                    } else {
                        setLessons([]); // Handle case where data is null
                    }
                }
                setLoading(false);
            }
        };

        loadLessons();
    }, [session]);

    if (loading) {
        return <div className='flex justify-center items-center pt-10'>Loading...</div>;
    }

    if (!isSignedIn) {
        return (<Error />)
    }

    console.log(user?.publicMetadata.role);
    if (lessons.length === 0) {
        return <div style={{ textAlign: "center", padding: "10px" }} ><p>No lessons found.</p></div>;
    }

    // Group lessons by day
    const lessonsByDay = lessons.reduce((acc: any, lesson) => {
        if (!acc[lesson.day_id.day_id]) {
            acc[lesson.day_id.day_id] = [];
        }
        acc[lesson.day_id.day_id].push(lesson);
        return acc;
    }, {});

    return (
        <>
            <Header />

            <div className='flex min-h-screen flex-col p-1'>
                <div className="flex flex-col text-center items-center">
                    <div className="grid">
                        <div className="flex justify-center">
                            <img src="/logo.png" alt="Description of GIF" width="150" height="90" />
                        </div>
                        <div className="text-4xl font-semibold text-slate-900 mb-1">WELCOME to CLERK-SUPABASE CURRICULUM <span className=' text-slate-600 text-3xl'>{user?.username}</span></div>
                        <div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 p-4">
                    <div className='col-span-3'></div>
                    <div className='col-span-6'>
                        <div className='text-center pt-10 pb-3'>
                            <h2 className='font-bold'>Table of Content</h2>
                        </div>

                        <table className="min-w-full bg-white border border-cyan-800">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Day</th>
                                    <th className="py-2 px-4 border-b">Title</th>
                                    <th className="py-2 px-4 border-b">Topics</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(lessonsByDay).map((day_id) => {
                                    const dayLessons = lessonsByDay[day_id];
                                    return dayLessons.map((lesson: any, index: number) => (
                                        <tr key={lesson.id}>
                                            {index === 0 && (
                                                <td className="py-2 px-4 border-b" rowSpan={dayLessons.length}>
                                                    {lesson.day_id.day_id}
                                                </td>
                                            )}
                                            {index === 0 && (
                                                <td className="py-2 px-4 border-b" rowSpan={dayLessons.length}>
                                                    <Link href={`/day/${lesson.day_id.day_id}`}>
                                                        <p className="text-blue-600 hover:text-blue-800">{lesson.day_id.title}</p>
                                                    </Link>
                                                </td>
                                            )}
                                            {lesson.title ? <td className="py-2 px-4 border-b"><p >{lesson.title}</p> </td> : (<></>)}


                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-span-3'></div>
                </div>
            </div>
            <Footer />

        </>
    )
}

export default Dashboard