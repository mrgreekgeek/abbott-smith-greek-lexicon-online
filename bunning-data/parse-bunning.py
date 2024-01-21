#!/usr/bin/python3

import csv
import json

books = [None, "Genesis", "Exodus" , "Leviticus" , "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians","Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"]

with open("SR.tsv") as tsv:
    r = csv.reader(tsv, delimiter = '\t')

    data = {"missing": {}}
    last_verse = 0

    for book in books:
        if book != None:
            data[book] = [[]]
    
    for row in r:
        try:
            ref = row[0]
            book = int(ref[:2])
            chapter = int(ref[2:5])
            verse_num = int(ref[6:])
            book = books[book]
            word = row[1]
            strong = int(row[4])//10 #assume all are strong's numbers

            if len(data[book]) <= (chapter):
                data[book].append([[]])
                last_verse = 0
            if len(data[book][chapter]) < (verse_num+1):
                for i in range(verse_num - last_verse):
                    data[book][chapter].append([])
                    if last_verse + 1 + i != verse_num:
                        missing = "%s %s:%s" % (book, chapter, last_verse + 1 + i)
                        data["missing"][missing] = True

            data[book][chapter][verse_num].append([word, strong])
            last_verse = verse_num

        except Exception as e:
            print("Skipped row %s because of %s" % (row, e))

    with open("NewTestament.json", "w") as json_file:
        json_file.write(json.dumps(data, sort_keys=True, indent=2))
