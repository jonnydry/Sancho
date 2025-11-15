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
    exampleSnippet: 'All the world\'s a stage, / And all the men and women merely players;'
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
    exampleSnippet: 'O, my luve is like a red, red rose, / That\'s newly sprung in June;'
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
    exampleSnippet: 'From forth the fatal loins of these two foes; / A pair of star-cross\'d lovers take their life.'
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
    exampleSnippet: 'Because I could not stop for Death – / He kindly stopped for me –'
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
    exampleSnippet: 'The light of the fire is a sight. / Go and mow the lawn.'
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
    exampleSnippet: 'The silken, sad, uncertain rustling of each purple curtain.'
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
    exampleSnippet: 'The buzz saw snarled and rattled in the yard.'
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
    exampleSnippet: 'so much depends / upon / a red wheel / barrow / glazed with rain / water / beside the white / chickens.'
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
    exampleSnippet: 'And I will love thee still, my dear, / Till a’ the seas gang dry.'
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
    exampleSnippet: 'Water, water, every where, / And all the boards did shrink; / Water, water, every where, / Nor any drop to drink.'
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
    exampleSnippet: 'O brawling love! O loving hate! / O anything, of nothing first create!'
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
    exampleSnippet: 'Twinkle, twinkle, little star, / How I wonder what you are.'
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
    exampleSnippet: 'Friends, Romans, countrymen, lend me your ears;'
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
    exampleSnippet: 'To be, or not to be: || that is the question' // || marks the caesura
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
    exampleSnippet: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields...'
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
    exampleSnippet: 'The fair breeze blew, the white foam flew, / The furrow followed free'
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
    exampleSnippet: 'Two roads diverged in a yellow wood...' // Roads symbolize life choices
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
    exampleSnippet: 'No! I am not Prince Hamlet, nor was meant to be' // Allusion to Shakespeare
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
    exampleSnippet: 'The pen is mightier than the sword' // Pen = writing; sword = military force
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
    exampleSnippet: 'I must be cruel only to be kind' // Hamlet
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
    exampleSnippet: 'And miles to go before I sleep, / And miles to go before I sleep.' // Frost
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
    exampleSnippet: 'Once upon a midnight dreary, while I pondered, weak and weary' // dreary/weary
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
    exampleSnippet: 'I heard a Fly buzz - when I died - / The Stillness in the Room / Was like the Stillness in the Air - / Between the Heaves of Storm -' // Room/Storm
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
    exampleSnippet: 'Blow, winds, and crack your cheeks! rage! blow!'
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
    exampleSnippet: 'Season of mists and mellow fruitfulness, / Close bosom-friend of the maturing sun'
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
    exampleSnippet: 'It was the best of times, it was the worst of times' // Dickens
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
    exampleSnippet: 'But thy eternal summer shall not fade...' // Shift in Shakespeare\'s Sonnet 18
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
    exampleSnippet: 'Ask not what your country can do for you—ask what you can do for your country' // Kennedy
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
    exampleSnippet: 'When I was a child, I spoke as a child, I understood as a child, I thought as a child'
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
    exampleSnippet: 'Rage, rage against the dying of the light' // Thomas
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
    exampleSnippet: 'Ask for me tomorrow, and you shall find me a grave man' // Mercutio in Romeo & Juliet (grave = serious/tomb)
  }
];