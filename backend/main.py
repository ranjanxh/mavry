from fastapi import FastAPI, HTTPException,status
from fastapi.responses import JSONResponse

app=FastAPI()

posts: list[dict] = [
    {
        "id": 1,
        "author": "Corey Schafer",
        "title": "FastAPI is Awesome",
        "content": "This framework is really easy to use and super fast.",
        "date_posted": "April 20, 2025",
    },
    {
        "id": 2,
        "author": "Jane Doe",
        "title": "Python is Great for Web Development",
        "content": "Python is a great language for web development, and FastAPI makes it even better.",
        "date_posted": "April 21, 2025",
    },
]

@app.get("/health")
def health():
  return {"status":"healthy"}

@app.get("/api/posts")
def get_post():
  return posts

@app.get("/api/posts/{post_id}")
def get_post_id(post_id:int):
  for i in posts:
    if i["id"]==post_id:
      return i
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
  
  



         