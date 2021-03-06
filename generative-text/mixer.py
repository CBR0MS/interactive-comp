import json, random, re
import spacy 
# from gensim.test.utils import common_texts, get_tmpfile
# from gensim.models import Word2Vec
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

data = []
nlp = spacy.load('en_core_web_lg')
# path = get_tmpfile("word2vec.model")
# model = Word2Vec(common_texts, size=100, window=5, min_count=1, workers=4)

with open('newPhilosophies.json') as f:
    data = json.load(f)

revised_data = []

for entry in data:
    title = entry['title']
    text = entry['text']
    doc = nlp(text)

    people = []

    for ent in doc.ents:
        # or ent.label_ == 'GPE' or ent.label_ == 'LOC'
        if ent.label_ == 'PERSON' or ent.label_ == 'PER' or ent.label_ == 'GPE' or ent.label_ == 'LOC':
            people.append(ent.text)

    revised_people = []

    print("\ncomparing to {}".format(title))

    for person in people:

        sim = similar(person, title)

        if (not bool(re.search(r'\d', person)) and (person not in title) and (sim < 0.4)):
            print(person)

            split_name = person.split(' ')
            name = ''

            for part in split_name:
                firstpart, secondpart = part[:len(part)//2], part[len(part)//2:]
                name = name + (secondpart + firstpart).title() + ' '

            name = name.strip()
            revised_people.append((person, name))

    for person, new_person in revised_people:
        text = text.replace(person, new_person)

    revised_data.append({'title': title, 'text': text})


random.shuffle(revised_data)

with open('newPhilosophies.json', 'w') as f:
    json.dump(revised_data, f)
