wordTokenizer = new natural.WordTokenizer()
guessTags = (content, path, globalTags) ->
  content += " " + path
  englishWords = wordTokenizer.tokenize(content).map (word) ->
    word = word.toLowerCase()
    natural.PorterStemmer.stem word
  globalTags.filter (tag) ->
    if (new RegExp("[A-Za-z]")).test(tag)
      # for english words
      tag = tag.toLowerCase()
      tagStem = natural.PorterStemmer.stem tag
      englishWords.indexOf(tagStem) > -1
    else
      (content+path).indexOf(tag) > -1