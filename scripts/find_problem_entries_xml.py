from lxml import etree

def parse_xml_without_strongs(output_file="output/lemmas_without_strongs.txt"):
    # Parse the XML file
    tree = etree.parse("../parse-lexicon/lexicon.xml")
    
    # Find all entry elements without strong attribute
    entries = tree.xpath('//entry[not(@strong)]')
    
    # Extract lemma attribute from each entry
    lemmas = [entry.get('lemma') for entry in entries if entry.get('lemma')]
    
    # Save lemmas to a file
    with open(output_file, 'w', encoding='utf-8') as f:
        for lemma in lemmas:
            f.write(lemma + '\n')
    
    print(f"Lemmas saved to {output_file}")
    return lemmas

# Call the function
lemmas = parse_xml_without_strongs()