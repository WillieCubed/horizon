import os
import praw
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify

load_dotenv()

CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')
CLIENT_ID = os.getenv('REDDIT_APP_ID')
SUBREDDIT = os.getenv('SUBREDDIT')

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    user_agent="timebook v0.1.0 by /u/Williecubed"
)

app = Flask(__name__)


@app.route('/data')
def get_submissions():
    submissions = reddit.subreddit('utdallas').hot(limit=10)
    results = []
    for submission in submissions:
        over18 = submission.over_18
        if over18:
            # Nope, not doing that tonight
            continue
        is_text = submission.is_self
        # TODO: Maybe do something with this
        id = submission.id
        score = submission.score
        title = submission.title
        author = {
            "name": submission.author.name,
            "image": submission.author.icon_img,
        }
        text = submission.selftext
        comments = submission.comments
        print(f'Comments for {title}:', comments)

        # TODO: Do named entity recognition
        entities = []

        result = {
            "id": id,
            "score": score,
            "title": title,
            "author": author,
            "text": text,
            "entities": entities,
        }
        results.append(result)

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
