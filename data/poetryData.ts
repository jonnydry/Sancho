import { PoetryItem } from '../types';

export const poetryData: PoetryItem[] = [
  // Forms
  {
    name: 'Sonnet',
    type: 'Form',
    description: 'A 14-line poem with a specific rhyme scheme and structure, typically focusing on a single theme or idea.',
    origin: 'Originating in 13th century Italy and perfected by Petrarch. It was later adapted by English poets like Shakespeare in the 16th century.',
    structure: [
      '14 lines',
      'Typically in iambic pentameter',
      'Shakespearean: ABAB CDCD EFEF GG',
      'Petrarchan: ABBAABBA CDECDE or CDCDCD'
    ],
    exampleSnippet: 'Shall I compare thee to a summer’s day? / Thou art more lovely and more temperate...'
  },
  {
    name: 'Haiku',
    type: 'Form',
    description: 'A Japanese form of poetry consisting of three phrases composed of 17 syllables in a 5, 7, 5 pattern.',
    origin: 'Developed from the Japanese renga form in the 17th century, with Matsuo Bashō being one of its most famous masters.',
    structure: [
      '3 lines',
      'Syllable structure: 5-7-5',
      'Often focuses on nature'
    ],
    exampleSnippet: 'An old silent pond... / A frog jumps into the pond, / splash! Silence again.'
  },
  {
    name: 'Villanelle',
    type: 'Form',
    description: 'A 19-line poetic form consisting of five tercets followed by a quatrain. It features two refrains and two repeating rhymes.',
    origin: 'A French form, its modern version was established by Jean Passerat in the 16th century, but it gained popularity in English in the late 19th century.',
    structure: [
      '19 lines',
      'Five tercets (3-line stanzas)',
      'Concluding quatrain (4-line stanza)',
      'Two rhymes and two refrains'
    ],
    exampleSnippet: 'Do not go gentle into that good night, / Old age should burn and rave at close of day...'
  },
  {
    name: 'Limerick',
    type: 'Form',
    description: 'A five-line poem with a specific rhyme scheme (AABBA) and a humorous tone.',
    origin: 'Popularized in the 19th century by Edward Lear, its origins are associated with soldiers\' songs and folklore in 18th-century Ireland.',
    structure: [
      '5 lines',
      'Rhyme scheme: AABBA',
      'Lines 1, 2, 5 have 3 metrical feet',
      'Lines 3, 4 have 2 metrical feet'
    ],
    exampleSnippet: 'There once was a man from Nantucket / Who kept all his cash in a bucket...'
  },
  {
    name: 'Sestina',
    type: 'Form',
    description: 'A complex, unrhymed poetic form consisting of six stanzas of six lines each and a three-line envoi, using lexical repetition.',
    origin: 'Invented in the 12th century by the troubadour Arnaut Daniel in Provence, France.',
    structure: [
      '39 lines total',
      'Six 6-line stanzas (sestets)',
      'One 3-line concluding stanza (envoi)',
      'End-words repeat in a spiral pattern'
    ],
    exampleSnippet: 'September rain falls on the house. / In the failing light, the old grandmother...'
  },
  {
    name: 'Ode',
    type: 'Form',
    description: 'A lyric poem, typically addressing a particular subject, often elevated in style or manner and written in varied or irregular meter.',
    origin: 'An ancient Greek form, originally performed to music. Pindar was a famous early writer of odes.',
    structure: [
      'Variable length and structure',
      'Addresses a specific subject',
      'Common types: Pindaric, Horatian, Irregular'
    ],
    exampleSnippet: 'Thou still unravish\'d bride of quietness, / Thou foster-child of silence and slow time...'
  },
  {
    name: 'Ballad',
    type: 'Form',
    description: 'A narrative poem, often of folk origin and intended to be sung, consisting of simple stanzas and usually having a recurrent refrain.',
    origin: 'Originating from medieval French chanson balladée or ballade, it became a popular narrative folk song form across Europe.',
    structure: [
      'Typically in quatrains (4-line stanzas)',
      'Rhyme scheme often ABCB',
      'Alternating iambic tetrameter and trimeter',
      'Tells a story'
    ],
    exampleSnippet: 'It is an ancient Mariner, / And he stoppeth one of three...'
  },
  {
    name: 'Ghazal',
    type: 'Form',
    description: 'An ancient form originating in Arabic poetry, composed of a series of couplets with a specific rhyme and refrain pattern.',
    origin: 'An ancient form with roots in 7th-century Arabic poetry, which later flourished in Persian, Urdu, and Turkish literature.',
    structure: [
      'Minimum of five couplets',
      'Rhyme scheme: AA BA CA DA...',
      'Refrain (radif) in first couplet and second line of subsequent couplets',
      'Poet\'s name often in the final couplet'
    ],
    exampleSnippet: 'Tonight, I will not be myself. / Call me by another name, a name in a language I don\'t speak myself.'
  },
  {
    name: 'Elegy',
    type: 'Form',
    description: 'A poem of serious reflection, typically a lament for the dead.',
    origin: 'Originating in ancient Greece, where it referred to a specific meter (elegiac couplets), it later came to signify a poem of mourning.',
    structure: [
      'No fixed structure or rhyme scheme',
      'Mournful, melancholic, or pensive tone',
      'Three stages: lament, praise, consolation'
    ],
    exampleSnippet: 'O Captain! my Captain! our fearful trip is done...'
  },
  {
    name: 'Blank Verse',
    type: 'Form',
    description: 'Poetry written with a precise meter—almost always iambic pentameter—but that does not rhyme.',
    origin: 'Popularized in English by the Earl of Surrey in the 16th century and later perfected by Christopher Marlowe and William Shakespeare.',
    structure: [
      'Unrhymed lines',
      'Consistent meter (usually Iambic Pentameter)',
      'Common in Shakespeare and long narrative poems'
    ],
    exampleSnippet: 'Something there is that doesn\'t love a wall, / That sends the frozen-ground-swell under it...'
  },
  {
    name: 'Free Verse',
    type: 'Form',
    description: 'Poetry that does not rhyme or have a regular meter. It follows the natural rhythms of speech.',
    origin: 'A modern form that gained prominence in the 19th century with poets like Walt Whitman, breaking from traditional metrical and rhyme constraints.',
    structure: [
      'No regular meter or rhyme scheme',
      'Structure is based on cadence, pauses, and line breaks',
      'Highly flexible and modern form'
    ],
    exampleSnippet: 'The fog comes / on little cat feet. / It sits looking / over harbor and city...'
  },
  {
    name: 'Cinquain',
    type: 'Form',
    description: 'A five-line poem or stanza with a specific syllable pattern or word count per line.',
    origin: 'An American form invented by Adelaide Crapsey in the early 20th century, inspired by Japanese forms like Haiku and Tanka.',
    structure: [
      '5 lines',
      'Syllable structure: 2, 4, 6, 8, 2',
      'Alternative structure based on word count: 1, 2, 3, 4, 1'
    ],
    exampleSnippet: 'Listen... / With faint dry sound, / Like steps of passing ghosts, / The leaves, frost-crisp’d, break from the trees / And fall.'
  },
  {
    name: 'Triolet',
    type: 'Form',
    description: 'A short poem of eight lines with a specific rhyme and repetition pattern.',
    origin: 'A medieval French form, one of the "formes fixes," popular with courtly poets in the 14th and 15th centuries.',
    structure: [
      '8 lines',
      'Rhyme scheme: ABaAabAB (capital letters are repeated lines)',
      'Line 1 repeats as line 4 and 7',
      'Line 2 repeats as line 8'
    ],
    exampleSnippet: 'Easy is the triolet, / If you really learn to make it! / Once a neat refrain is set, / Easy is the triolet...'
  },
  {
    name: 'Terza Rima',
    type: 'Form',
    description: 'A poetic form using a three-line stanza (tercet) with an interlocking rhyme scheme of ABA BCB CDC, and so on.',
    origin: 'An Italian form invented by Dante Alighieri in the early 14th century for his epic poem, The Divine Comedy.',
    structure: [
      'Three-line stanzas (tercets)',
      'Interlocking rhyme scheme: ABA BCB CDC...',
      'Often concludes with a single line or couplet'
    ],
    exampleSnippet: 'O wild West Wind, thou breath of Autumn\'s being, / Thou, from whose unseen presence the leaves dead / Are driven, like ghosts from an enchanter fleeing,'
  },
  {
    name: 'Ottava Rima',
    type: 'Form',
    description: 'An Italian poetic form composed of eight-line stanzas, typically in iambic pentameter, with a rhyme scheme of ABABABCC.',
    origin: 'An Italian form from the 14th century, used by Boccaccio and later adopted by English poets like Lord Byron for his narrative poem Don Juan.',
    structure: [
      'Eight-line stanzas',
      'Typically Iambic Pentameter',
      'Rhyme scheme: ABABABCC'
    ],
    exampleSnippet: 'I want a hero: an uncommon want, / When every year and month sends forth a new one, / Till, after cloying the gazettes with cant,'
  },
  {
    name: 'Pantoum',
    type: 'Form',
    description: 'A poetic form composed of quatrains where the second and fourth lines of each stanza serve as the first and third lines of the next.',
    origin: 'A Malaysian form (pantun berkait) adapted by French poets like Victor Hugo in the 19th century.',
    structure: [
      'Quatrains (4-line stanzas)',
      'Lines 2 & 4 of a stanza are repeated as lines 1 & 3 of the next',
      'The last stanza often uses the 1st and 3rd lines of the poem as its 2nd and 4th lines'
    ],
    exampleSnippet: 'Theirs was a house where the noon-sun lay,/ And all the windows looked upon a lake. / It had been his; he had been here to-day; / But he was gone, for everybody’s sake.'
  },
  {
    name: 'Rondeau',
    type: 'Form',
    description: 'A 15-line poem with two rhymes throughout, consisting of three stanzas (a quintet, a quatrain, and a sestet). The opening words of the first line are used as a refrain at the end of the second and third stanzas.',
    origin: 'A medieval and Renaissance French form, one of the "formes fixes," popular for love poetry.',
    structure: [
      '15 lines in three stanzas',
      'Rhyme scheme: aabba aabR aabbaR',
      'The "R" represents the refrain (rentrement)'
    ],
    exampleSnippet: 'In Flanders fields the poppies blow / Between the crosses, row on row, / That mark our place; and in the sky / The larks, still bravely singing, fly / Scarce heard amid the guns below.'
  },
  {
    name: 'Sea Shanty',
    type: 'Form',
    description: 'A traditional work song sung by sailors to coordinate tasks on large sailing vessels, characterized by a call-and-response structure.',
    origin: 'Flourished during the Age of Sail in the 19th century, with rhythms dictated by specific shipboard tasks like hoisting sails or weighing anchor.',
    structure: [
      'Call-and-response format',
      'A lead singer (shantyman) sings verses',
      'Crew responds with a chorus',
      'Rhythm matches the work being performed'
    ],
    exampleSnippet: 'What shall we do with a drunken sailor, / Early in the morning?'
  },
    {
    name: 'Tanka',
    type: 'Form',
    description: 'A Japanese form of poetry, related to the Haiku, with five lines and a 5, 7, 5, 7, 7 syllable structure.',
    origin: 'An ancient Japanese form, dating back to at least the 7th century, predating the Haiku from which it evolved.',
    structure: [
      '5 lines',
      'Syllable structure: 5-7-5-7-7',
      'Often focuses on a single image or idea'
    ],
    exampleSnippet: 'A lightning flash— / what I thought were faces / are plumes of pampas grass.'
  },
  {
    name: 'Rhyme Royal',
    type: 'Form',
    description: 'A seven-line stanza form, often used for narrative poetry, introduced to English poetry by Geoffrey Chaucer.',
    origin: 'A form introduced to English poetry by Geoffrey Chaucer in the 14th century, used in his long narrative poems like Troilus and Criseyde.',
    structure: [
      'Seven lines per stanza',
      'Typically in iambic pentameter',
      'Rhyme scheme: ABABBCC'
    ],
    exampleSnippet: 'They flee from me that sometime did me seek / With naked foot, stalking in my chamber.'
  },
  {
    name: 'Spenserian Stanza',
    type: 'Form',
    description: 'A nine-line stanza form invented by Edmund Spenser for his epic poem The Faerie Queene.',
    origin: 'Invented by Edmund Spenser in the late 16th century for his epic poem The Faerie Queene.',
    structure: [
      'Nine lines per stanza',
      'First eight lines are in iambic pentameter',
      'The final line is an Alexandrine (iambic hexameter)',
      'Rhyme scheme: ABABBCBCC'
    ],
    exampleSnippet: 'A Gentle Knight was pricking on the plaine, / Ycladd in mightie armes and silver shielde...'
  },
  {
    name: 'Kyrielle',
    type: 'Form',
    description: 'A French poetic form consisting of quatrains where the last line of each stanza is a refrain.',
    origin: 'A French form dating back to the Middle Ages, often used in religious hymns and carols. The name derives from "Kyrie eleison."',
    structure: [
      'Composed of quatrains (4-line stanzas)',
      'Typically eight syllables per line',
      'The last line of each stanza is a refrain',
      'Common rhyme scheme: AABA or AABB'
    ],
    exampleSnippet: 'In the House of Death, where the dust is deep, / A place of shadows and sleep, / He has forsaken the watch he used to keep, / In the House of Death, where the dust is deep.'
  },
  {
    name: 'Clerihew',
    type: 'Form',
    description: 'A whimsical, four-line biographical poem that is humorous and often nonsensical.',
    origin: 'Invented by and named after Edmund Clerihew Bentley in the late 19th century.',
    structure: [
      'Four lines',
      'Rhyme scheme: AABB',
      'First line names the subject',
      'Meter is irregular and often forced for comedic effect'
    ],
    exampleSnippet: 'Sir Christopher Wren / Said, "I am going to dine with some men. / If anyone calls, / Say I am designing St. Paul\'s."'
  },
  {
    name: 'Tanaga',
    type: 'Form',
    description: 'A traditional Filipino poetic form consisting of four lines with seven syllables each, often containing a metaphor or allegory.',
    origin: 'A traditional poetic form from the Philippines, with roots in pre-colonial oral traditions.',
    structure: [
      'Quatrain (4-line stanza)',
      'Each line has seven syllables (heptasyllabic)',
      'Traditionally unrhymed, but modern versions often rhyme'
    ],
    exampleSnippet: 'Oh be resilient, my heart, / You are made of stone, after all. / Though the chisel has struck you a thousand times, / Did you not even once cry out?'
  },
  // Meters
  {
    name: 'Iambic Trimeter',
    type: 'Meter',
    description: 'A line of verse with three iambic feet, consisting of an unstressed syllable followed by a stressed syllable.',
    structure: [
      '6 syllables per line',
      'Pattern: da-DUM da-DUM da-DUM',
      'Common in ballads and light verse'
    ],
    exampleSnippet: 'We romped until the pans / Slid from the kitchen shelf;'
  },
  {
    name: 'Iambic Tetrameter',
    type: 'Meter',
    description: 'A line of verse with four iambic feet.',
    structure: [
      '8 syllables per line',
      'Pattern: da-DUM da-DUM da-DUM da-DUM',
      'A very common meter in English poetry'
    ],
    exampleSnippet: 'I wandered lonely as a cloud / That floats on high o\'er vales and hills,'
  },
  {
    name: 'Iambic Pentameter',
    type: 'Meter',
    description: 'A line of verse with five iambic feet.',
    structure: [
      '10 syllables per line',
      'Pattern: da-DUM da-DUM da-DUM da-DUM da-DUM',
      'Most common meter in English poetry'
    ],
    exampleSnippet: 'But, soft! what light through yonder window breaks?'
  },
  {
    name: 'Iambic Hexameter (Alexandrine)',
    type: 'Meter',
    description: 'A line of verse with six iambic feet, also known as an Alexandrine. Often used for a dignified or stately effect.',
    structure: [
      '12 syllables per line',
      'Pattern: da-DUM da-DUM da-DUM da-DUM da-DUM da-DUM',
      'Common as the final line of a Spenserian stanza'
    ],
    exampleSnippet: 'A needless Alexandrine ends the song / That, like a wounded snake, drags its slow length along.'
  },
  {
    name: 'Trochaic Trimeter',
    type: 'Meter',
    description: 'A line of verse with three trochaic feet, where each foot has a stressed syllable followed by an unstressed one.',
    structure: [
      '6 syllables per line (often catalectic)',
      'Pattern: DUM-da DUM-da DUM-da',
      'Creates a falling, song-like rhythm'
    ],
    exampleSnippet: 'Here we go round the / Mulberry bush,'
  },
  {
    name: 'Trochaic Tetrameter',
    type: 'Meter',
    description: 'A line of verse with four metrical feet, each consisting of one stressed syllable followed by one unstressed syllable.',
    structure: [
      '8 syllables per line',
      'Pattern: DUM-da DUM-da DUM-da DUM-da',
      'Often used in chants or spells'
    ],
    exampleSnippet: 'Double, double toil and trouble; / Fire burn and cauldron bubble.'
  },
  {
    name: 'Dactylic Tetrameter',
    type: 'Meter',
    description: 'A line of verse with four dactylic feet. Creates a strong, rolling rhythm, often used in light or narrative verse.',
    structure: [
      'Up to 12 syllables per line',
      'Pattern: DUM-da-da DUM-da-da DUM-da-da DUM-da-da',
      'Often catalectic (last foot is incomplete)'
    ],
    exampleSnippet: 'Woman much missed, how you call to me, call to me,'
  },
  {
    name: 'Dactylic Hexameter',
    type: 'Meter',
    description: 'A line of verse with six metrical feet, where each foot is a dactyl (one stressed syllable followed by two unstressed syllables).',
    structure: [
      'Up to 17 syllables per line',
      'Pattern: DUM-da-da DUM-da-da...',
      'The meter of classical epic poetry (e.g., The Iliad, The Aeneid)'
    ],
    exampleSnippet: 'This is the forest primeval. The murmuring pines and the hemlocks,'
  },
  {
    name: 'Anapestic Trimeter',
    type: 'Meter',
    description: 'A line of verse with three anapestic feet.',
    structure: [
      'Typically 9 syllables per line',
      'Pattern: da-da-DUM da-da-DUM da-da-DUM',
      'Common in narrative poetry and children\'s rhymes'
    ],
    exampleSnippet: 'I am monarch of all I survey,'
  },
  {
    name: 'Anapestic Tetrameter',
    type: 'Meter',
    description: 'A line of verse with four metrical feet, where each foot is an anapest (two unstressed syllables followed by one stressed syllable).',
    structure: [
      'Typically 12 syllables per line',
      'Pattern: da-da-DUM da-da-DUM...',
      'Creates a galloping, forward-moving rhythm'
    ],
    exampleSnippet: '’Twas the night before Christmas, when all through the house'
  },
  {
    name: 'Spondee',
    type: 'Meter',
    description: 'A metrical foot consisting of two stressed syllables. Often used for emphasis or variation within another meter.',
    structure: [
      '2 stressed syllables',
      'Pattern: DUM-DUM',
      'Used for emphasis and variation',
      'Rarely forms the basis of a whole poem'
    ],
    exampleSnippet: 'Cry, cry! Troy burns, or else let Helen go.'
  },
  {
    name: 'Pyrrhic',
    type: 'Meter',
    description: 'A metrical foot consisting of two unstressed syllables. Very rare and usually found interspersed with other meters.',
    structure: [
      '2 unstressed syllables',
      'Pattern: da-da',
      'Used for variation and to quicken pace'
    ],
    exampleSnippet: 'When the blood creeps and the nerves prick.' // "When the" is pyrrhic
  },
  {
    name: 'Amphibrach',
    type: 'Meter',
    description: 'A metrical foot consisting of a stressed syllable between two unstressed syllables.',
    structure: [
      '3 syllables',
      'Pattern: da-DUM-da',
      'Creates a rolling, flowing rhythm'
    ],
    exampleSnippet: 'To-morrow, and to-morrow, and to-morrow,' // "and to-mor"
  },
  {
    name: 'Cretic',
    type: 'Meter',
    description: 'A metrical foot consisting of a short (or unstressed) syllable between two long (or stressed) syllables. Also called an amphimacer.',
    structure: [
      '3 syllables',
      'Pattern: DUM-da-DUM',
      'Creates a strong, emphatic rhythm'
    ],
    exampleSnippet: 'After the sunset, the twilight.'
  },
  {
    name: 'Choriamb',
    type: 'Meter',
    description: 'A compound metrical foot of four syllables, consisting of a trochee and an iamb. A stressed, two unstressed, and a final stressed syllable.',
    structure: [
      '4 syllables',
      'Pattern: DUM-da-da-DUM',
      'Used for variation and effect, not typically for a whole poem.'
    ],
    exampleSnippet: 'Over the hill, over the dale, / Thorough bush, thorough brier,'
  },
];