import json, random, re
import spacy 
# from gensim.test.utils import common_texts, get_tmpfile
# from gensim.models import Word2Vec

data = []
nlp = spacy.load('en_core_web_lg')
# path = get_tmpfile("word2vec.model")
# model = Word2Vec(common_texts, size=100, window=5, min_count=1, workers=4)

with open('newPhilosophies.json') as f:
    data = json.load(f)

for entry in data:
    title = entry['title']
    text = entry['text']
    doc = nlp(text)

    # for token in doc:
    #     if token.pos_ == 'NOUN': 
    #         print(token.text)
    #         try:
    #             print(model.most_similar(positive=[token.text]))
    #         except KeyError as e:
    #             print("not found")
    #             # something goes here

    people = []

    for ent in doc.ents:
        if ent.label_ == 'PERSON' or ent.label_ == 'PER' or ent.label_ == 'GPE' or ent.label_ == 'LOC':
            people.append(ent.text)

    revised_people = []

    for person in people:

        if not bool(re.search(r'\d', person)):

            split_name = person.split(' ')
            name = ''

            for part in split_name:
                firstpart, secondpart = part[:len(part)//2], part[len(part)//2:]
                name = name + (secondpart + firstpart).title() + ' '

            name = name.strip()
            revised_people.append((person, name))

    for person, new_person in revised_people:
        text = text.replace(person, new_person)

    print(text)
