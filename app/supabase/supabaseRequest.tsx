"use client"
import { supabaseClient } from './supabaseClinet';

interface Lessons {
  id: number;
  title: string;
  content: string;
  day_id: number;
  image_url: string;
  video_url: string;
}

export const getLessonsList = async (supabaseAccessToken: string | null) => {
  try {
    if (!supabaseAccessToken) return { data: null, error: "No access token" };

    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase.from('lessons').select(`
      *,
      day_id (
      id,
        day_id,
        title
      )
    `).order('id', { ascending: true });

    return { data, error };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
};

export const getLessonsByDay = async (supabaseAccessToken: string | null, id: string | null) => {
  try {
    if (!supabaseAccessToken) return { data: null, error: "No access token" };

    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase
      .from('lessons')
      .select(`
      *,
      day_id (
        id,
        title
      )
    `)
      .eq('day_id', id).order('id', { ascending: true });

    return { data, error };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
};

export const getDayList = async (supabaseAccessToken: string | null) => {
  try {
    if (!supabaseAccessToken) return { daylist: null, _error: "No access token" };

    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase
      .from('day')
      .select(`
      *
    `)
    .order('id', { ascending: true });

    let daylist = data
    let _error = error

    return { daylist, _error };
  } catch (e) {
    console.error(e);
    return { daylist: null, _error: e };
  }
};

export const sysncUser = async (user: any, supabaseAccessToken: string | null) => {
  try {
    if (!supabaseAccessToken) return { data: null, error: "No access token" };

    const supabase = await supabaseClient(supabaseAccessToken);

    // Check if user exists in Supabase
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user from Supabase:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.error('Error fetching user from Supabase.')
      // User doesn't exist in Supabase, create a new user record

      const { data: newUser, error: createError } = await supabase
        .from('user')
        .insert({ user_id: user.id, email: user?.emailAddresses[0].emailAddress, role: user.publicMetadata.role ? (user.publicMetadata.role as string) : ("user") });

      if (createError) {
        console.error('Error creating user in Supabase:', createError.message);
        return;
      }
      console.log('User created in Supabase:', newUser);
    }

  } catch (e) {
    console.error(e);
    return;
  }
};

export const createDay = async (title: string, dayId: number | null, supabaseAccessToken: string | null) => {
  try {

    if (!supabaseAccessToken) return { data: null, error: "No access token" };
    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase.from('day').insert([{ title, day_id: dayId }]);
    return data;

  } catch (error) {
    console.error('Error creating day.');
    return null;
  }
}


export const createLessons = async (topic: string, day_Id: number|null,content: string,isPractical:boolean,imageUrl:string,videoUrl:string, supabaseAccessToken: string | null) => {
  try {

    if (!supabaseAccessToken) return { data: null, error: "No access token" };
    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase.from('lessons').insert([{ title:topic, day_id: day_Id,content,is_practical:isPractical,image_url:imageUrl ,video_url:videoUrl}]);
   
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error creating day.');
    return null;
  }
}
