import os
import praw
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from firebase_admin import firestore, credentials, initialize_app
from google.cloud import language_v1
import spacy

client = language_v1.LanguageServiceClient()

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


COLLECTION_POSTS = u'posts'
COLLECTION_ENTITIES = u'entities'

cred = credentials.ApplicationDefault()
initialize_app()

db = firestore.client()

entities_ref = db.collection(COLLECTION_ENTITIES)
posts_ref = db.collection(COLLECTION_POSTS)


@app.route('/clusters', methods=['POST'])
def cluster_topics():
    return []


nlp = spacy.load('en_core_web_sm')

MAPPINGS = {
    'prof': 'professor',
}


def map_text_to_entity(text):
    if text in MAPPINGS:
        return MAPPINGS[text]
    return text


@app.route('/data')
def process_submissions(limit=250):
    """Get latest submissions from subreddit, perform sentiment analysis, and upload them to database."""
    submissions = reddit.subreddit('utdallas').hot(limit=limit)
    results = []

    post_to_entity_mappings = {}
    entity_to_post_mappings = {}
    # Used to track global importance
    entity_counts = {}

    print('--- Processing posts ---')
    for submission in submissions:
        over18 = submission.over_18
        if over18:
            # Nope, not doing that tonight
            continue
        is_text = submission.is_self
        # TODO: Maybe do something with is_text
        post_id = submission.id
        score = submission.score
        title = submission.title
        timestamp = submission.created_utc
        print(f'--- Post title: {title}')
        author = {
            "name": submission.author.name,
            "image": submission.author.icon_img,
        }
        text = submission.selftext
        comments = submission.comments
        print(f'Comments for "{title}":', str(comments))

        # TODO: Do named entity recognition
        type_ = language_v1.Document.Type.PLAIN_TEXT
        document = language_v1.Document(
            content=text, type_=language_v1.Document.Type.PLAIN_TEXT
        )

        text_content = f'{title}\n{text}'

        language = "en"
        document = {
            "content": text_content,
            "type_": type_,
            "language": language,
        }

        encoding_type = language_v1.EncodingType.UTF8

        print('--- Analyzing entities ---')
        response = client.analyze_entities(
            request={
                'document': document,
                'encoding_type': encoding_type,
            }
        )

        tracked_entities = set()

        print('--- Collecting entities from post content ---')
        for entity in response.entities:
            if language_v1.Entity.Type(entity.type_).name == 'NUMBER':
                continue
            key = entity.name.lower()
            key = map_text_to_entity(key)
            print(u"Entity name: {}".format(key))
            print(f'Entity type: {language_v1.Entity.Type(entity.type_).name}')

            print('Adding entity to list')
            if key in entity_counts:
                entity_counts[key] += 1
            else:
                entity_counts[key] = 1

            if key in tracked_entities:
                continue
            else:
                tracked_entities.add(key)

        # TODO: Get entities from coments

        entity_ref = entities_ref.document(str(key).replace('/', ' '))
        entity_ref.set({
            u'name': entity.name,
            u'posts': firestore.ArrayUnion([
                {
                    'id': post_id,
                    # TODO: Document timestamp of topic occurring
                    'timestamp': ''
                }
            ]),
        }, merge=True)

        entity_to_post_mappings[entity.name] = {
            u'name': entity.name,
        }

        result = {
            "id": post_id,
            "score": score,
            "title": title,
            "author": author,
            "text": text,
            "timestamp": timestamp,
        }

        try:
            posts_ref.document(post_id).set(result)
        except e:
            print(e)


if __name__ == "__main__":
    process_submissions()
    # app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
