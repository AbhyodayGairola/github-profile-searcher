from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@app.get("/api/github/{username}")
def get_github_user(username: str):

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    user_response = requests.get(
        f"https://api.github.com/users/{username}",
        headers=headers
    )

    if user_response.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail="GitHub user not found"
        )

    if user_response.status_code != 200:
        raise HTTPException(
            status_code=user_response.status_code,
            detail="GitHub API request failed"
        )

    user = user_response.json()

    repo_response = requests.get(
        f"https://api.github.com/users/{username}/repos?sort=updated&per_page=5",
        headers=headers
    )

    repositories = repo_response.json()

    return {
        "username": user["login"],
        "avatar_url": user["avatar_url"],
        "bio": user["bio"],
        "followers": user["followers"],
        "repositories": [
            {
                "name": repo["name"],
                "url": repo["html_url"]
            }
            for repo in repositories
        ]
    }