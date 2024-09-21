import json
import re

# Input and output file paths
input_file = "../parse-lexicon/AbbotSmithData.js"
output_file = "../parse-lexicon/empty_entries.json"
output_file2 = "../parse-lexicon/entries_no_strongs.json"

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
    # Parse the JSON
    data = json.loads(json_str)

    # List to store matching entries
    matching_entries = []
    matching_entries_no_strongs = []

    # Iterate through entries and check for the pattern
    for entry in data["entries"]:
        if entry_pattern in entry.get("innerHTML", ""):
            matching_entries.append(entry)

        if entry.get("strongs") == []:
            matching_entries_no_strongs.append(entry)

    # Write empty entries to the output file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"entries": matching_entries}, f, ensure_ascii=False, indent=2)

    # Write no_strongs entries to the output file
    with open(output_file2, "w", encoding="utf-8") as f:
        json.dump({"entries": matching_entries_no_strongs}, f, ensure_ascii=False, indent=2)

    print(f"Processed {len(data['entries'])} entries.")
    print(f"Found {len(matching_entries)} empty entries.")
    print(f"Found {len(matching_entries_no_strongs)} with no Strongs number.")
    print(f"Results saved to {output_file} and {output_file2}")
else:
    print("Could not extract JSON data from the file.")