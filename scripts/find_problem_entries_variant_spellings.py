import json
import re

# Input and output file paths
input_file = "../parse-lexicon/AbbotSmithData.js"
output_file = "output/variant_spellings.json"

# Pattern to match in entries
entry_pattern = "orth>,  v.s."

# Function to extract JSON from JS file
def extract_json(file_content):
    match = re.search(r'const AbbotSmithData = (\{.*\});', file_content, re.DOTALL)
    if match:
        return match.group(1)
    return None

# Read the input file
with open(input_file, "r", encoding="utf-8") as f:
    file_content = f.read()

# Extract JSON from file content
json_str = extract_json(file_content)

if json_str:
    data = json.loads(json_str)

    matching_entries = []
    matching_entries_no_strongs = []

    # Iterate through entries and check for the pattern
    for entry in data["entries"]:
        if entry_pattern in entry.get("innerHTML", ""):
            if entry.get("strongs") == []:
                matching_entries.append(entry)
                print(entry['word'])

    # Write empty entries to the output file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"entries": matching_entries}, f, ensure_ascii=False, indent=2)

    print(f"Processed {len(data['entries'])} entries.")
    print(f"Found {len(matching_entries)} empty entries.")
else:
    print("Could not extract JSON data from the file.")