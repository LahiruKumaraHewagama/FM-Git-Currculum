'use client'
import Footer from '@/app/components/footer';
import Header from '@/app/components/header';
import Error from '@/app/components/error';
import { useSession, useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Lessons } from '@/app/models';
import { getLessonsByDay } from '@/app/supabase/supabaseRequest';

const LessonPage: React.FC = () => {
  const [lessons, setLessons] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const { session } = useSession();
  const { isSignedIn, user } = useUser();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  console.log(id);

  useEffect(() => {
    const loadLessons = async () => {
      if (session) {
        const supabaseAccessToken = await session.getToken({
          template: 'supabase'
        });
        const { data, error } = await getLessonsByDay(supabaseAccessToken, id);

        if (error) {
          console.error(error);
          setLessons([]);
        } else {
          if (data) {
            console.log(data)
            if (data.length > 0) {
              setTitle(data[0]['day_id']['title']);
            }
            setLessons(data);
          } else {
            setLessons([]); // Handle case where data is null
          }
        }
        setLoading(false);
      }
    };

    loadLessons();
  }, [session, id]);


  const getVideoId = (url:string) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  };

  if (loading) {
    return <div className='flex justify-center items-center pt-10'>Loading...</div>;
  }

  if (!isSignedIn) {
    return (<Error />)
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col p-1">
        <div className="text-center items-center pt-10">
          {/* <div className="flex justify-center">
            <img src="/logo.png" alt="Description of GIF" width="80" height="90" />
          </div> */}
          {/* <div >
            <h1 className=" font text-base sm:text-lg lg:text-4xl font-bold text-blue-700 pb-5"> GIT CURRICULUM </h1>
          </div> */}
          {/* <h1 className=" font text-base sm:text-lg lg:text-4xl font-bold text-blue-700 pb-5">__________________________</h1> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 ">
          <div className='col-span-3 text-right'>
            <p className='font-bold text-4xl text-blue-dark'>DAY {id}</p>
            <h3 className='font-bold text-blue-600'>{title}</h3>
          </div>
          <div className='col-span-1 text-center'>
            <div className="h-[100%] border-r border-x-blue-dark w-[50%]"></div>
          </div>
          <div className='col-span-7'>
            <p className='font-bold text-2xl text-blue-600'>LESSONS</p>
            {lessons.filter((lesson: { is_practical: any; }) => !lesson.is_practical).map((lesson: Lessons) => (
              <div key={lesson.id} className='mb-4'>
                {lesson.title? <h2 className='text-lg font-semibold'>{lesson.title}</h2> : (<></>)}
                <p>{lesson.content}</p>
                {lesson.image_url ?
                  <div className="flex justify-left pt-5">
                    <img src={lesson.image_url} alt="Description of img" width="100%" />
                  </div> : <></>
                }
                <br />
                {lesson.video_url ?
                  <div className="flex justify-left pt-5 pb-10">
                   <div >
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${getVideoId(lesson.video_url)}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube Video"
                      ></iframe>
                    </div>
                  </div> : <></>
                }
              </div>
            ))}
            {/* <p className='font-bold  text-2xl mt-10 text-blue-600'>PRACTICAL</p>
            {lessons.filter((lesson: { is_practical: any; }) => lesson.is_practical).map((lesson: Lessons) => (
              <div key={lesson.id} className='mb-4'>
                <h2 className='text-lg font-semibold'>{lesson.title}</h2>
                <p>{lesson.content}</p>
                {lesson.image_url ?
                  <div className="flex justify-left pt-5">
                    <img src={lesson.image_url} alt="Description of img" width="100%" />
                  </div> : <></>
                }
                <br />
                {lesson.video_url ?
                  <div className="flex justify-left pt-5 pb-10">
                    <div >
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${getVideoId(lesson.video_url)}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube Video"
                      ></iframe>
                    </div>
                  </div> : <></>
                }
              </div>
            ))} */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LessonPage;
