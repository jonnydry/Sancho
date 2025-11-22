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
    exampleSnippet: 'Shall I compare thee to a summer's day? / Thou art more lovely and more temperate...',
    tags: ['fixed form', 'lyric', 'traditional'],
    seeAlso: ['Iambic Pentameter', 'Volta', 'Couplet', 'Quatrain'],
    notes: ['The volta (turn) occurs at line 9 in Petrarchan sonnets and before the final couplet in Shakespearean sonnets.']
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
    exampleSnippet: 'An old silent pond... / A frog jumps into the pond, / splash! Silence again.',
    tags: ['fixed form', 'syllabic', 'nature'],
    seeAlso: ['Tanka', 'Senryu', 'Syllabic Verse'],
    notes: ['Traditional haiku includes a kigo (seasonal reference) and a kireji (cutting word). English haiku often focuses on nature and a moment of insight.']
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
    exampleSnippet: 'Do not go gentle into that good night, / Old age should burn and rave at close of day...',
    tags: ['fixed form', 'repetition', 'lyric'],
    seeAlso: ['Refrain', 'Repetition', 'Tercet', 'Terza Rima'],
    notes: ['The two refrains create a haunting, obsessive quality. Choose refrains that can bear repetition and gain meaning with each appearance.']
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
    exampleSnippet: 'September rain falls on the house. / In the failing light, the old grandmother...',
    tags: ['fixed form', 'repetition', 'complex'],
    seeAlso: ['Repetition', 'Refrain', 'Villanelle', 'Pantoum'],
    notes: ['The end-words follow a specific pattern: 123456, 615243, 364125, 532614, 451362, 246531, then all six in the envoi. Choose end-words that can bear repetition and shift meaning.']
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
    exampleSnippet: 'Theirs was a house where the noon-sun lay,/ And all the windows looked upon a lake. / It had been his; he had been here to-day; / But he was gone, for everybody's sake.',
    tags: ['fixed form', 'repetition', 'quatrain'],
    seeAlso: ['Repetition', 'Refrain', 'Villanelle', 'Quatrain'],
    notes: ['The repetition creates a circular, meditative quality. Each repeated line gains new meaning in its new context. The form works well for themes of memory, time, or reflection.']
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
  {
    name: 'Acrostic',
    type: 'Form',
    description: 'A poem in which the first letter of each line spells out a word, name, or phrase when read vertically.',
    origin: 'An ancient form found in Greek and Latin texts, including biblical Hebrew poetry. Popular in medieval times and used widely in children\'s literature.',
    structure: [
      'Variable length',
      'First letters of each line spell a word vertically',
      'Can also use middle letters (mesostich) or last letters (telestich)',
      'No required rhyme scheme or meter'
    ],
    exampleSnippet: 'Elizabeth it is in vain you say / "Love not" — thou sayest it in so sweet a way...'
  },
  {
    name: 'Epigram',
    type: 'Form',
    description: 'A brief, interesting, memorable, and sometimes surprising or satirical statement, often in verse form.',
    origin: 'An ancient Greek form, perfected by Latin poet Martial in the 1st century CE. Popular through Renaissance and Neoclassical periods.',
    structure: [
      'Very short, usually 2-4 lines',
      'Witty or satirical content',
      'Often has a surprising twist at the end',
      'Concise and memorable phrasing'
    ],
    exampleSnippet: 'I am His Highness\' dog at Kew; / Pray tell me, sir, whose dog are you?'
  },
  {
    name: 'Epic',
    type: 'Form',
    description: 'A lengthy narrative poem, often concerning a serious subject containing details of heroic deeds and events significant to a culture or nation.',
    origin: 'One of the oldest poetic forms, with examples like The Epic of Gilgamesh (c. 2100 BCE), Homer\'s Iliad and Odyssey (8th century BCE), and Beowulf (c. 700-1000 CE).',
    structure: [
      'Very long narrative poem (often thousands of lines)',
      'Elevated style and grand theme',
      'Features a heroic protagonist',
      'Often begins in medias res (in the middle of things)',
      'Traditionally written in dactylic hexameter or blank verse'
    ],
    exampleSnippet: 'Arms and the man I sing, who first made way, / Predestined exile, from the Trojan shore...'
  },
  {
    name: 'Couplet',
    type: 'Form',
    description: 'A pair of successive lines of verse, typically rhyming and of the same length, forming a complete thought.',
    origin: 'A fundamental poetic unit used since ancient times. The heroic couplet (in iambic pentameter) was perfected by Alexander Pope in the 18th century.',
    structure: [
      '2 lines',
      'Usually rhyming (AA)',
      'Often in the same meter',
      'Can stand alone or be part of a larger poem',
      'Heroic couplet: iambic pentameter with rhyming AA'
    ],
    exampleSnippet: 'Good nature and good sense must ever join; / To err is human, to forgive, divine.'
  },
  {
    name: 'Quatrain',
    type: 'Form',
    description: 'A stanza or poem of four lines, typically with alternating rhymes. The most common stanza form in English poetry.',
    origin: 'Used extensively throughout poetic history across many cultures. A fundamental building block of poetry.',
    structure: [
      '4 lines',
      'Common rhyme schemes: ABAB, AABB, ABBA, ABCB',
      'Variable meter',
      'Can stand alone or be part of a longer poem'
    ],
    exampleSnippet: 'The Curfew tolls the knell of parting day, / The lowing herd wind slowly o\'er the lea, / The plowman homeward plods his weary way, / And leaves the world to darkness and to me.'
  },
  {
    name: 'Tercet',
    type: 'Form',
    description: 'A unit of three lines of verse, which may be rhymed or unrhymed. Also called a triplet when all three lines rhyme.',
    origin: 'A basic poetic unit used across cultures. The terza rima form uses linked tercets, invented by Dante.',
    structure: [
      '3 lines',
      'Can be rhymed (AAA, ABA) or unrhymed',
      'Variable meter',
      'When all three lines rhyme (AAA), called a triplet'
    ],
    exampleSnippet: 'My heart leaps up when I behold / A rainbow in the sky: / So was it when my life began;'
  },
  {
    name: 'Senryu',
    type: 'Form',
    description: 'A Japanese poetic form similar to haiku in structure (5-7-5 syllables) but focusing on human nature, irony, and humor rather than nature.',
    origin: 'Named after Edo-period poet Karai Senryu (1718-1790), who popularized this humorous, satirical variation of haiku.',
    structure: [
      '3 lines',
      'Syllable structure: 5-7-5',
      'Focuses on human foibles, not nature',
      'Often humorous or satirical',
      'No seasonal reference (kigo) required'
    ],
    exampleSnippet: 'I know I am no good / at love / but the barista / smiles at me'
  },
  {
    name: 'Concrete Poetry',
    type: 'Form',
    description: 'Poetry in which the typographical arrangement of words is as important as the conventional elements of the poem. Also called shape poetry or visual poetry.',
    origin: 'Ancient roots in Greek pattern poems, revived in the 1950s as a modernist/postmodernist movement by poets like Eugen Gomringer.',
    structure: [
      'Visual arrangement forms a shape or image',
      'Typography and spatial arrangement convey meaning',
      'Can be representational (shape relates to subject)',
      'Words may be repeated, fragmented, or arranged in patterns'
    ],
    exampleSnippet: '[A poem arranged in the shape of a falling leaf, wings, or other visual form]'
  },
  {
    name: 'Ballade',
    type: 'Form',
    description: 'A French verse form consisting of three main stanzas and a shorter concluding stanza (envoi), with a strict rhyme scheme and a refrain.',
    origin: 'A medieval French form, one of the "formes fixes," distinct from the English ballad. François Villon was a master of this form in the 15th century.',
    structure: [
      'Three stanzas of eight lines each',
      'Concluding envoi of four lines',
      'Rhyme scheme: ababbcbC / ababbcbC / ababbcbC / bcbC',
      'Capital C represents the refrain',
      'Addresses a person in the envoi'
    ],
    exampleSnippet: 'Tell me now in what hidden way is / Lady Flora the lovely Roman? / Where\'s Hipparchia, and where is Thais...'
  },
  {
    name: 'Rubaiyat',
    type: 'Form',
    description: 'A Persian poetic form consisting of quatrains with an AABA rhyme scheme, made famous in English by Edward FitzGerald\'s translation of Omar Khayyam.',
    origin: 'A traditional Persian form, popularized in the West through Edward FitzGerald\'s 1859 translation of Omar Khayyam\'s Rubaiyat (11th-12th century).',
    structure: [
      'Quatrains (4-line stanzas)',
      'Rhyme scheme: AABA',
      'Often iambic pentameter in English translations',
      'Each stanza typically stands alone as a complete thought'
    ],
    exampleSnippet: 'A Book of Verses underneath the Bough, / A Jug of Wine, a Loaf of Bread—and Thou / Beside me singing in the Wilderness— / Oh, Wilderness were Paradise enow!'
  },
  {
    name: 'Prose Poetry',
    type: 'Form',
    description: 'Poetry written in prose form rather than verse, without line breaks, but retaining poetic qualities like imagery, rhythm, and emotional intensity.',
    origin: 'Developed in 19th-century France by poets like Aloysius Bertrand and Charles Baudelaire. Became prominent in modernist poetry.',
    structure: [
      'Written in prose paragraphs, not verse lines',
      'No line breaks or traditional poetic structure',
      'Uses poetic devices: imagery, metaphor, rhythm',
      'Often lyrical and compact',
      'Blurs the boundary between poetry and prose'
    ],
    exampleSnippet: 'Once upon a time I lived in a house where bells were always ringing. Not happy bells: alarm bells, desperate bells, demented fire bells...'
  },
  {
    name: 'Sapphic Stanza',
    type: 'Form',
    description: 'A classical Greek stanzaic form named after the poet Sappho, consisting of three hendecasyllabic lines and one shorter Adonic line.',
    origin: 'Invented by the ancient Greek poet Sappho of Lesbos (c. 630-570 BCE), adapted into Latin by Catullus and Horace.',
    structure: [
      'Four lines per stanza',
      'Three Sapphic lines (11 syllables each)',
      'One Adonic line (5 syllables)',
      'Specific metrical pattern in classical form',
      'Often unrhymed in classical versions'
    ],
    exampleSnippet: 'Thou art dead now, and never / Memory of thee shall be, for / Thou hast not shared in the roses / That grow in Pieria.'
  },
  {
    name: 'Ekphrastic Poetry',
    type: 'Form',
    description: 'Poetry that vividly describes or responds to a work of visual art, such as a painting, sculpture, or photograph.',
    origin: 'From the Greek "ekphrasis" meaning description. An ancient tradition, with Homer\'s description of Achilles\' shield in The Iliad being a famous early example.',
    structure: [
      'No fixed structure or form',
      'Subject is a work of visual art',
      'Describes, interprets, or responds to the artwork',
      'Often explores the relationship between visual and verbal art'
    ],
    exampleSnippet: 'Thou still unravish\'d bride of quietness, / Thou foster-child of silence and slow time...' // Keats on Grecian Urn
  },
  {
    name: 'List Poem',
    type: 'Form',
    description: 'A poem that consists of a list of items, people, places, or ideas, often without traditional narrative structure, creating meaning through accumulation and juxtaposition.',
    origin: 'An ancient form found across cultures, from biblical psalms to modern experimental poetry. Popularized in contemporary poetry by poets like Walt Whitman.',
    structure: [
      'No fixed structure or rhyme scheme',
      'Organized as a list or catalog',
      'Items may be related or seemingly unrelated',
      'Meaning emerges from accumulation and order',
      'Can use repetition, parallelism, or variation'
    ],
    exampleSnippet: 'I celebrate myself, and sing myself, / And what I assume you shall assume, / For every atom belonging to me as good belongs to you.',
    tags: ['free form', 'catalog', 'experimental'],
    seeAlso: ['Catalog', 'Free Verse', 'Found Poetry'],
    notes: ['The power of a list poem comes from selection and order. Each item should contribute to the overall effect. Juxtaposition of items creates meaning.']
  },
  {
    name: 'Found Poetry',
    type: 'Form',
    description: 'Poetry created by taking words, phrases, or passages from other sources and reframing them as poetry, often by making changes in spacing, line breaks, or by adding or deleting text.',
    origin: 'A 20th-century form that gained prominence with Dada and Surrealist movements. Poets like Tristan Tzara and later, in the 1960s, poets like Ronald Johnson popularized the form.',
    structure: [
      'Source material from existing texts (newspapers, books, advertisements, etc.)',
      'Words rearranged, recontextualized, or minimally altered',
      'New meaning created through selection and arrangement',
      'Original source may be credited or remain anonymous',
      'Can be erasure (blackout) poetry, cento, or cut-up technique'
    ],
    exampleSnippet: '[A poem created by selecting and rearranging words from a newspaper article or book]',
    tags: ['experimental', 'found text', 'modern'],
    seeAlso: ['Erasure Poetry', 'Cento', 'List Poem'],
    notes: ['Found poetry challenges notions of authorship and creativity. The poet\'s skill lies in selection, arrangement, and recontextualization. Always consider copyright and attribution.']
  },
  {
    name: 'Blues Poem',
    type: 'Form',
    description: 'A poetic form that incorporates the structure, rhythm, and themes of blues music, often featuring repetition, call-and-response patterns, and themes of struggle, loss, and resilience.',
    origin: 'Emerged in the early 20th century, drawing from African American musical traditions. Langston Hughes was a key figure in adapting blues structure to poetry.',
    structure: [
      'Often uses AAB rhyme scheme (first two lines similar, third line different)',
      'Repetition and variation of lines',
      'Themes of hardship, love, loss, and survival',
      'Musical rhythm and cadence',
      'May include call-and-response elements'
    ],
    exampleSnippet: 'I\'ve known rivers: / I\'ve known rivers ancient as the world and older than the flow of human blood in human veins.'
  },
  {
    name: 'Golden Shovel',
    type: 'Form',
    description: 'A contemporary form invented by Terrance Hayes, where each word of a line (or lines) from an existing poem becomes the end word of each line in the new poem, reading vertically to reveal the source.',
    origin: 'Invented by Terrance Hayes in 2010, inspired by Gwendolyn Brooks\' poem "We Real Cool." The form pays homage to existing poems while creating new work.',
    structure: [
      'Select a line or lines from an existing poem',
      'Each word of the source becomes the end word of a line in the new poem',
      'The source text is read vertically down the right side',
      'The new poem must make sense horizontally',
      'Source poem is typically credited'
    ],
    exampleSnippet: '[A poem where the end words, read vertically, spell out: "We real cool. We / Left school. We"]'
  },
  {
    name: 'Erasure Poetry',
    type: 'Form',
    description: 'A form of found poetry created by erasing or blacking out words from an existing text, leaving behind selected words that form a new poem.',
    origin: 'Gained prominence in the 1960s with poets like Ronald Johnson, though similar techniques existed earlier. Popularized by contemporary poets like Mary Ruefle and Austin Kleon.',
    structure: [
      'Start with an existing text (book, article, etc.)',
      'Erase or black out unwanted words',
      'Remaining words form the new poem',
      'Visual presentation often shows the erasure',
      'Original source is typically credited'
    ],
    exampleSnippet: '[A poem created by blacking out most words in a page, leaving only selected words visible]'
  },
  {
    name: 'Cento',
    type: 'Form',
    description: 'A poem composed entirely of lines taken from other poems by different authors, arranged to create a new work. The name comes from the Latin word for "patchwork."',
    origin: 'An ancient form dating back to classical times. The term "cento" comes from Latin, meaning a garment made of patches. Popular in medieval times and revived in modern experimental poetry.',
    structure: [
      'Composed entirely of lines from other poems',
      'Each line must be from a different source (or clearly attributed)',
      'Lines arranged to create new meaning',
      'Original sources should be credited',
      'No fixed length or structure'
    ],
    exampleSnippet: '[A poem made entirely of lines from Shakespeare, Dickinson, Frost, etc., arranged to tell a new story]'
  },
  {
    name: 'Aubade',
    type: 'Form',
    description: 'A poem or song about lovers parting at dawn, or more broadly, a morning love song or poem about the dawn.',
    origin: 'A medieval French form, popular in troubadour poetry. The term comes from "aube" (dawn). Adapted by English poets like John Donne and later by modern poets.',
    structure: [
      'No fixed structure or rhyme scheme',
      'Theme: lovers parting at dawn or morning meditation',
      'Often melancholic or bittersweet tone',
      'May include imagery of dawn, birds, or morning light',
      'Can be any length or form'
    ],
    exampleSnippet: 'Stay, O sweet, and do not rise! / The light that shines comes from thine eyes.'
  },
  {
    name: 'Pastoral',
    type: 'Form',
    description: 'A poem that idealizes rural life and the countryside, often featuring shepherds, nature, and an escape from urban complexity. Can be any form but shares thematic concerns.',
    origin: 'Originated in ancient Greece with Theocritus (3rd century BCE) and was developed by Virgil. Popular in Renaissance and Romantic periods.',
    structure: [
      'No fixed structure, but often uses traditional forms',
      'Focus on rural life, nature, and simplicity',
      'Often contrasts country with city life',
      'May feature shepherds or rural characters',
      'Themes of innocence, harmony with nature, and escape'
    ],
    exampleSnippet: 'Come live with me and be my love, / And we will all the pleasures prove / That valleys, groves, hills, and fields, / Woods, or steepy mountain yields.'
  },
  {
    name: 'Dramatic Monologue',
    type: 'Form',
    description: 'A poem written in the form of a speech by a single character, revealing their personality, situation, and inner thoughts. The speaker addresses a silent listener.',
    origin: 'Developed in the Victorian era, with Robert Browning being the master of the form. His poems like "My Last Duchess" exemplify the dramatic monologue.',
    structure: [
      'No fixed structure, but often blank verse or free verse',
      'Single speaker addressing a silent listener',
      'Reveals character through speech',
      'Set in a specific dramatic situation',
      'Speaker\'s words reveal more than they intend'
    ],
    exampleSnippet: 'That\'s my last Duchess painted on the wall, / Looking as if she were alive. I call / That piece a wonder, now...'
  },
  {
    name: 'Elegiac Couplet',
    type: 'Form',
    description: 'A pair of lines in classical poetry, consisting of a dactylic hexameter followed by a dactylic pentameter. In English, often refers to any couplet with elegiac tone.',
    origin: 'An ancient Greek and Latin form used for elegies and epigrams. Ovid and Catullus were masters of the form. Adapted into English with varying success.',
    structure: [
      'Two lines: hexameter followed by pentameter',
      'In classical form: dactylic hexameter + dactylic pentameter',
      'Often used for mourning or reflection',
      'In English, often iambic pentameter couplets with elegiac themes',
      'Creates a falling, melancholic rhythm'
    ],
    exampleSnippet: '[In classical form: two lines of dactylic meter, the second shorter]'
  },
  {
    name: 'Rispetto',
    type: 'Form',
    description: 'An Italian poetic form consisting of eight lines, typically in iambic tetrameter, with a rhyme scheme of ABABABCC.',
    origin: 'An Italian form from the Renaissance period, related to the strambotto. Used by Italian poets and later adapted into English.',
    structure: [
      '8 lines',
      'Typically iambic tetrameter',
      'Rhyme scheme: ABABABCC',
      'Often used for love poetry',
      'The final couplet provides resolution or emphasis'
    ],
    exampleSnippet: '[An eight-line poem with alternating rhymes ending in a couplet]'
  },
  {
    name: 'Monorhyme',
    type: 'Form',
    description: 'A poem in which all lines share the same end rhyme. Can be any length, creating a strong sense of unity and emphasis.',
    origin: 'Found across many cultures and time periods. Common in Arabic and Persian poetry, and used in English poetry for emphasis and unity.',
    structure: [
      'All lines end with the same rhyme sound',
      'No fixed length or meter',
      'Creates strong unity and emphasis',
      'Can be challenging to maintain without becoming monotonous',
      'Often used for humorous or emphatic effect'
    ],
    exampleSnippet: 'In days of old when knights were bold / And chivalry was not yet cold, / When honor was worth more than gold...'
  },
  {
    name: 'Nonet',
    type: 'Form',
    description: 'A nine-line poem where the first line has nine syllables, the second has eight, and so on, down to the last line with one syllable.',
    origin: 'A modern form, likely invented in the 20th century. The name comes from "nine" in various languages.',
    structure: [
      '9 lines',
      'Syllable count: 9, 8, 7, 6, 5, 4, 3, 2, 1',
      'No required rhyme scheme',
      'Creates a descending, funnel-like effect',
      'The single-syllable final line provides emphasis'
    ],
    exampleSnippet: '[A nine-line poem with descending syllable counts from nine to one]'
  },
  {
    name: 'Sicilian Octave',
    type: 'Form',
    description: 'An eight-line stanza form with a rhyme scheme of ABABABAB, typically in iambic pentameter.',
    origin: 'An Italian form from Sicily, used in medieval and Renaissance poetry. Adapted into English poetry.',
    structure: [
      '8 lines',
      'Rhyme scheme: ABABABAB',
      'Typically iambic pentameter',
      'Alternating rhyme creates a flowing, song-like quality',
      'Often used for narrative or lyric poetry'
    ],
    exampleSnippet: '[An eight-line stanza with alternating rhymes throughout]'
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
    exampleSnippet: 'But, soft! what light through yonder window breaks?',
    tags: ['iambic', 'pentameter', 'traditional'],
    seeAlso: ['Iamb', 'Blank Verse', 'Sonnet', 'Feminine Ending', 'Masculine Ending'],
    notes: ['The most natural meter for English speech. Variations like feminine endings and substitutions (spondees, trochees) are common and add musicality.']
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
  {
    name: 'Iamb',
    type: 'Meter',
    description: 'A metrical foot consisting of one unstressed syllable followed by one stressed syllable. The most common foot in English poetry.',
    structure: [
      '2 syllables',
      'Pattern: da-DUM (unstressed-stressed)',
      'Examples: "today," "appear," "delight"',
      'The building block of iambic meters'
    ],
    exampleSnippet: 'The world / is too / much with / us; late / and soon' // Each "/" separates iambs
  },
  {
    name: 'Trochee',
    type: 'Meter',
    description: 'A metrical foot consisting of one stressed syllable followed by one unstressed syllable. The opposite of an iamb.',
    structure: [
      '2 syllables',
      'Pattern: DUM-da (stressed-unstressed)',
      'Examples: "garden," "highway," "poet"',
      'Creates a falling, emphatic rhythm'
    ],
    exampleSnippet: 'Peter, / Peter, / pumpkin / eater' // Each "/" separates trochees
  },
  {
    name: 'Dactyl',
    type: 'Meter',
    description: 'A metrical foot consisting of one stressed syllable followed by two unstressed syllables. Common in classical poetry.',
    structure: [
      '3 syllables',
      'Pattern: DUM-da-da (stressed-unstressed-unstressed)',
      'Examples: "elephant," "strawberry," "merrily"',
      'Creates a rolling, falling rhythm'
    ],
    exampleSnippet: 'This is the / forest pri / meval. The / murmuring / pines and the / hemlocks'
  },
  {
    name: 'Anapest',
    type: 'Meter',
    description: 'A metrical foot consisting of two unstressed syllables followed by one stressed syllable. The opposite of a dactyl.',
    structure: [
      '3 syllables',
      'Pattern: da-da-DUM (unstressed-unstressed-stressed)',
      'Examples: "understand," "contradict," "intervene"',
      'Creates a galloping, rising rhythm'
    ],
    exampleSnippet: '\'Twas the night / before Christ / mas when all / through the house'
  },
  {
    name: 'Catalexis',
    type: 'Meter',
    description: 'The omission of one or more unstressed syllables from the end of a line of verse, making the final metrical foot incomplete.',
    structure: [
      'Incomplete final foot',
      'Catalectic line: missing final syllable(s)',
      'Acatalectic line: complete (normal)',
      'Creates variety and emphasis at line endings'
    ],
    exampleSnippet: 'Tyger! Tyger! burning bright / In the forests of the night' // Trochaic with catalectic ending
  },
  {
    name: 'Acephalous',
    type: 'Meter',
    description: 'A line of verse that is missing the first syllable of the first metrical foot. Literally "headless" in Greek.',
    structure: [
      'Missing first syllable',
      'Common in iambic and anapestic meters',
      'Creates emphasis by beginning with a stressed syllable',
      'Also called an initial truncation'
    ],
    exampleSnippet: 'Thus with the year / Seasons return' // Iambic but missing first unstressed syllable
  },
  {
    name: 'Feminine Ending',
    type: 'Meter',
    description: 'An extra unstressed syllable at the end of a line of verse, creating a softer, more open conclusion.',
    structure: [
      'Extra unstressed syllable at line end',
      'Common in iambic pentameter',
      'Creates a gentler, less conclusive effect',
      'Opposite of masculine ending (ends on stressed syllable)'
    ],
    exampleSnippet: 'To be or not to be, that is the question: / Whether \'tis nobler in the mind to suffer' // "question" and "suffer" are feminine endings
  },
  {
    name: 'Masculine Ending',
    type: 'Meter',
    description: 'A line of verse that ends on a stressed syllable, creating a strong, conclusive effect. The standard ending in most English poetry.',
    structure: [
      'Line ends on a stressed syllable',
      'Standard ending in most meters',
      'Creates a strong, conclusive effect',
      'Opposite of feminine ending',
      'Common in iambic pentameter'
    ],
    exampleSnippet: 'Shall I compare thee to a summer\'s day? / Thou art more lovely and more temperate:' // "day" and "rate" are masculine endings
  },
  {
    name: 'Sprung Rhythm',
    type: 'Meter',
    description: 'A metrical system developed by Gerard Manley Hopkins, where each foot begins with a stressed syllable and can contain a variable number of unstressed syllables.',
    origin: 'Developed by Gerard Manley Hopkins in the 19th century, based on Anglo-Saxon and Welsh poetry. Allows for more natural speech rhythms.',
    structure: [
      'Each foot begins with a stressed syllable',
      'Variable number of unstressed syllables (0-3)',
      'More flexible than traditional accentual-syllabic meter',
      'Closer to natural speech patterns',
      'Allows for greater rhythmic variety'
    ],
    exampleSnippet: 'I caught this morning morning\'s minion, king- / dom of daylight\'s dauphin, dapple-dawn-drawn Falcon',
    tags: ['accentual', 'modern', 'flexible'],
    seeAlso: ['Accentual Verse', 'Accentual-Syllabic Verse', 'Free Verse'],
    notes: ['Sprung rhythm allows for natural speech patterns while maintaining metrical structure. It bridges traditional meter and free verse, giving poets more flexibility.']
  },
  {
    name: 'Accentual Verse',
    type: 'Meter',
    description: 'Verse that counts only stressed syllables per line, ignoring unstressed syllables. Common in Old English poetry and modern free verse.',
    origin: 'The traditional meter of Old English poetry (Beowulf). Revived in modern poetry as a way to break from strict accentual-syllabic patterns.',
    structure: [
      'Counts only stressed syllables per line',
      'Unstressed syllables vary freely',
      'Common pattern: 4 stresses per line',
      'Allows natural speech rhythms',
      'Different from accentual-syllabic (which counts both)'
    ],
    exampleSnippet: 'So. The / Spear-Danes / in days / gone by / and the / kings who / ruled them / had courage / and greatness.'
  },
  {
    name: 'Accentual-Syllabic Verse',
    type: 'Meter',
    description: 'The most common type of meter in English poetry, which counts both stressed and unstressed syllables, organizing them into regular feet.',
    origin: 'Developed in English poetry from the 14th century onward, adapting classical quantitative meters to English stress patterns.',
    structure: [
      'Counts both stressed and unstressed syllables',
      'Organizes syllables into metrical feet',
      'Most English poetry uses this system',
      'Examples: iambic pentameter, trochaic tetrameter',
      'Allows for precise rhythmic control'
    ],
    exampleSnippet: 'But soft! what light through yonder window breaks?' // Iambic pentameter: 10 syllables, 5 iambs
  },
  {
    name: 'Syllabic Verse',
    type: 'Meter',
    description: 'Poetry that counts only the number of syllables per line, without regard to stress patterns. Common in languages like French and Japanese.',
    origin: 'Traditional in languages with less prominent stress (French, Japanese). Adapted into English by poets like Marianne Moore.',
    structure: [
      'Counts only syllables per line',
      'Stress patterns are not regulated',
      'Common in haiku (5-7-5 syllables)',
      'Allows for natural stress patterns',
      'Different from accentual-syllabic verse'
    ],
    exampleSnippet: 'An old silent pond... / A frog jumps into the pond, / splash! Silence again.' // Haiku: 5-7-5 syllables
  },
  {
    name: 'Mixed Meter',
    type: 'Meter',
    description: 'Poetry that combines different metrical patterns within a single poem or stanza, creating rhythmic variety and emphasis.',
    origin: 'Used throughout poetic history, from classical poetry to modern verse. Allows poets to vary rhythm for emphasis or mood.',
    structure: [
      'Combines different metrical feet or patterns',
      'Can alternate between meters',
      'Used for emphasis or mood changes',
      'Common in dramatic and narrative poetry',
      'Requires careful handling to maintain coherence'
    ],
    exampleSnippet: 'Tyger! Tyger! burning bright / In the forests of the night; / What immortal hand or eye / Could frame thy fearful symmetry?' // Trochaic and iambic mixed
  },
  {
    name: 'Headless Line',
    type: 'Meter',
    description: 'A line of verse that is missing the first unstressed syllable, beginning directly with a stressed syllable. Also called acephalous.',
    structure: [
      'Missing first unstressed syllable',
      'Begins with a stressed syllable',
      'Creates emphasis and variation',
      'Common in iambic and anapestic meters',
      'Same as acephalous line'
    ],
    exampleSnippet: 'Thus with the year / Seasons return' // Iambic but headless (missing first unstressed syllable)
  },
  {
    name: 'Hypercatalectic',
    type: 'Meter',
    description: 'A line of verse that has one or more extra syllables beyond the expected metrical pattern, often creating a feminine ending.',
    structure: [
      'Extra syllable(s) beyond the pattern',
      'Often creates a feminine ending',
      'Adds variation and softness',
      'Opposite of catalectic (missing syllables)',
      'Common in iambic pentameter'
    ],
    exampleSnippet: 'To be or not to be, that is the question:' // Extra syllable creates feminine ending
  },
];