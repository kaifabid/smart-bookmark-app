'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard(){

const [user,setUser]=useState<any>(null)
const [title,setTitle]=useState("")
const [url,setUrl]=useState("")
const [bookmarks,setBookmarks]=useState<any[]>([])

useEffect(()=>{

const getSession=async()=>{

const {data:{session}}=await supabase.auth.getSession()

setUser(session?.user)

fetchBookmarks()

} 

getSession()

// realtime
const channel=supabase
.channel("bookmarks")

.on(

"postgres_changes",

{event:"*",schema:"public",table:"bookmarks"},

()=>{

fetchBookmarks()

}

)

.subscribe()

return ()=>{

supabase.removeChannel(channel)

}

},[])

const fetchBookmarks=async()=>{

const {data}=await supabase

.from("bookmarks")

.select("*")

.order("created_at",{ascending:false})

setBookmarks(data || [])

}

const addBookmark=async()=>{

if(!title || !url) return alert("Fill fields")

await supabase.from("bookmarks").insert({

title,
url,
user_id:user.id

})

setTitle("")
setUrl("")

}

const deleteBookmark=async(id:string)=>{

await supabase

.from("bookmarks")

.delete()

.eq("id",id)

}

return(

<div className="p-10">

<h1 className="text-xl font-bold">

Welcome {user?.email}

</h1>

<div className="mt-5">

<input

placeholder="Title"

value={title}

onChange={(e)=>setTitle(e.target.value)}

className="border p-2 m-2"

/>

<input

placeholder="URL"

value={url}

onChange={(e)=>setUrl(e.target.value)}

className="border p-2 m-2"

/>

<button

onClick={addBookmark}

className="bg-blue-500 text-white px-4 py-2"

>

Add Bookmark

</button>

</div>

<h2 className="mt-6 font-bold">

My Bookmarks

</h2>

{

bookmarks.map((b)=>(

<div

key={b.id}

className="border p-3 mt-2 flex justify-between"

>

<div>

<p>{b.title}</p>

<a

href={b.url}

target="_blank"

className="text-blue-600"

>

{b.url}

</a>

</div>

<button

onClick={()=>deleteBookmark(b.id)}

className="bg-red-500 text-white px-3"

>

Delete

</button>

</div>

))

}

</div>

)

}
