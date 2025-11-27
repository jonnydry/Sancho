import { PoetryItem } from '../types';

export const poeticDevicesData: PoetryItem[] = [
  {
    name: 'Metaphor',
    type: 'Device',
    description: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable, without using "like" or "as".',
    structure: [
      'Direct comparison of two unlike things',
      'States one thing IS another',
      'Creates a powerful image or connection'
    ],
    exampleSnippet: 'All the world\'s a stage, / And all the men and women merely players;',
    tags: ['figurative language', 'comparison'],
    seeAlso: ['Simile', 'Extended Metaphor', 'Conceit', 'Symbolism'],
    notes: ['Metaphors create deeper meaning than similes by asserting identity rather than similarity. They can be simple (one comparison) or extended (developed throughout a work).']
  },
  {
    name: 'Simile',
    type: 'Device',
    description: 'A figure of speech involving the comparison of one thing with another thing of a different kind, used to make a description more emphatic or vivid.',
    structure: [
      'Comparison using "like" or "as"',
      'Connects two different concepts',
      'Often used for descriptive effect'
    ],
    exampleSnippet: 'O, my luve is like a red, red rose, / That\'s newly sprung in June;',
    tags: ['figurative language', 'comparison']
  },
  {
    name: 'Alliteration',
    type: 'Device',
    description: 'The occurrence of the same letter or sound at the beginning of adjacent or closely connected words.',
    structure: [
      'Repetition of initial consonant sounds',
      'Creates musicality and rhythm',
      'Can emphasize certain words'
    ],
    exampleSnippet: 'From forth the fatal loins of these two foes; / A pair of star-cross\'d lovers take their life.',
    tags: ['sound device', 'repetition'],
    seeAlso: ['Assonance', 'Consonance', 'Onomatopoeia', 'Euphony'],
    notes: ['Alliteration creates rhythm and can make phrases memorable. Overuse can sound sing-songy. It\'s most effective when it enhances meaning rather than just decoration.']
  },
  {
    name: 'Personification',
    type: 'Device',
    description: 'The attribution of a personal nature or human characteristics to something nonhuman, or the representation of an abstract quality in human form.',
    structure: [
      'Gives human qualities to inanimate objects or abstract ideas',
      'Brings concepts to life',
      'Creates vivid imagery'
    ],
    exampleSnippet: 'Because I could not stop for Death – / He kindly stopped for me –',
    tags: ['figurative language', 'imagery'],
    seeAlso: ['Pathetic Fallacy', 'Transferred Epithet', 'Apostrophe', 'Allegory'],
    notes: ['Personification is broader than pathetic fallacy (which specifically attributes human emotions to nature). Dickinson\'s personification of Death as a gentleman is a famous example.']
  },
  {
    name: 'Assonance',
    type: 'Device',
    description: 'The repetition of the sound of a vowel in non-rhyming stressed syllables near enough to each other for the echo to be discernible.',
    structure: [
      'Repetition of vowel sounds within words',
      'Creates internal rhyming',
      'Enhances the mood and musical quality'
    ],
    exampleSnippet: 'The light of the fire is a sight. / Go and mow the lawn.',
    tags: ['sound device', 'repetition']
  },
  {
    name: 'Consonance',
    type: 'Device',
    description: 'The recurrence of similar-sounding consonants in close proximity, especially at the end of words.',
    structure: [
      'Repetition of consonant sounds within or at the end of words',
      'Creates a pleasing, harmonious sound',
      'Different from alliteration, which is at the start of words'
    ],
    exampleSnippet: 'The silken, sad, uncertain rustling of each purple curtain.',
    tags: ['sound device', 'repetition']
  },
  {
    name: 'Onomatopoeia',
    type: 'Device',
    description: 'The formation of a word from a sound associated with what is named.',
    structure: [
      'Words that imitate sounds',
      'Adds sensory detail to writing',
      'Examples: buzz, crash, sizzle'
    ],
    exampleSnippet: 'The buzz saw snarled and rattled in the yard.',
    tags: ['sound device', 'imagery']
  },
  {
    name: 'Enjambment',
    type: 'Device',
    description: 'The continuation of a sentence without a pause beyond the end of a line, couplet, or stanza.',
    structure: [
      'A line-break that occurs mid-clause',
      'Creates a sense of flow or urgency',
      'Contrasts with end-stopped lines'
    ],
    exampleSnippet: 'so much depends / upon / a red wheel / barrow / glazed with rain / water / beside the white / chickens.',
    tags: ['structural device', 'line break'],
    seeAlso: ['End-Stopped Line', 'Caesura', 'Caesura Variation'],
    notes: ['Enjambment creates forward momentum and can create surprise by delaying important words. Too much can make a poem feel rushed; too little can feel choppy.']
  },
  {
    name: 'Hyperbole',
    type: 'Device',
    description: 'Exaggerated statements or claims not meant to be taken literally, used for emphasis or effect.',
    structure: [
      'Intentional exaggeration for emphasis',
      'Not meant to be taken literally',
      'Creates a strong emotional response'
    ],
    exampleSnippet: 'And I will love thee still, my dear, / Till a\' the seas gang dry.',
    tags: ['figurative language', 'emphasis'],
    seeAlso: ['Understatement', 'Litotes', 'Bathos'],
    notes: ['Hyperbole is the opposite of understatement. Unintentional or overused hyperbole can lead to bathos (anticlimax).']
  },
  {
    name: 'Irony',
    type: 'Device',
    description: 'A figure of speech where the intended meaning is different from the actual meaning of the words, or a situation that ends contrary to what is expected.',
    structure: [
      'Contrast between appearance and reality',
      'Can be verbal, situational, or dramatic',
      'Often used for humorous or emphatic effect'
    ],
    exampleSnippet: 'Water, water, every where, / And all the boards did shrink; / Water, water, every where, / Nor any drop to drink.',
    tags: ['figurative language', 'tone']
  },
  {
    name: 'Oxymoron',
    type: 'Device',
    description: 'A figure of speech in which apparently contradictory terms appear in conjunction.',
    structure: [
      'Two opposite ideas are joined together',
      'Creates a paradoxical effect',
      'Examples: "living dead", "deafening silence"'
    ],
    exampleSnippet: 'O brawling love! O loving hate! / O anything, of nothing first create!',
    tags: ['figurative language', 'contrast']
  },
  {
    name: 'Apostrophe',
    type: 'Device',
    description: 'A figure of speech in which a speaker directly addresses someone or something that is not present or cannot respond in reality.',
    structure: [
      'Directly addressing an absent person or abstract concept',
      'Often begins with "O," or "Oh,"',
      'Creates a dramatic and emotional tone'
    ],
    exampleSnippet: 'Twinkle, twinkle, little star, / How I wonder what you are.',
    tags: ['figurative language', 'dramatic']
  },
  {
    name: 'Synecdoche',
    type: 'Device',
    description: 'A figure of speech in which a part is made to represent the whole or vice versa.',
    structure: [
      'A part stands for the whole (e.g., "wheels" for a car)',
      'The whole stands for a part (e.g., "the law" for police officers)',
      'Often used to create a more vivid image'
    ],
    exampleSnippet: 'Friends, Romans, countrymen, lend me your ears;',
    tags: ['figurative language', 'metonymy-related'],
    seeAlso: ['Metonymy', 'Metaphor', 'Symbolism'],
    notes: ['Synecdoche involves a part-whole relationship. Metonymy involves association (like "crown" for royalty). Both are types of substitution, but synecdoche is more specific.']
  },
  {
    name: 'Caesura',
    type: 'Device',
    description: 'A pause or break within a line of verse, often marked by punctuation. Can be medial (middle) or initial/terminal (beginning/end).',
    structure: [
      'A pause within a poetic line',
      'Often indicated by punctuation (comma, dash, period)',
      'Creates rhythm and emphasis',
      'Masculine caesura: after a stressed syllable; Feminine: after unstressed'
    ],
    exampleSnippet: 'To be, or not to be: || that is the question', // || marks the caesura
    tags: ['structural device', 'rhythm'],
    seeAlso: ['Enjambment', 'End-Stopped Line', 'Caesura Variation'],
    notes: ['Caesurae create natural pauses and can emphasize words on either side. They break up the rhythm and can create dramatic tension or reflection.']
  },
  {
    name: 'Anaphora',
    type: 'Device',
    description: 'The repetition of a word or phrase at the beginning of successive clauses, lines, or sentences for emphasis and rhythm.',
    structure: [
      'Repetition at the beginning of lines or clauses',
      'Creates emphasis and rhythm',
      'Builds emotional intensity',
      'Common in speeches and persuasive writing'
    ],
    exampleSnippet: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields...',
    tags: ['repetition', 'structural device'],
    seeAlso: ['Epistrophe', 'Repetition', 'Refrain', 'Anadiplosis'],
    notes: ['Anaphora creates powerful emphasis and builds momentum. It\'s the opposite of epistrophe (repetition at the end). Both can be used together for even greater effect.']
  },
  {
    name: 'Imagery',
    type: 'Device',
    description: 'Vivid descriptive language that appeals to one or more of the five senses, creating mental pictures for the reader.',
    structure: [
      'Appeals to the five senses: sight, sound, smell, taste, touch',
      'Creates vivid mental pictures',
      'Makes abstract ideas concrete',
      'Essential element of poetic language'
    ],
    exampleSnippet: 'The fair breeze blew, the white foam flew, / The furrow followed free',
    tags: ['descriptive', 'sensory']
  },
  {
    name: 'Symbolism',
    type: 'Device',
    description: 'The use of symbols to represent ideas or qualities, where an object, person, or action stands for something beyond its literal meaning.',
    structure: [
      'Objects or actions represent abstract ideas',
      'Can be universal (dove = peace) or contextual',
      'Adds depth and layers of meaning',
      'Encourages interpretation'
    ],
    exampleSnippet: 'Two roads diverged in a yellow wood...', // Roads symbolize life choices
    tags: ['figurative language', 'imagery']
  },
  {
    name: 'Allusion',
    type: 'Device',
    description: 'A brief, indirect reference to a person, place, event, or work of literature or art, meant to enrich the meaning through association.',
    structure: [
      'Indirect reference to historical, literary, or cultural material',
      'Assumes reader\'s familiarity with the reference',
      'Adds depth and layers of meaning',
      'Can be biblical, mythological, literary, or historical'
    ],
    exampleSnippet: 'No! I am not Prince Hamlet, nor was meant to be', // Allusion to Shakespeare
    tags: ['figurative language', 'intertextual']
  },
  {
    name: 'Metonymy',
    type: 'Device',
    description: 'A figure of speech in which one thing is called by the name of something closely associated with it.',
    structure: [
      'Substitution of an associated term',
      'Different from synecdoche (part-whole relationship)',
      'Examples: "the crown" for royalty, "the White House" for U.S. presidency',
      'Creates concise, vivid expression'
    ],
    exampleSnippet: 'The pen is mightier than the sword', // Pen = writing; sword = military force
    tags: ['figurative language', 'metonymy-related'],
    seeAlso: ['Synecdoche', 'Metaphor', 'Symbolism'],
    notes: ['Metonymy uses association (crown = royalty), while synecdoche uses part-whole relationships (wheels = car). Both create concise, vivid expression through substitution.']
  },
  {
    name: 'Paradox',
    type: 'Device',
    description: 'A statement that appears self-contradictory but upon reflection reveals a deeper truth or insight.',
    structure: [
      'Seemingly contradictory statement',
      'Reveals truth upon examination',
      'Different from oxymoron (paradox is a statement, oxymoron is two words)',
      'Challenges conventional thinking'
    ],
    exampleSnippet: 'I must be cruel only to be kind', // Hamlet
    tags: ['figurative language', 'contrast']
  },
  {
    name: 'Refrain',
    type: 'Device',
    description: 'A line or group of lines repeated at intervals throughout a poem, usually at the end of each stanza.',
    structure: [
      'Repeated line(s) throughout the poem',
      'Often appears at end of stanzas',
      'Creates rhythm and emphasis',
      'Common in ballads, villanelles, and songs'
    ],
    exampleSnippet: 'And miles to go before I sleep, / And miles to go before I sleep.', // Frost
    tags: ['repetition', 'structural device']
  },
  {
    name: 'Internal Rhyme',
    type: 'Device',
    description: 'A rhyme that occurs within a single line of verse, rather than at the end of lines.',
    structure: [
      'Rhyme within a line of poetry',
      'Can occur mid-line or between middle and end',
      'Creates musicality and connection',
      'Adds complexity to sound patterns'
    ],
    exampleSnippet: 'Once upon a midnight dreary, while I pondered, weak and weary', // dreary/weary
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Perfect Rhyme', 'Slant Rhyme', 'Masculine Rhyme', 'Feminine Rhyme'],
    notes: ['Internal rhyme creates a richer sonic texture than end rhyme alone. Poe used it masterfully in \'The Raven\' to create an incantatory effect.']
  },
  {
    name: 'Slant Rhyme',
    type: 'Device',
    description: 'A rhyme in which the sounds are similar but not identical. Also called half rhyme, near rhyme, or imperfect rhyme.',
    structure: [
      'Similar but not exact rhyme',
      'Can involve consonance or assonance',
      'Examples: "soul/oil," "years/yours"',
      'Common in modern poetry',
      'Creates subtle, sophisticated sound patterns'
    ],
    exampleSnippet: 'I heard a Fly buzz - when I died - / The Stillness in the Room / Was like the Stillness in the Air - / Between the Heaves of Storm -', // Room/Storm
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Perfect Rhyme', 'Eye Rhyme', 'Consonance', 'Assonance'],
    notes: ['Emily Dickinson was a master of slant rhyme, using it to create subtle dissonance and surprise. It offers more rhyming options than perfect rhyme.']
  },
  {
    name: 'Cacophony',
    type: 'Device',
    description: 'Harsh, discordant sounds created by combinations of words with hard consonants, creating an unpleasant or jarring effect.',
    structure: [
      'Harsh, discordant sounds',
      'Uses hard consonants (k, t, g, d, p, b)',
      'Creates tension or unpleasantness',
      'Opposite of euphony',
      'Often matches harsh content'
    ],
    exampleSnippet: 'Blow, winds, and crack your cheeks! rage! blow!',
    tags: ['sound device', 'tone']
  },
  {
    name: 'Euphony',
    type: 'Device',
    description: 'Pleasant, harmonious sounds created by combinations of words, often using soft consonants and melodious vowels.',
    structure: [
      'Pleasant, harmonious sounds',
      'Uses soft consonants (l, m, n, r, f, v, w, y)',
      'Creates beauty and smoothness',
      'Opposite of cacophony',
      'Often matches pleasant content'
    ],
    exampleSnippet: 'Season of mists and mellow fruitfulness, / Close bosom-friend of the maturing sun',
    tags: ['sound device', 'tone']
  },
  {
    name: 'Juxtaposition',
    type: 'Device',
    description: 'The placement of two or more things side by side, often to compare or contrast or to create an interesting effect.',
    structure: [
      'Placing contrasting elements side by side',
      'Highlights differences or similarities',
      'Creates emphasis through contrast',
      'Can be ironic or illuminating'
    ],
    exampleSnippet: 'It was the best of times, it was the worst of times', // Dickens
    tags: ['structural device', 'contrast']
  },
  {
    name: 'Volta',
    type: 'Device',
    description: 'A turn of thought or argument in a poem, especially the point where a sonnet shifts from one idea to another.',
    structure: [
      'A turn or shift in the poem\'s argument or tone',
      'In Italian sonnets: between octave and sestet (line 9)',
      'In English sonnets: before the final couplet (line 13)',
      'Signals a change in perspective or conclusion'
    ],
    exampleSnippet: 'But thy eternal summer shall not fade...', // Shift in Shakespeare\'s Sonnet 18
    tags: ['structural device', 'sonnet']
  },
  {
    name: 'Chiasmus',
    type: 'Device',
    description: 'A rhetorical device in which two or more clauses are balanced against each other by reversing their grammatical structure.',
    structure: [
      'Reversal of grammatical structure (AB:BA)',
      'Creates balance and emphasis',
      'Memorable and quotable',
      'Common in speeches and epigrams'
    ],
    exampleSnippet: 'Ask not what your country can do for you—ask what you can do for your country', // Kennedy
    tags: ['structural device', 'rhetoric'],
    seeAlso: ['Antimetabole', 'Antithesis', 'Parallelism', 'Epanalepsis'],
    notes: ['Chiasmus reverses grammatical structure; antimetabole reverses the same words. JFK\'s famous line is technically antimetabole since it uses the same words.']
  },
  {
    name: 'Epistrophe',
    type: 'Device',
    description: 'The repetition of a word or phrase at the end of successive clauses, lines, or sentences.',
    structure: [
      'Repetition at the end of lines or clauses',
      'Opposite of anaphora',
      'Creates emphasis and rhythm',
      'Builds to a conclusion'
    ],
    exampleSnippet: 'When I was a child, I spoke as a child, I understood as a child, I thought as a child',
    tags: ['repetition', 'structural device']
  },
  {
    name: 'Repetition',
    type: 'Device',
    description: 'The use of the same word, phrase, or structure multiple times for emphasis, rhythm, or to create a particular effect.',
    structure: [
      'Repeating words, phrases, or structures',
      'Creates emphasis and rhythm',
      'Can build intensity or create patterns',
      'Includes anaphora, epistrophe, and refrain as specific types'
    ],
    exampleSnippet: 'Rage, rage against the dying of the light', // Thomas
    tags: ['repetition', 'emphasis']
  },
  {
    name: 'Pun',
    type: 'Device',
    description: 'A play on words that exploits multiple meanings of a term or similar-sounding words for humorous or rhetorical effect.',
    structure: [
      'Wordplay using multiple meanings',
      'Can use homonyms or homophones',
      'Often humorous or clever',
      'Can create double meanings'
    ],
    exampleSnippet: 'Ask for me tomorrow, and you shall find me a grave man', // Mercutio in Romeo & Juliet (grave = serious/tomb)
    tags: ['wordplay', 'humorous'],
    seeAlso: ['Paronomasia', 'Malapropism', 'Zeugma', 'Rich Rhyme'],
    notes: ['Shakespeare used puns extensively for both humor and thematic depth. Paronomasia is the rhetorical term for punning.']
  },
  {
    name: 'Allegory',
    type: 'Device',
    description: 'A narrative in which characters, events, and settings represent abstract ideas or moral qualities, creating a second level of meaning beneath the surface story.',
    structure: [
      'Characters and events symbolize abstract concepts',
      'Two levels of meaning: literal and symbolic',
      'Extended metaphor throughout the work',
      'Often used to teach moral or political lessons',
      'Examples: The Pilgrim\'s Progress, Animal Farm'
    ],
    exampleSnippet: 'All animals are equal, but some animals are more equal than others.', // Animal Farm allegory
    tags: ['figurative language', 'narrative']
  },
  {
    name: 'Litotes',
    type: 'Device',
    description: 'A figure of speech that uses understatement by negating the opposite, often for ironic or emphatic effect. A form of understatement.',
    structure: [
      'Expresses a positive by negating its opposite',
      'Creates understatement and emphasis',
      'Often used for modesty or irony',
      'Examples: "not bad" (meaning good), "not uncommon"',
      'Common in formal and academic writing'
    ],
    exampleSnippet: 'He was not unfamiliar with the works of Shakespeare.', // Meaning: he was very familiar
    tags: ['figurative language', 'rhetoric']
  },
  {
    name: 'Understatement',
    type: 'Device',
    description: 'A figure of speech that deliberately represents something as less than it is, often for humorous, ironic, or emphatic effect.',
    structure: [
      'Deliberately minimizes the importance or magnitude',
      'Creates irony or emphasis through restraint',
      'Opposite of hyperbole',
      'Can be humorous or serious',
      'Common in British humor and satire'
    ],
    exampleSnippet: 'It\'s just a flesh wound.', // When a limb has been cut off (Monty Python)
    tags: ['figurative language', 'tone']
  },
  {
    name: 'Rhetorical Question',
    type: 'Device',
    description: 'A question asked not to receive an answer but to make a point, create emphasis, or provoke thought. The answer is implied or obvious.',
    structure: [
      'Question that doesn\'t require an answer',
      'Used for emphasis or to make a point',
      'Answer is implied or obvious',
      'Common in speeches and persuasive writing',
      'Engages the reader or listener'
    ],
    exampleSnippet: 'Shall I compare thee to a summer\'s day? / Thou art more lovely and more temperate.',
    tags: ['rhetoric', 'emphasis']
  },
  {
    name: 'Synesthesia',
    type: 'Device',
    description: 'A figure of speech in which one sense is described using terms from another sense, blending sensory experiences.',
    structure: [
      'Mixing of different senses',
      'Describes one sense with another',
      'Creates vivid, unusual imagery',
      'Examples: "loud colors," "sweet sound," "cold silence"',
      'Common in Symbolist and Modernist poetry'
    ],
    exampleSnippet: 'The sound of colors, the taste of music, the feel of scents',
    tags: ['sensory', 'imagery']
  },
  {
    name: 'Polysyndeton',
    type: 'Device',
    description: 'The deliberate use of multiple conjunctions (especially "and") in close succession, creating a sense of accumulation and rhythm.',
    structure: [
      'Multiple conjunctions in succession',
      'Creates a sense of accumulation',
      'Slows the pace and adds emphasis',
      'Opposite of asyndeton',
      'Common in lists and descriptions'
    ],
    exampleSnippet: 'We have ships and men and money and stores.',
    tags: ['structural device', 'syntax'],
    seeAlso: ['Asyndeton', 'Hendiadys', 'Catalog', 'Anaphora'],
    notes: ['Polysyndeton slows the reader down and gives equal weight to each item. The Bible uses it extensively for rhythmic and emphatic effect.']
  },
  {
    name: 'Asyndeton',
    type: 'Device',
    description: 'The deliberate omission of conjunctions between words, phrases, or clauses, creating a faster pace and sense of urgency or accumulation.',
    structure: [
      'Omission of conjunctions (and, or, but)',
      'Creates a faster, more urgent pace',
      'Opposite of polysyndeton',
      'Common in lists and parallel structures',
      'Adds emphasis through brevity'
    ],
    exampleSnippet: 'I came, I saw, I conquered.', // Instead of "I came, and I saw, and I conquered"
    tags: ['structural device', 'syntax']
  },
  {
    name: 'Pathetic Fallacy',
    type: 'Device',
    description: 'The attribution of human emotions and characteristics to nature or inanimate objects, often reflecting the mood of the characters or narrator.',
    structure: [
      'Nature reflects human emotions',
      'Weather, landscape mirror feelings',
      'Common in Romantic poetry',
      'Different from personification (which is more general)',
      'Creates atmosphere and mood'
    ],
    exampleSnippet: 'The sullen wind was soon awake, / It tore the elm-tops down for spite',
    tags: ['figurative language', 'nature']
  },
  {
    name: 'Motif',
    type: 'Device',
    description: 'A recurring element—such as an image, symbol, word, phrase, or idea—that appears throughout a work and helps develop its themes.',
    structure: [
      'Recurring element throughout the work',
      'Can be an image, symbol, word, or idea',
      'Helps develop themes and create unity',
      'Different from symbol (motif is repeated, symbol may appear once)',
      'Creates patterns and connections'
    ],
    exampleSnippet: '[A recurring image like "darkness" or "water" appearing throughout a poem or collection]',
    tags: ['structural device', 'repetition']
  },
  {
    name: 'Conceit',
    type: 'Device',
    description: 'An extended metaphor that compares two very dissimilar things in a surprising or elaborate way, often throughout an entire poem.',
    structure: [
      'Extended, elaborate metaphor',
      'Compares very dissimilar things',
      'Often surprising or unconventional',
      'Developed throughout a poem or section',
      'Common in Metaphysical poetry'
    ],
    exampleSnippet: 'If they be two, they are two so / As stiff twin compasses are two; / Thy soul, the fixed foot, makes no show / To move, but doth, if the other do.',
    tags: ['figurative language', 'comparison'],
    seeAlso: ['Metaphysical Conceit', 'Extended Metaphor', 'Metaphor', 'Catachresis'],
    notes: ['The metaphysical conceit (Donne, Herbert) uses intellectual and scientific imagery. Petrarchan conceits use idealized love imagery (eyes like stars, lips like roses).']
  },
  {
    name: 'Catalog',
    type: 'Device',
    description: 'A list of people, things, or attributes, often used to create emphasis, build rhythm, or provide comprehensive description.',
    structure: [
      'A list or enumeration of items',
      'Creates emphasis through accumulation',
      'Builds rhythm and momentum',
      'Can be used for description or emphasis',
      'Common in epic poetry and free verse'
    ],
    exampleSnippet: 'I am the poet of the Body and I am the poet of the Soul, / The pleasures of heaven are with me and the pains of hell are with me',
    tags: ['structural device', 'list']
  },
  {
    name: 'Extended Metaphor',
    type: 'Device',
    description: 'A metaphor that is developed over several lines or throughout an entire poem, creating a sustained comparison.',
    structure: [
      'Metaphor developed over multiple lines',
      'Sustained comparison throughout',
      'More elaborate than a simple metaphor',
      'Creates deeper meaning and imagery',
      'Common in longer poems'
    ],
    exampleSnippet: 'Hope is the thing with feathers / That perches in the soul, / And sings the tune without the words, / And never stops at all',
    tags: ['figurative language', 'comparison']
  },
  {
    name: 'Zeugma',
    type: 'Device',
    description: 'A figure of speech in which a word (usually a verb or adjective) applies to two or more nouns in different senses, often creating a surprising or humorous effect.',
    structure: [
      'One word applies to multiple nouns',
      'Word has different meanings for each noun',
      'Creates surprise or humor',
      'Common in witty or clever writing',
      'Examples: "She broke his car and his heart"'
    ],
    exampleSnippet: 'She opened her door and her heart to the homeless boy.',
    tags: ['wordplay', 'syntax']
  },
  {
    name: 'Antithesis',
    type: 'Device',
    description: 'A figure of speech in which contrasting ideas are placed in parallel grammatical structures, creating a balanced opposition.',
    structure: [
      'Contrasting ideas in parallel structure',
      'Creates balance and emphasis',
      'Highlights the contrast',
      'Common in speeches and persuasive writing',
      'Memorable and quotable'
    ],
    exampleSnippet: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness',
    tags: ['structural device', 'contrast']
  },
  {
    name: 'Epanalepsis',
    type: 'Device',
    description: 'A figure of speech in which the beginning of a clause or sentence is repeated at the end of that same clause or sentence.',
    structure: [
      'Repetition of word(s) at beginning and end',
      'Creates emphasis and circularity',
      'Can create a sense of completion',
      'Common in speeches and poetry',
      'Examples: "The king is dead, long live the king"'
    ],
    exampleSnippet: 'Blood hath bought blood, and blows have answered blows',
    tags: ['repetition', 'structural device']
  },
  {
    name: 'Anadiplosis',
    type: 'Device',
    description: 'A figure of speech in which the last word of one clause or sentence is repeated at the beginning of the next, creating a linking effect.',
    structure: [
      'Last word of one phrase repeated at start of next',
      'Creates linking and progression',
      'Builds momentum and emphasis',
      'Common in speeches and poetry',
      'Creates a chain-like effect'
    ],
    exampleSnippet: 'Fear leads to anger. Anger leads to hate. Hate leads to suffering.',
    tags: ['repetition', 'structural device']
  },
  {
    name: 'Epanorthosis',
    type: 'Device',
    description: 'A figure of speech in which a speaker corrects or qualifies a previous statement, often for emphasis or clarification.',
    structure: [
      'Correction or qualification of previous statement',
      'Creates emphasis through self-correction',
      'Shows thought process or uncertainty',
      'Common in dramatic monologues',
      'Adds realism and nuance'
    ],
    exampleSnippet: 'I saw him—no, I thought I saw him—in the crowd.',
    tags: ['rhetoric', 'dramatic']
  },
  {
    name: 'Metaphysical Conceit',
    type: 'Device',
    description: 'A type of conceit characteristic of Metaphysical poetry, featuring elaborate, intellectual comparisons between seemingly dissimilar things.',
    origin: 'Developed by 17th-century Metaphysical poets like John Donne, Andrew Marvell, and George Herbert.',
    structure: [
      'Elaborate, intellectual comparison',
      'Compares very dissimilar things',
      'Often uses scientific or philosophical concepts',
      'Surprising and unconventional',
      'Requires intellectual engagement'
    ],
    exampleSnippet: 'Our two souls therefore, which are one, / Though I must go, endure not yet / A breach, but an expansion, / Like gold to airy thinness beat.',
    tags: ['figurative language', 'comparison']
  },
  {
    name: 'Tone',
    type: 'Device',
    description: 'The attitude or emotional stance of the speaker or narrator toward the subject matter, conveyed through word choice, imagery, and style.',
    structure: [
      'Author\'s attitude toward subject',
      'Conveyed through diction, imagery, syntax',
      'Can be formal, informal, serious, humorous, etc.',
      'Different from mood (which is the reader\'s feeling)',
      'Essential element of poetic voice'
    ],
    exampleSnippet: '[The overall emotional quality of a poem, such as melancholic, joyful, ironic, or contemplative]',
    tags: ['voice', 'fundamental']
  },
  {
    name: 'Voice',
    type: 'Device',
    description: 'The distinctive style or personality of the speaker in a poem, created through word choice, syntax, tone, and point of view.',
    structure: [
      'Distinctive style of the speaker',
      'Created through diction, syntax, tone',
      'Can be the poet\'s voice or a persona',
      'Gives the poem its unique character',
      'Essential for establishing point of view'
    ],
    exampleSnippet: '[The unique way a poem "sounds" - formal, conversational, dramatic, etc.]',
    tags: ['voice', 'fundamental']
  },
  {
    name: 'In Medias Res',
    type: 'Device',
    description: 'A narrative technique in which a story begins in the middle of the action, rather than at the beginning, creating immediacy and intrigue.',
    origin: 'From Latin "in the middle of things." A technique used in classical epics like The Iliad and The Odyssey.',
    structure: [
      'Story begins in the middle of action',
      'Background information provided later',
      'Creates immediacy and engagement',
      'Common in epic poetry and modern narratives',
      'Requires flashback or exposition later'
    ],
    exampleSnippet: '[A poem that begins with action already in progress, then fills in context]',
    tags: ['narrative', 'structural device']
  },
  {
    name: 'End-Stopped Line',
    type: 'Device',
    description: 'A line of poetry that ends with a punctuation mark, creating a pause and completing a thought. The opposite of enjambment.',
    structure: [
      'Line ends with punctuation',
      'Creates a pause and completion',
      'Opposite of enjambment',
      'Common in formal poetry',
      'Creates a more measured, controlled rhythm'
    ],
    exampleSnippet: 'Shall I compare thee to a summer\'s day? / Thou art more lovely and more temperate.',
    tags: ['structural device', 'line break']
  },
  {
    name: 'Caesura Variation',
    type: 'Device',
    description: 'The strategic variation of pauses within lines of verse, creating rhythm, emphasis, and emotional effect beyond the basic metrical pattern.',
    structure: [
      'Variation of pauses within lines',
      'Creates rhythm and emphasis',
      'Can be marked by punctuation or natural speech pauses',
      'Adds complexity to meter',
      'Common in dramatic and narrative poetry'
    ],
    exampleSnippet: 'To be, || or not to be: || that is the question', // || marks caesurae
    tags: ['structural device', 'rhythm']
  },
  {
    name: 'Perfect Rhyme',
    type: 'Device',
    description: 'A rhyme in which the stressed vowel sounds and all subsequent sounds are identical in both words. Also called true rhyme, full rhyme, or exact rhyme.',
    structure: [
      'Identical vowel sounds in stressed syllables',
      'Identical consonant sounds following the vowel',
      'Different consonant sounds preceding the vowel',
      'Examples: cat/hat, love/dove, moon/June',
      'The most common and expected type of rhyme'
    ],
    exampleSnippet: 'Shall I compare thee to a summer\'s day? / Thou art more lovely and more temperate.',
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Slant Rhyme', 'Eye Rhyme', 'Internal Rhyme', 'Rich Rhyme'],
    notes: ['Perfect rhyme creates strong musical connections and closure. Overuse can feel predictable; variation with slant rhyme adds sophistication.']
  },
  {
    name: 'Eye Rhyme',
    type: 'Device',
    description: 'Words that appear to rhyme based on their spelling but do not actually rhyme when spoken. Also called sight rhyme or visual rhyme.',
    structure: [
      'Similar spelling but different pronunciation',
      'Creates visual but not auditory connection',
      'Examples: love/move, cough/through, good/food',
      'Some were true rhymes historically',
      'Common in older poetry due to pronunciation changes'
    ],
    exampleSnippet: 'I have sought it with thimbles—I have sought it with care; / I have hunted it fairly—I have followed it there.',
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Perfect Rhyme', 'Slant Rhyme'],
    notes: ['Many eye rhymes were perfect rhymes in earlier English. They can create subtle effects when the visual similarity contrasts with the sound difference.']
  },
  {
    name: 'Rich Rhyme',
    type: 'Device',
    description: 'A rhyme in which two words sound identical but have different meanings. Also called identical rhyme or rime riche.',
    structure: [
      'Words sound exactly the same',
      'Different meanings (homonyms)',
      'Examples: bear/bare, right/write, sea/see',
      'Common in French poetry',
      'Can create wordplay and double meanings'
    ],
    exampleSnippet: 'Fare thee well, and if for ever, / Still for ever, fare thee well.',
    tags: ['sound device', 'rhyme', 'wordplay'],
    seeAlso: ['Perfect Rhyme', 'Pun'],
    notes: ['Rich rhyme is considered a sophisticated technique in French poetry but was sometimes avoided in English as too easy. It can create meaningful wordplay.']
  },
  {
    name: 'Masculine Rhyme',
    type: 'Device',
    description: 'A rhyme that occurs on a single stressed syllable at the end of a line. The most common type of rhyme in English poetry.',
    structure: [
      'Rhyme on final stressed syllable',
      'Single syllable rhymes (cat/hat)',
      'Or multisyllable with final stress (defy/deny)',
      'Creates strong, emphatic endings',
      'Opposite of feminine rhyme'
    ],
    exampleSnippet: 'The Curfew tolls the knell of parting day, / The lowing herd wind slowly o\'er the lea.',
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Feminine Rhyme', 'Perfect Rhyme', 'Triple Rhyme'],
    notes: ['The terms masculine and feminine rhyme refer to the stress pattern, not gender. Masculine rhyme creates a sense of finality and strength.']
  },
  {
    name: 'Feminine Rhyme',
    type: 'Device',
    description: 'A rhyme that occurs on two syllables, with the stress on the first syllable followed by an unstressed syllable. Also called double rhyme.',
    structure: [
      'Rhyme on two syllables',
      'Stressed syllable followed by unstressed',
      'Examples: treasure/measure, burning/turning',
      'Creates a softer, more flowing effect',
      'Opposite of masculine rhyme'
    ],
    exampleSnippet: 'Tell me not in mournful numbers, / Life is but an empty dream! / For the soul is dead that slumbers, / And things are not what they seem.',
    tags: ['sound device', 'rhyme'],
    seeAlso: ['Masculine Rhyme', 'Triple Rhyme'],
    notes: ['Feminine rhyme adds variety and can create a lighter or more playful tone. It\'s common in comic verse and songs.']
  },
  {
    name: 'Triple Rhyme',
    type: 'Device',
    description: 'A rhyme that extends over three syllables, with stress on the first of the three syllables. Relatively rare and often humorous.',
    structure: [
      'Rhyme on three syllables',
      'Stress on first of the three',
      'Examples: glittering/frittering, meticulous/ridiculous',
      'Often used for comic effect',
      'Rare in serious poetry'
    ],
    exampleSnippet: 'While I nodded, nearly napping, suddenly there came a tapping, / As of some one gently rapping, rapping at my chamber door.',
    tags: ['sound device', 'rhyme', 'humorous'],
    seeAlso: ['Masculine Rhyme', 'Feminine Rhyme'],
    notes: ['Triple rhyme is difficult to achieve without seeming forced. It\'s most effective in humorous or playful poetry. Byron used it skillfully in Don Juan.']
  },
  {
    name: 'Sibilance',
    type: 'Device',
    description: 'The repetition of \'s\' or soft consonant sounds (s, sh, z, x, soft c) to create a hissing or hushing effect.',
    structure: [
      'Repetition of s, sh, z, x, or soft c sounds',
      'Creates a hissing or whispering effect',
      'Often associated with snakes, wind, or secrets',
      'Can suggest sinister or soothing qualities',
      'A specific type of consonance'
    ],
    exampleSnippet: 'And the silken, sad, uncertain rustling of each purple curtain / Thrilled me—filled me with fantastic terrors never felt before.',
    tags: ['sound device', 'consonance'],
    seeAlso: ['Alliteration', 'Consonance', 'Onomatopoeia'],
    notes: ['Sibilance can create various effects depending on context: sinister (serpents), peaceful (sleep), or secretive (whispers). Poe used it masterfully.']
  },
  {
    name: 'Paronomasia',
    type: 'Device',
    description: 'A form of wordplay that exploits words with similar sounds or the same word with different meanings. A more formal term for punning.',
    structure: [
      'Play on words with similar sounds',
      'Or same word with multiple meanings',
      'Creates humor or double meaning',
      'Can be subtle or obvious',
      'Related to but distinct from simple puns'
    ],
    exampleSnippet: 'Ask for me tomorrow, and you shall find me a grave man.',
    tags: ['wordplay', 'rhetoric'],
    seeAlso: ['Pun', 'Zeugma'],
    notes: ['Paronomasia is the rhetorical term for punning. It can range from groan-worthy to sophisticated wordplay. Shakespeare was a master of the technique.']
  },
  {
    name: 'Ellipsis',
    type: 'Device',
    description: 'The deliberate omission of words that are grammatically necessary but can be understood from context, creating compression and emphasis.',
    structure: [
      'Omission of implied words',
      'Reader supplies missing elements',
      'Creates compression and speed',
      'Adds emphasis through absence',
      'Different from typographical ellipsis (...)'
    ],
    exampleSnippet: 'Some say the world will end in fire, / Some [say the world will end] in ice.',
    tags: ['structural device', 'syntax'],
    seeAlso: ['Asyndeton', 'Zeugma'],
    notes: ['Ellipsis creates a sense of urgency and sophistication. The reader becomes an active participant by filling in the gaps. It\'s common in conversational and dramatic poetry.']
  },
  {
    name: 'Tmesis',
    type: 'Device',
    description: 'The separation of a compound word or phrase by inserting another word or words between its parts.',
    structure: [
      'Splitting a word or phrase',
      'Inserting words in the middle',
      'Often for emphasis or humor',
      'Examples: abso-bloody-lutely, any-old-where',
      'Creates surprise and emphasis'
    ],
    exampleSnippet: 'This is not Romeo, he\'s some other where.',
    tags: ['wordplay', 'syntax'],
    seeAlso: ['Hyperbaton', 'Anacoluthon'],
    notes: ['Tmesis is often used in colloquial speech for emphasis (fan-bloody-tastic). In poetry, it can create surprise or humor. The word comes from Greek for \'cutting.\'']
  },
  {
    name: 'Hendiadys',
    type: 'Device',
    description: 'The expression of a single complex idea using two words connected by \'and\' instead of a noun modified by an adjective or adverb.',
    structure: [
      'Two words joined by \'and\'',
      'Express a single idea',
      'Instead of adjective + noun',
      'Examples: \'nice and warm\' (nicely warm)',
      'Creates emphasis and rhythm'
    ],
    exampleSnippet: 'The slings and arrows of outrageous fortune.',
    tags: ['rhetoric', 'syntax'],
    seeAlso: ['Polysyndeton', 'Pleonasm'],
    notes: ['Hendiadys is common in everyday speech (\'good and ready\') and in Shakespeare. It adds emphasis and creates a more balanced, rhythmic phrase.']
  },
  {
    name: 'Anacoluthon',
    type: 'Device',
    description: 'A sudden break in grammatical construction within a sentence, often used to show strong emotion, interrupted thought, or natural speech patterns.',
    structure: [
      'Sentence begins with one construction',
      'Shifts to a different construction mid-sentence',
      'Creates a grammatical break',
      'Often shows emotion or confusion',
      'Mimics natural speech patterns'
    ],
    exampleSnippet: 'If you fail—but you won\'t fail—the consequences would be dire.',
    tags: ['syntax', 'dramatic'],
    seeAlso: ['Ellipsis', 'Epanorthosis'],
    notes: ['Anacoluthon can seem like an error but is often deliberately used to show a character\'s thought process, emotion, or to mimic realistic speech.']
  },
  {
    name: 'Hyperbaton',
    type: 'Device',
    description: 'The deliberate rearrangement of normal word order for emphasis, rhythm, or poetic effect.',
    structure: [
      'Unusual or inverted word order',
      'Words placed out of expected sequence',
      'Often for emphasis or meter',
      'Common in Latin and Greek poetry',
      'Examples: \'Bright the stars shine\' instead of \'The stars shine bright\''
    ],
    exampleSnippet: 'Deep into that darkness peering, long I stood there wondering, fearing.',
    tags: ['syntax', 'structural device'],
    seeAlso: ['Anastrophe', 'Chiasmus'],
    notes: ['Hyperbaton allows poets to place emphasis on particular words, meet metrical requirements, or create a more formal or archaic tone. Overuse can seem unnatural.']
  },
  {
    name: 'Hysteron Proteron',
    type: 'Device',
    description: 'A figure of speech in which the logical or chronological order of words or events is reversed, placing what should come later first.',
    structure: [
      'Reversal of logical or temporal order',
      'Later event mentioned before earlier',
      'Examples: \'put on your shoes and socks\'',
      'Can create emphasis or urgency',
      'Sometimes used for dramatic effect'
    ],
    exampleSnippet: 'Let us die and charge into the thick of the fight.',
    tags: ['rhetoric', 'syntax'],
    seeAlso: ['Chiasmus', 'Hyperbaton'],
    notes: ['Hysteron proteron can emphasize the more important element by placing it first, even if it happens later. Virgil\'s \'let us die and charge\' prioritizes the heroic death.']
  },
  {
    name: 'Bathos',
    type: 'Device',
    description: 'An anticlimax created by an unintentional or intentional descent from the elevated to the commonplace or ridiculous, often for comic effect.',
    structure: [
      'Sudden shift from serious to trivial',
      'Can be intentional (for humor) or accidental',
      'Creates anticlimax',
      'Often juxtaposes grand and mundane',
      'Different from pathos (emotional appeal)'
    ],
    exampleSnippet: 'For God, for country, and for Acme Incorporated.',
    tags: ['tone', 'humorous'],
    seeAlso: ['Irony', 'Anticlimax', 'Juxtaposition'],
    notes: ['Intentional bathos is a satirical technique; unintentional bathos is a common writing flaw. Pope coined the term in his satirical essay \'Peri Bathous.\'']
  },
  {
    name: 'Catachresis',
    type: 'Device',
    description: 'The use of a word in a way that is not literally applicable, often involving a strained or mixed metaphor, or the use of a word where none exists.',
    structure: [
      'Strained or unusual word usage',
      'Mixed or illogical metaphors',
      'Using words beyond their literal range',
      'Can be an error or deliberate technique',
      'Sometimes fills a gap where no word exists'
    ],
    exampleSnippet: 'I will speak daggers to her, but use none.',
    tags: ['figurative language', 'metaphor'],
    seeAlso: ['Metaphor', 'Mixed Metaphor', 'Conceit'],
    notes: ['Catachresis can be a powerful creative technique when deliberate (as in Shakespeare) or an embarrassing error when accidental. Mixed metaphors are a common form.']
  },
  {
    name: 'Antimetabole',
    type: 'Device',
    description: 'A figure of speech in which words in one phrase or clause are repeated in reverse order in the next, creating a mirror-image pattern.',
    structure: [
      'Repeats words in reverse order',
      'Creates AB:BA pattern',
      'Similar to chiasmus but uses same words',
      'Highly memorable and quotable',
      'Common in speeches and epigrams'
    ],
    exampleSnippet: 'Ask not what your country can do for you—ask what you can do for your country.',
    tags: ['repetition', 'rhetoric'],
    seeAlso: ['Chiasmus', 'Epanalepsis', 'Parallelism'],
    notes: ['Antimetabole uses the same words in reversed order; chiasmus reverses the grammatical structure. JFK\'s famous line is technically antimetabole.']
  },
  {
    name: 'Prolepsis',
    type: 'Device',
    description: 'A figure of speech that treats a future event as if it has already happened, or assigns a quality to something before it appropriately applies.',
    structure: [
      'Anticipates future events as present',
      'Describes things as they will become',
      'Can refer to flash-forwards in narrative',
      'Examples: \'the late king\' while he lives',
      'Creates certainty or foreshadowing'
    ],
    exampleSnippet: 'The good die young, he muttered, looking at the doomed soldiers.',
    tags: ['rhetoric', 'temporal'],
    seeAlso: ['In Medias Res', 'Foreshadowing'],
    notes: ['Prolepsis can create a sense of inevitability or fate. It\'s related to but distinct from foreshadowing, which hints rather than states outright.']
  },
  {
    name: 'Pleonasm',
    type: 'Device',
    description: 'The use of more words than necessary to express an idea, either as a fault or for rhetorical emphasis. Related to redundancy.',
    structure: [
      'Redundant or excessive words',
      'Can be a fault or intentional technique',
      'Examples: \'free gift,\' \'burning fire\'',
      'Creates emphasis through repetition',
      'Different from tautology (which repeats meaning)'
    ],
    exampleSnippet: 'I saw it with my own eyes.',
    tags: ['rhetoric', 'emphasis'],
    seeAlso: ['Tautology', 'Repetition', 'Hendiadys'],
    notes: ['Pleonasm is often considered poor writing, but can be used for emphasis. Some pleonasms are so common they\'re idiomatic (\'close proximity\').']
  },
  {
    name: 'Malapropism',
    type: 'Device',
    description: 'The mistaken use of a word in place of a similar-sounding one, often with humorous effect. Named after Mrs. Malaprop in Sheridan\'s play The Rivals.',
    structure: [
      'Incorrect word for a similar-sounding one',
      'Usually unintentional by the character',
      'Creates humor through the mistake',
      'Named after Sheridan\'s character',
      'Examples: \'dance a flamingo\' for \'flamenco\''
    ],
    exampleSnippet: 'She\'s as headstrong as an allegory on the banks of the Nile.',
    tags: ['wordplay', 'humorous'],
    seeAlso: ['Pun', 'Paronomasia'],
    notes: ['Malapropism is named after Mrs. Malaprop who says things like \'a nice derangement of epitaphs\' (arrangement of epithets). It\'s a character-building device in drama and fiction.']
  },
  {
    name: 'Anthimeria',
    type: 'Device',
    description: 'The use of one part of speech as another, such as using a noun as a verb or an adjective as a noun.',
    structure: [
      'Using a word as a different part of speech',
      'Noun as verb, verb as noun, etc.',
      'Common in everyday language evolution',
      'Examples: \'to friend\' someone, \'the big\'',
      'Creates freshness and surprise'
    ],
    exampleSnippet: 'The thunder would not peace at my bidding.',
    tags: ['wordplay', 'syntax'],
    seeAlso: ['Neologism', 'Catachresis'],
    notes: ['Anthimeria is common in English, which readily converts between parts of speech. Shakespeare frequently used it (\'uncle me no uncle\'). Social media has popularized verbing nouns.']
  },
  {
    name: 'Transferred Epithet',
    type: 'Device',
    description: 'An adjective that grammatically modifies one noun but logically applies to another, often transferring a human quality to an inanimate object.',
    structure: [
      'Adjective applied to \'wrong\' noun',
      'Logical meaning applies elsewhere',
      'Often transfers emotion to objects',
      'Examples: \'sleepless night,\' \'happy days\'',
      'Creates economy and suggestiveness'
    ],
    exampleSnippet: 'He spent a sleepless night worrying about the exam.',
    tags: ['figurative language', 'adjective'],
    seeAlso: ['Personification', 'Pathetic Fallacy', 'Hypallage'],
    notes: ['Transferred epithets are so common we often don\'t notice them. They create economy by suggesting the human emotion without stating it directly. Also called hypallage.']
  }
];