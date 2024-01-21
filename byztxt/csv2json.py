import csv
import json
import re
import os

book_list = {
    "1CO": "1 Corinthians",
    "1JO": "1 John",
    "1PE": "1 Peter",
    "1TH": "1 Thessalonians",
    "1TI": "1 Timothy",
    "2CO": "2 Corinthians",
    "2JO": "2 John",
    "2PE": "2 Peter",
    "2TH": "2 Thessalonians",
    "2TI": "2 Timothy",
    "3JO": "3 John",
    "ACT": "Acts",
    "COL": "Colossians",
    "EPH": "Ephesians",
    "GAL": "Galatians",
    "HEB": "Hebrews",
    "JAM": "James",
    "JOH": "John",
    "JUD": "Jude",
    "LUK": "Luke",
    "MAR": "Mark",
    "MAT": "Matthew",
    "PHM": "Philemon",
    "PHP": "Philippians",
    "REV": "Revelations",
    "ROM": "Romans",
    "TIT": "Titus",
}

# Define the path to the folders containing the files
acc_folder_path = "accented"
unacc_folder_path = "unaccented"
merged_folder_path = "merged"
comprehensive_output_file = os.path.join(merged_folder_path, "ByzantineText.json")

# Loop through the accented files
for acc_book in book_list.keys():
    acc_file_path = os.path.join(acc_folder_path, acc_book + ".csv")
    acc_file_path_json = os.path.join(acc_folder_path, acc_book + ".json")

    # Read the file
    with open(acc_file_path, "r", encoding="utf-8") as acc_file:
        data = {}
        csvReader = csv.DictReader(acc_file)

        for rows in csvReader:
            # Split the text field into words
            words = re.findall(r'\b\w+[,.·;:]|\b\w+\b', rows['text'])

            # Assuming a column named 'chapter' and 'verse' to be the primary key
            key = rows['chapter'] + '-' + rows['verse']
            data[key] = {'words': words}

    with open(acc_file_path_json, 'w', encoding='utf-8') as acc_jsonf:
        acc_jsonf.write(json.dumps(data, ensure_ascii=False, indent=2))

# Loop through the unaccented files
for unacc_book in book_list.keys():
    unacc_file_path = os.path.join(unacc_folder_path, unacc_book + ".csv")
    unacc_file_path_json = os.path.join(unacc_folder_path, unacc_book + ".json")

    # Read the file
    with open(unacc_file_path, "r", encoding="utf-8") as unacc_file:
        data = {}
        csvReader = csv.DictReader(unacc_file)

        for rows in csvReader:
            # Split the text field into words, numbers, and codes
            words = rows['text'].split()
            words = [word for word in words if word.isalpha()]
            numbers = rows['text'].split()
            numbers = [number for number in numbers if number.isdigit()]
            codes = rows['text'].split()
            codes = [code for code in codes if code.startswith('{') and code.endswith('}')]

            # Assuming a column named 'chapter' and 'verse' to be the primary key
            key = rows['chapter'] + '-' + rows['verse']
            data[key] = {'words': words, 'numbers': numbers, 'codes': codes}

            if len(words) != len(numbers) != len(codes):
                print("%s[%s]: Number of words != Number of Strongs != Number of codes" % (unacc_file_path, key))

    with open(unacc_file_path_json, 'w', encoding='utf-8') as unacc_jsonf:
        unacc_jsonf.write(json.dumps(data, ensure_ascii=False, indent=2))

# Merge the JSON files
all_data = {}
for book in book_list.keys():
    ufile_path = os.path.join(unacc_folder_path, book + ".json")
    afile_path = os.path.join(acc_folder_path, book + ".json")
    mfile_path = os.path.join(merged_folder_path, book + ".json")

    with open(ufile_path, 'r', encoding='utf-8') as f1:
        data1 = json.load(f1)

    with open(afile_path, 'r', encoding='utf-8') as f2:
        data2 = json.load(f2)

    # Merge the dictionaries
    for key in data1:
        if key in data2:
            standardized_name = book_list[book]
            data1[key].update(data2[key])
            all_data[standardized_name] = data1
            if len(data1[key]["words"]) != len(data2[key]["words"]):
                print("With key %s, %s and %s have a different number of words" % (key, ufile_path, afile_path))
        else:
            print("Key %s is in %s but not in %s" % (key, ufile_path, afile_path))

    # Write the merged dictionary to a new JSON file
    with open(mfile_path, 'w', encoding='utf-8') as f_out:
        json.dump(data1, f_out, ensure_ascii=False, indent=2)

with open(comprehensive_output_file, 'w', encoding='utf-8') as f_out:
    json.dump(all_data, f_out, ensure_ascii=False, indent=2)
