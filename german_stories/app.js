// German A1 Trainer
// - 20 stories
// - Pronunciation (simple)
// - Grammar highlighting (Akk/Dativ + more preps)
// - Satzbau (sentence structure) per line
// - Auto-play + speed
// - Quiz mode (Akkusativ vs Dativ)

const STORIES = [
  {
    id: "01-morning",
    title: "1) Guten Morgen (A1)",
    lines: [
      { de: "Maria steht um sieben Uhr auf.", en: "Maria gets up at seven o’clock." },
      { de: "Sie öffnet das Fenster.", en: "She opens the window." },
      { de: "Die Luft ist kalt.", en: "The air is cold." },
      { de: "Maria zieht einen Pullover an.", en: "Maria puts on a sweater." },
      { de: "Dann geht sie ins Bad.", en: "Then she goes to the bathroom." },
      { de: "Sie wäscht ihr Gesicht.", en: "She washes her face." },
      { de: "Sie putzt ihre Zähne.", en: "She brushes her teeth." },
      { de: "Danach macht sie Frühstück.", en: "After that she makes breakfast." },
      { de: "Sie isst Brot mit Marmelade.", en: "She eats bread with jam." },
      { de: "Sie trinkt Tee.", en: "She drinks tea." },
      { de: "Sie hört leise Musik.", en: "She listens to quiet music." },
      { de: "Ihr Handy klingelt.", en: "Her phone rings." },
      { de: "Es ist eine Nachricht von ihrer Freundin.", en: "It is a message from her friend." },
      { de: "Maria lächelt.", en: "Maria smiles." },
      { de: "Dann geht sie zur Arbeit.", en: "Then she goes to work." }
    ]
  },
  {
    id: "02-school",
    title: "2) In der Schule (A1)",
    lines: [
      { de: "Jonas geht heute in die Schule.", en: "Jonas goes to school today." },
      { de: "Er kommt um acht Uhr an.", en: "He arrives at eight o’clock." },
      { de: "Der Flur ist laut.", en: "The hallway is loud." },
      { de: "Jonas hängt seine Jacke auf.", en: "Jonas hangs up his jacket." },
      { de: "Im Klassenzimmer sitzt er vorne.", en: "In the classroom he sits in the front." },
      { de: 'Die Lehrerin sagt "Guten Morgen".', en: 'The teacher says "Good morning".' },
      { de: 'Jonas sagt "Guten Morgen" zurück.', en: 'Jonas says "Good morning" back.' },
      { de: "Heute lernen sie Zahlen.", en: "Today they learn numbers." },
      { de: "Jonas schreibt langsam ins Heft.", en: "Jonas writes slowly in his notebook." },
      { de: "Er macht einen kleinen Fehler.", en: "He makes a small mistake." },
      { de: "Die Lehrerin hilft ihm freundlich.", en: "The teacher helps him kindly." },
      { de: "Dann ist Pause.", en: "Then it is break time." },
      { de: "Jonas isst einen Apfel.", en: "Jonas eats an apple." },
      { de: "Er spielt kurz mit Freunden.", en: "He plays briefly with friends." },
      { de: "Danach beginnt der nächste Unterricht.", en: "After that the next lesson begins." }
    ]
  },
  {
    id: "03-supermarket",
    title: "3) Im Supermarkt (A1)",
    lines: [
      { de: "Sara geht in den Supermarkt.", en: "Sara goes to the supermarket." },
      { de: "Sie braucht Milch und Brot.", en: "She needs milk and bread." },
      { de: "Sie nimmt einen Einkaufswagen.", en: "She takes a shopping cart." },
      { de: "Im Laden ist es hell.", en: "In the store it is bright." },
      { de: "Sara sucht das Brotregal.", en: "Sara looks for the bread shelf." },
      { de: "Sie findet Vollkornbrot.", en: "She finds whole-grain bread." },
      { de: "Dann geht sie zur Milch.", en: "Then she goes to the milk." },
      { de: "Sie nimmt eine große Milch.", en: "She takes a large milk." },
      { de: "Sie kauft auch Käse.", en: "She also buys cheese." },
      { de: "Sie sieht Bananen und nimmt drei.", en: "She sees bananas and takes three." },
      { de: "An der Kasse ist eine Schlange.", en: "At the checkout there is a line." },
      { de: "Sara wartet ruhig.", en: "Sara waits calmly." },
      { de: 'Die Kassiererin sagt "Hallo".', en: 'The cashier says "Hello".' },
      { de: "Sara bezahlt mit Karte.", en: "Sara pays by card." },
      { de: "Dann geht sie mit den Taschen nach Hause.", en: "Then she goes home with the bags." }
    ]
  },
  {
    id: "04-bus",
    title: "4) Mit dem Bus (A1)",
    lines: [
      { de: "Paul wartet an der Bushaltestelle.", en: "Paul waits at the bus stop." },
      { de: "Es ist früh am Morgen.", en: "It is early in the morning." },
      { de: "Der Himmel ist grau.", en: "The sky is gray." },
      { de: "Paul schaut auf sein Ticket.", en: "Paul looks at his ticket." },
      { de: "Der Bus kommt spät.", en: "The bus comes late." },
      { de: "Paul wird ein bisschen nervös.", en: "Paul gets a little nervous." },
      { de: "Endlich kommt der Bus.", en: "Finally the bus comes." },
      { de: 'Paul steigt ein und sagt "Hallo".', en: 'Paul gets on and says "Hello".' },
      { de: "Er setzt sich ans Fenster.", en: "He sits by the window." },
      { de: "Draußen fahren viele Autos.", en: "Outside many cars drive." },
      { de: "Eine ältere Frau steht im Gang.", en: "An older woman stands in the aisle." },
      { de: "Paul steht auf.", en: "Paul stands up." },
      { de: "Er gibt ihr seinen Platz.", en: "He gives her his seat." },
      { de: 'Die Frau sagt "Danke".', en: 'The woman says "Thank you".' },
      { de: "Paul steigt an der nächsten Station aus und geht zur Arbeit.", en: "Paul gets off at the next stop and walks to work." }
    ]
  },
  {
    id: "05-park",
    title: "5) Im Park am Samstag (A1)",
    lines: [
      { de: "Heute ist Samstag.", en: "Today is Saturday." },
      { de: "Lea hat frei.", en: "Lea is off." },
      { de: "Sie geht in den Park.", en: "She goes to the park." },
      { de: "Die Sonne scheint.", en: "The sun is shining." },
      { de: "Lea trägt eine Sonnenbrille und hat eine kleine Wasserflasche dabei.", en: "Lea wears sunglasses and has a small bottle of water with her." },
      { de: "Im Park sieht sie viele Kinder.", en: "In the park she sees many children." },
      { de: "Ein Hund läuft schnell vorbei.", en: "A dog runs quickly past." },
      { de: "Lea setzt sich auf eine Bank.", en: "Lea sits on a bench." },
      { de: "Sie hört Vögel.", en: "She hears birds." },
      { de: "Dann kommt ihre Freundin Nina.", en: "Then her friend Nina comes." },
      { de: "Nina bringt Kaffee mit.", en: "Nina brings coffee." },
      { de: "Sie reden über die Woche.", en: "They talk about the week." },
      { de: "Sie lachen viel.", en: "They laugh a lot." },
      { de: "Danach machen sie einen kurzen Spaziergang.", en: "After that they take a short walk." },
      { de: "Am Ende gehen sie zufrieden nach Hause.", en: "In the end they go home satisfied." }
    ]
  },
  {
    id: "06-doctor",
    title: "6) Beim Arzt (A1)",
    lines: [
      { de: "Karim fühlt sich nicht gut.", en: "Karim does not feel well." },
      { de: "Er hat Kopfschmerzen.", en: "He has a headache." },
      { de: "Er ruft beim Arzt an.", en: "He calls the doctor." },
      { de: "Die Sprechstunde ist am Nachmittag.", en: "The appointment time is in the afternoon." },
      { de: "Karim geht pünktlich hin.", en: "Karim goes there on time." },
      { de: "Im Wartezimmer sitzen drei Personen, und es ist sehr still.", en: "Three people sit in the waiting room, and it is very quiet." },
      { de: "Karim liest ein Magazin.", en: "Karim reads a magazine." },
      { de: "Dann ruft die Ärztin seinen Namen.", en: "Then the doctor calls his name." },
      { de: "Karim geht ins Zimmer.", en: "Karim goes into the room." },
      { de: "Die Ärztin fragt nach den Schmerzen.", en: "The doctor asks about the pain." },
      { de: "Karim sagt, seit gestern tut der Kopf weh.", en: "Karim says his head has hurt since yesterday." },
      { de: "Die Ärztin misst Fieber.", en: "The doctor checks his temperature." },
      { de: "Karim hat kein Fieber.", en: "Karim has no fever." },
      { de: "Er bekommt Tabletten und einen Tipp: viel Wasser trinken.", en: "He gets tablets and a tip: drink a lot of water." },
      { de: "Karim geht erleichtert nach Hause.", en: "Karim goes home relieved." }
    ]
  },
  {
    id: "07-library",
    title: "7) In der Bibliothek (A1)",
    lines: [
      { de: "Emma geht in die Bibliothek.", en: "Emma goes to the library." },
      { de: "Sie braucht ein Buch für Deutsch.", en: "She needs a book for German." },
      { de: "Die Bibliothek ist groß und es riecht nach Papier.", en: "The library is big and it smells like paper." },
      { de: "Emma spricht leise.", en: "Emma speaks quietly." },
      { de: "Sie sucht ein einfaches Buch.", en: "She looks for an easy book." },
      { de: "Eine Mitarbeiterin hilft ihr.", en: "A staff member helps her." },
      { de: "Emma findet ein Buch mit Bildern.", en: "Emma finds a book with pictures." },
      { de: "Sie setzt sich an einen Tisch am Fenster.", en: "She sits at a table by the window." },
      { de: "Draußen regnet es.", en: "Outside it is raining." },
      { de: "Emma liest zehn Seiten.", en: "Emma reads ten pages." },
      { de: "Dann macht sie eine Pause.", en: "Then she takes a break." },
      { de: "Sie trinkt Wasser.", en: "She drinks water." },
      { de: "Sie schreibt neue Wörter auf.", en: "She writes down new words." },
      { de: "Danach leiht sie das Buch aus.", en: "After that she borrows the book." },
      { de: "Emma geht ruhig nach Hause.", en: "Emma goes home calmly." }
    ]
  },
  {
    id: "08-cooking",
    title: "8) Kochen zu Hause (A1)",
    lines: [
      { de: "Ben kocht heute zu Hause.", en: "Ben cooks at home today." },
      { de: "Er möchte Nudeln machen.", en: "He wants to make pasta." },
      { de: "Er wäscht zuerst seine Hände.", en: "First he washes his hands." },
      { de: "Dann nimmt er einen Topf.", en: "Then he takes a pot." },
      { de: "Er füllt Wasser hinein.", en: "He fills water into it." },
      { de: "Er macht den Herd an.", en: "He turns on the stove." },
      { de: "Das Wasser wird heiß.", en: "The water gets hot." },
      { de: "Ben gibt Salz dazu.", en: "Ben adds salt." },
      { de: "Dann kommen die Nudeln ins Wasser.", en: "Then the pasta goes into the water." },
      { de: "Ben schneidet Tomaten und auch Zwiebeln.", en: "Ben cuts tomatoes and also onions." },
      { de: "In einer Pfanne brät er die Zwiebeln.", en: "In a pan he fries the onions." },
      { de: "Danach gibt er die Tomaten dazu.", en: "After that he adds the tomatoes." },
      { de: "Die Soße riecht gut.", en: "The sauce smells good." },
      { de: "Ben probiert die Soße.", en: "Ben tastes the sauce." },
      { de: "Am Ende isst er zufrieden und macht die Küche sauber.", en: "In the end he eats happily and cleans the kitchen." }
    ]
  },
  {
    id: "09-birthday",
    title: "9) Geburtstag (A1)",
    lines: [
      { de: "Heute hat Lina Geburtstag.", en: "Today it is Lina’s birthday." },
      { de: "Sie wird zwanzig Jahre alt.", en: "She turns twenty years old." },
      { de: "Am Morgen bekommt sie eine Nachricht von ihrer Mutter.", en: "In the morning she gets a message from her mother." },
      { de: "Lina freut sich sehr.", en: "Lina is very happy." },
      { de: "Sie macht Kaffee und frühstückt.", en: "She makes coffee and has breakfast." },
      { de: "Dann dekoriert sie das Wohnzimmer.", en: "Then she decorates the living room." },
      { de: "Sie hängt Ballons auf.", en: "She puts up balloons." },
      { de: "Am Nachmittag kommen drei Freunde.", en: "In the afternoon three friends come." },
      { de: "Sie bringen kleine Geschenke mit.", en: "They bring small gifts." },
      { de: 'Lina sagt "Danke" und umarmt sie.', en: 'Lina says "Thank you" and hugs them.' },
      { de: "Sie hören Musik und essen Pizza.", en: "They listen to music and eat pizza." },
      { de: "Danach essen sie Kuchen.", en: "After that they eat cake." },
      { de: "Lina bläst die Kerzen aus.", en: "Lina blows out the candles." },
      { de: "Alle klatschen.", en: "Everyone claps." },
      { de: "Am Abend macht Lina Fotos und fühlt sich glücklich.", en: "In the evening Lina takes photos and feels happy." }
    ]
  },
  {
    id: "10-rainy-day",
    title: "10) Ein regnerischer Tag (A1)",
    lines: [
      { de: "Es regnet den ganzen Tag.", en: "It rains all day." },
      { de: "Tim schaut aus dem Fenster, und die Straße ist nass.", en: "Tim looks out the window, and the street is wet." },
      { de: "Tim hat keinen Unterricht.", en: "Tim has no class." },
      { de: "Er bleibt zu Hause.", en: "He stays at home." },
      { de: "Er macht sich einen Kakao.", en: "He makes himself a hot cocoa." },
      { de: "Dann setzt er sich aufs Sofa.", en: "Then he sits on the sofa." },
      { de: "Er liest ein kurzes Buch.", en: "He reads a short book." },
      { de: "Später ruft sein Bruder an.", en: "Later his brother calls." },
      { de: "Sie sprechen über das Wochenende, und Tim hört den Regen im Hintergrund.", en: "They talk about the weekend, and Tim hears the rain in the background." },
      { de: "Dann kocht Tim eine Suppe.", en: "Then Tim cooks a soup." },
      { de: "Die Suppe ist warm und lecker.", en: "The soup is warm and tasty." },
      { de: "Am Nachmittag macht er ein Puzzle.", en: "In the afternoon he does a puzzle." },
      { de: "Abends schaut er einen Film.", en: "In the evening he watches a movie." },
      { de: "Vor dem Schlafen macht er das Licht aus.", en: "Before sleeping he turns off the light." },
      { de: "Tim ist ruhig und zufrieden.", en: "Tim feels calm and content." }
    ]
  },
  {
    id: "11-new-apartment",
    title: "11) Die neue Wohnung (A1)",
    lines: [
      { de: "Nora hat eine neue Wohnung.", en: "Nora has a new apartment." },
      { de: "Heute zieht sie ein.", en: "Today she moves in." },
      { de: "Sie trägt Kartons die Treppe hoch, und es ist anstrengend.", en: "She carries boxes up the stairs, and it is tiring." },
      { de: "Ihr Freund hilft ihr.", en: "Her friend helps her." },
      { de: "In der Wohnung ist alles leer.", en: "In the apartment everything is empty." },
      { de: "Nora stellt zuerst das Bett auf.", en: "Nora sets up the bed first." },
      { de: "Dann stellt sie den Tisch in die Küche.", en: "Then she puts the table in the kitchen." },
      { de: "Sie öffnet alle Fenster.", en: "She opens all the windows." },
      { de: "Frische Luft kommt rein.", en: "Fresh air comes in." },
      { de: "Nora packt Teller und Gläser aus.", en: "Nora unpacks plates and glasses." },
      { de: "Danach hängt sie ein Bild an die Wand.", en: "After that she hangs a picture on the wall." },
      { de: "Sie sucht ihre Zahnbürste im Karton.", en: "She looks for her toothbrush in a box." },
      { de: "Endlich findet sie sie.", en: "Finally she finds it." },
      { de: "Am Abend bestellen sie Essen.", en: "In the evening they order food." },
      { de: "Nora sitzt auf dem Boden, lacht und fühlt sich schon ein bisschen zu Hause.", en: "Nora sits on the floor, laughs, and already feels a little at home." }
    ]
  },
  {
    id: "12-phone-call",
    title: "12) Ein Telefonat (A1)",
    lines: [
      { de: "Alex sitzt zu Hause.", en: "Alex sits at home." },
      { de: "Er wartet auf einen Anruf.", en: "He is waiting for a call." },
      { de: "Sein Handy liegt auf dem Tisch.", en: "His phone is on the table." },
      { de: "Alex trinkt Wasser.", en: "Alex drinks water." },
      { de: "Dann klingelt das Handy.", en: "Then the phone rings." },
      { de: "Es ist seine Schwester.", en: "It is his sister." },
      { de: 'Alex sagt "Hallo", und sie sagt "Hallo, wie geht\'s?".', en: 'Alex says "Hello", and she says "Hello, how are you?".' },
      { de: 'Alex sagt "Gut".', en: 'Alex says "Good".' },
      { de: "Seine Schwester erzählt von ihrer Arbeit.", en: "His sister talks about her job." },
      { de: "Alex hört aufmerksam zu.", en: "Alex listens carefully." },
      { de: "Dann erzählt Alex von seinem Tag.", en: "Then Alex talks about his day." },
      { de: "Sie lachen über eine kleine Geschichte.", en: "They laugh about a small story." },
      { de: "Danach sprechen sie über das Essen.", en: "After that they talk about food." },
      { de: "Alex sagt, er kocht heute Reis, und seine Schwester kocht Salat.", en: "Alex says he cooks rice today, and his sister makes salad." },
      { de: 'Sie sagen "Bis später", und Alex legt auf und lächelt.', en: 'They say "See you later", and Alex hangs up and smiles.' }
    ]
  },
  {
    id: "13-lake",
    title: "13) Am See (A1)",
    lines: [
      { de: "Es ist Sommer.", en: "It is summer." },
      { de: "Mila fährt mit dem Fahrrad zum See.", en: "Mila rides her bike to the lake." },
      { de: "Der Weg ist nicht lang.", en: "The way is not long." },
      { de: "Am See ist es ruhig, und das Wasser glitzert.", en: "At the lake it is quiet, and the water sparkles." },
      { de: "Mila setzt sich auf das Gras.", en: "Mila sits on the grass." },
      { de: "Sie zieht die Schuhe aus.", en: "She takes off her shoes." },
      { de: "Dann steckt sie die Füße ins Wasser.", en: "Then she puts her feet into the water." },
      { de: "Das Wasser ist kalt.", en: "The water is cold." },
      { de: "Mila lacht leise.", en: "Mila laughs softly." },
      { de: "Sie isst ein Sandwich.", en: "She eats a sandwich." },
      { de: "Ein Mann fährt mit einem Boot vorbei.", en: "A man passes by in a boat." },
      { de: "Kinder spielen am Ufer.", en: "Children play at the shore." },
      { de: "Mila macht ein Foto mit dem Handy.", en: "Mila takes a photo with her phone." },
      { de: "Dann liest sie ein paar Seiten und schwimmt später kurz.", en: "Then she reads a few pages and later swims for a short time." },
      { de: "Am Ende fährt sie nach Hause und fühlt sich frisch.", en: "In the end she rides home and feels fresh." }
    ]
  },
  {
    id: "14-zoo",
    title: "14) Im Zoo (A1)",
    lines: [
      { de: "Oskar geht heute in den Zoo.", en: "Oskar goes to the zoo today." },
      { de: "Er kauft ein Ticket am Eingang.", en: "He buys a ticket at the entrance." },
      { de: "Dann bekommt er einen Plan.", en: "Then he gets a map." },
      { de: "Oskar geht zuerst zu den Löwen.", en: "Oskar goes to the lions first." },
      { de: "Die Löwen schlafen im Schatten.", en: "The lions sleep in the shade." },
      { de: "Oskar macht ein Foto.", en: "Oskar takes a photo." },
      { de: "Danach sieht er Affen, und die Affen springen und schreien.", en: "After that he sees monkeys, and the monkeys jump and scream." },
      { de: "Oskar lacht.", en: "Oskar laughs." },
      { de: "Dann geht er zu den Elefanten.", en: "Then he goes to the elephants." },
      { de: "Ein Elefant trinkt Wasser.", en: "One elephant drinks water." },
      { de: "Oskar sieht auch Giraffen.", en: "Oskar also sees giraffes." },
      { de: "Die Giraffen fressen Blätter.", en: "The giraffes eat leaves." },
      { de: "Später isst Oskar ein Eis und setzt sich auf eine Bank.", en: "Later Oskar eats an ice cream and sits on a bench." },
      { de: "Ein kleines Kind winkt ihm zu.", en: "A small child waves at him." },
      { de: "Am Ende geht Oskar müde, aber glücklich nach Hause.", en: "In the end Oskar goes home tired but happy." }
    ]
  },
  {
    id: "15-clothes",
    title: "15) Neue Kleidung (A1)",
    lines: [
      { de: "Hannah möchte eine neue Jacke kaufen.", en: "Hannah wants to buy a new jacket." },
      { de: "Sie geht in ein Geschäft in der Stadt.", en: "She goes to a store in the city." },
      { de: "Im Laden gibt es viele Farben.", en: "In the store there are many colors." },
      { de: "Hannah sieht eine blaue Jacke.", en: "Hannah sees a blue jacket." },
      { de: "Sie nimmt sie vom Regal.", en: "She takes it from the shelf." },
      { de: "Dann probiert sie die Jacke an.", en: "Then she tries on the jacket." },
      { de: "Die Jacke ist ein bisschen zu groß.", en: "The jacket is a little too big." },
      { de: "Hannah probiert eine kleinere Größe.", en: "Hannah tries a smaller size." },
      { de: "Jetzt passt sie besser.", en: "Now it fits better." },
      { de: "Hannah schaut in den Spiegel und dreht sich langsam.", en: "Hannah looks in the mirror and turns slowly." },
      { de: 'Eine Verkäuferin fragt "Brauchen Sie Hilfe?".', en: 'A saleswoman asks "Do you need help?".' },
      { de: 'Hannah sagt "Nein, danke".', en: 'Hannah says "No, thank you".' },
      { de: "Dann geht Hannah zur Kasse.", en: "Then Hannah goes to the checkout." },
      { de: "Sie bezahlt und bekommt eine Tüte.", en: "She pays and gets a bag." },
      { de: "Draußen ist es kalt, und Hannah zieht die neue Jacke sofort an.", en: "Outside it is cold, and Hannah puts on the new jacket right away." }
    ]
  },
  {
    id: "16-train",
    title: "16) Mit dem Zug (A1)",
    lines: [
      { de: "Felix fährt mit dem Zug in eine andere Stadt.", en: "Felix travels by train to another city." },
      { de: "Er steht früh auf.", en: "He gets up early." },
      { de: "Er nimmt seinen Rucksack.", en: "He takes his backpack." },
      { de: "Am Bahnhof kauft er ein Ticket.", en: "At the station he buys a ticket." },
      { de: "Dann schaut er auf die Anzeige.", en: "Then he looks at the display." },
      { de: "Sein Zug kommt in zehn Minuten.", en: "His train arrives in ten minutes." },
      { de: "Felix wartet auf dem Bahnsteig.", en: "Felix waits on the platform." },
      { de: "Der Zug fährt ein.", en: "The train pulls in." },
      { de: "Felix steigt ein und findet einen Platz.", en: "Felix gets on and finds a seat." },
      { de: "Neben ihm sitzt ein Mann mit einem Buch.", en: "Next to him sits a man with a book." },
      { de: "Felix schaut aus dem Fenster, und die Felder sind grün.", en: "Felix looks out the window, and the fields are green." },
      { de: "Der Zug ist ruhig.", en: "The train is quiet." },
      { de: "Felix trinkt Wasser und isst einen Keks.", en: "Felix drinks water and eats a cookie." },
      { de: "Dann kommt der Kontrolleur, und Felix zeigt das Ticket.", en: "Then the inspector comes, and Felix shows the ticket." },
      { de: "Nach einer Stunde kommt der Zug an, und Felix steigt aus und fühlt sich bereit für den Tag.", en: "After an hour the train arrives, and Felix gets off and feels ready for the day." }
    ]
  },
  {
    id: "17-grandma",
    title: "17) Bei Oma (A1)",
    lines: [
      { de: "Am Sonntag besucht Jana ihre Oma.", en: "On Sunday Jana visits her grandma." },
      { de: "Jana bringt Blumen mit.", en: "Jana brings flowers." },
      { de: "Die Oma öffnet die Tür und lächelt.", en: "Grandma opens the door and smiles." },
      { de: "Jana zieht ihre Schuhe aus.", en: "Jana takes off her shoes." },
      { de: "Dann gehen sie in die Küche.", en: "Then they go into the kitchen." },
      { de: "Die Oma macht Kaffee.", en: "Grandma makes coffee." },
      { de: "Jana hilft mit den Tassen.", en: "Jana helps with the cups." },
      { de: "Sie setzen sich an den Tisch.", en: "They sit at the table." },
      { de: "Die Oma fragt nach der Arbeit.", en: "Grandma asks about work." },
      { de: "Jana erzählt von ihrem Chef.", en: "Jana talks about her boss." },
      { de: "Die Oma hört aufmerksam zu.", en: "Grandma listens carefully." },
      { de: "Dann spricht die Oma über den Garten.", en: "Then grandma talks about the garden." },
      { de: "Sie zeigt Fotos von neuen Blumen.", en: "She shows photos of new flowers." },
      { de: "Jana isst ein Stück Apfelkuchen.", en: "Jana eats a piece of apple cake." },
      { de: 'Danach gehen sie kurz spazieren, und am Ende umarmt Jana ihre Oma und sagt "Bis bald".', en: 'After that they take a short walk, and at the end Jana hugs her grandma and says "See you soon".' }
    ]
  },
  {
    id: "18-lost-key",
    title: "18) Der verlorene Schlüssel (A1)",
    lines: [
      { de: "Erik kommt nach Hause.", en: "Erik comes home." },
      { de: "Er sucht seinen Schlüssel.", en: "He looks for his key." },
      { de: "In der Tasche ist kein Schlüssel, und Erik wird nervös.", en: "There is no key in his bag, and Erik gets nervous." },
      { de: "Er schaut in seine Jacke, aber dort ist auch kein Schlüssel.", en: "He checks his jacket, but there is no key there either." },
      { de: "Erik geht zurück zur Bushaltestelle.", en: "Erik goes back to the bus stop." },
      { de: "Er schaut auf den Boden.", en: "He looks at the ground." },
      { de: "Er sieht nichts.", en: "He sees nothing." },
      { de: "Dann fragt er eine Frau.", en: "Then he asks a woman." },
      { de: 'Die Frau sagt "Nein, leider nicht".', en: 'The woman says "No, unfortunately not".' },
      { de: "Erik geht weiter und denkt nach.", en: "Erik walks on and thinks." },
      { de: "Er war im Supermarkt.", en: "He was at the supermarket." },
      { de: "Er geht zum Supermarkt zurück.", en: "He goes back to the supermarket." },
      { de: "Am Eingang fragt er den Mann an der Information.", en: "At the entrance he asks the man at the information desk." },
      { de: "Der Mann zeigt eine kleine Kiste, und in der Kiste liegt ein Schlüssel.", en: "The man shows a small box, and in the box there is a key." },
      { de: 'Erik sagt "Das ist meiner!", bedankt sich und geht glücklich nach Hause.', en: 'Erik says "That is mine!", thanks him, and goes home happy.' }
    ]
  },
  {
    id: "19-first-day",
    title: "19) Der erste Arbeitstag (A1)",
    lines: [
      { de: "Sofie hat heute ihren ersten Arbeitstag.", en: "Sofie has her first day at work today." },
      { de: "Sie steht früh auf.", en: "She gets up early." },
      { de: "Sie zieht ein sauberes Hemd an.", en: "She puts on a clean shirt." },
      { de: "Dann isst sie ein kleines Frühstück.", en: "Then she eats a small breakfast." },
      { de: "Sofie nimmt den Bus ins Büro.", en: "Sofie takes the bus to the office." },
      { de: "Sie kommt zehn Minuten zu früh an.", en: "She arrives ten minutes early." },
      { de: "Das Gebäude ist groß.", en: "The building is big." },
      { de: "Sofie geht zur Rezeption.", en: "Sofie goes to the reception." },
      { de: "Eine Frau sagt ihren Namen.", en: "A woman says her name." },
      { de: "Dann kommt der Chef.", en: "Then the boss comes." },
      { de: "Er begrüßt Sofie freundlich.", en: "He greets Sofie kindly." },
      { de: "Er zeigt ihr den Arbeitsplatz, und Sofie bekommt einen Computer.", en: "He shows her the workspace, and Sofie gets a computer." },
      { de: "Eine Kollegin zeigt Sofie die Küche.", en: "A colleague shows Sofie the kitchen." },
      { de: "Sofie trinkt einen Kaffee und isst am Mittag mit den Kollegen.", en: "Sofie drinks a coffee and eats lunch with the colleagues." },
      { de: "Am Ende des Tages ist Sofie müde, aber stolz.", en: "At the end of the day Sofie is tired but proud." }
    ]
  },
  {
    id: "20-christmas-market",
    title: "20) Auf dem Weihnachtsmarkt (A1)",
    lines: [
      { de: "Es ist Dezember.", en: "It is December." },
      { de: "Ben und Lara gehen auf den Weihnachtsmarkt.", en: "Ben and Lara go to the Christmas market." },
      { de: "Es ist kalt, aber schön.", en: "It is cold but beautiful." },
      { de: "Viele Lichter sind an.", en: "Many lights are on." },
      { de: "Ben riecht gebrannte Mandeln.", en: "Ben smells roasted almonds." },
      { de: "Lara sieht einen Stand mit Tassen.", en: "Lara sees a stand with cups." },
      { de: "Sie kaufen heißen Tee, und der Tee wärmt die Hände.", en: "They buy hot tea, and the tea warms their hands." },
      { de: "Dann hören sie Musik.", en: "Then they hear music." },
      { de: "Ein Mann spielt Geige.", en: "A man plays the violin." },
      { de: "Ben und Lara gehen langsam weiter.", en: "Ben and Lara walk slowly on." },
      { de: "Sie schauen auf die Dekoration.", en: "They look at the decorations." },
      { de: "Lara kauft ein kleines Geschenk.", en: "Lara buys a small gift." },
      { de: "Ben kauft ein Brot mit Käse.", en: "Ben buys a bread roll with cheese." },
      { de: "Sie setzen sich kurz auf eine Bank, und ein Kind lacht neben ihnen.", en: "They sit on a bench for a short time, and a child laughs next to them." },
      { de: 'Ben macht ein Foto von den Lichtern, und am Ende gehen sie nach Hause und sagen: "Das war ein guter Abend".', en: 'Ben takes a photo of the lights, and in the end they go home and say: "That was a good evening".' }
    ]
  }
];

// ---------- Pronunciation (simple/learner-friendly) ----------
function phoneticDE(text){
  let t = String(text).toLowerCase();
  t = t.replaceAll("„", '"').replaceAll("“", '"').replaceAll("’", "'");

  t = t.replace(/\bsp/g, "shp");
  t = t.replace(/\bst/g, "sht");

  t = t.replaceAll("tsch", "ch");
  t = t.replaceAll("sch", "sh");

  t = t.replaceAll("ie", "ee");
  t = t.replaceAll("ei", "eye");
  t = t.replaceAll("eu", "oy");
  t = t.replaceAll("äu", "oy");
  t = t.replaceAll("au", "ow");

  t = t.replaceAll("ch", "kh");
  t = t.replaceAll("ck", "k");
  t = t.replaceAll("z", "ts");
  t = t.replaceAll("j", "y");
  t = t.replaceAll("w", "v");
  t = t.replaceAll("v", "f");
  t = t.replaceAll("ß", "ss");

  t = t.replaceAll("ä", "eh");
  t = t.replaceAll("ö", "ur");
  t = t.replaceAll("ü", "ew");

  return t.replace(/\s+/g, " ").trim();
}

// ---------- Grammar rules (A1-focused, best-effort) ----------
const GRAMMAR_RULES = [
  // contractions / clear dat-acc
  { p: "\\bins\\b", f: "gi", kase: "acc", tip: "ins = in das → Akkusativ (wohin?)", note: (m)=> `"${m}" = in das → Akkusativ (direction wohin?)` },
  { p: "\\bim\\b", f: "gi", kase: "dat", tip: "im = in dem → Dativ (wo?)", note: (m)=> `"${m}" = in dem → Dativ (location wo?)` },
  { p: "\\bam\\b", f: "gi", kase: "dat", tip: "am = an dem → Dativ", note: (m)=> `"${m}" = an dem → Dativ` },
  { p: "\\bans\\b", f: "gi", kase: "acc", tip: "ans = an das → Akkusativ (wohin?)", note: (m)=> `"${m}" = an das → Akkusativ (direction wohin?)` },
  { p: "\\bbeim\\b", f: "gi", kase: "dat", tip: "beim = bei dem → Dativ", note: (m)=> `"${m}" = bei dem → Dativ (bei + Dativ)` },
  { p: "\\bzum\\b", f: "gi", kase: "dat", tip: "zum = zu dem → Dativ", note: (m)=> `"${m}" = zu dem → Dativ (zu + Dativ)` },
  { p: "\\bzur\\b", f: "gi", kase: "dat", tip: "zur = zu der → Dativ", note: (m)=> `"${m}" = zu der → Dativ (zu + Dativ)` },
  { p: "\\bvom\\b", f: "gi", kase: "dat", tip: "vom = von dem → Dativ", note: (m)=> `"${m}" = von dem → Dativ (von + Dativ)` },

  // dative prepositions (mit/bei/zu/von/aus/nach/seit) with common chunks
  { p: "\\bmit (dem|der|den)\\b", f: "gi", kase: "dat", tip: "mit + Dativ", note: (m)=> `"${m}" → Dativ after "mit"` },
  { p: "\\bbei (dem|der)\\b", f: "gi", kase: "dat", tip: "bei + Dativ", note: (m)=> `"${m}" → Dativ after "bei"` },
  { p: "\\baus (dem|der)\\b", f: "gi", kase: "dat", tip: "aus + Dativ", note: (m)=> `"${m}" → Dativ after "aus"` },
  { p: "\\bnach Hause\\b", f: "gi", kase: "dat", tip: "nach + Dativ (no article) → nach Hause", note: (m)=> `"${m}" → nach + Dativ (fixed phrase)` },
  { p: "\\bzu Hause\\b", f: "gi", kase: "dat", tip: "zu + Dativ → zu Hause", note: (m)=> `"${m}" → zu + Dativ (fixed phrase)` },
  { p: "\\bseit\\b", f: "gi", kase: "dat", tip: "seit + Dativ (since)", note: (m)=> `"${m}" → seit + Dativ` },
  { p: "\\bv(on|om)\\b", f: "gi", kase: "dat", tip: "von + Dativ (from/of)", note: (m)=> `"${m}" → von + Dativ` },
  { p: "\\bzu\\b", f: "gi", kase: "dat", tip: "zu + Dativ (to/at)", note: (m)=> `"${m}" → zu + Dativ` },

  // two-way preps (in/auf/an) - we show common chunks
  { p: "\\bin (den|die|das)\\b", f: "gi", kase: "acc", tip: "in + Akkusativ → direction (wohin?)", note: (m)=> `"${m}" → Akkusativ with "in" (direction wohin?)` },
  { p: "\\bin (dem|der)\\b", f: "gi", kase: "dat", tip: "in + Dativ → location (wo?)", note: (m)=> `"${m}" → Dativ with "in" (location wo?)` },
  { p: "\\bauf (den|die|das)\\b", f: "gi", kase: "acc", tip: "auf + Akkusativ → direction", note: (m)=> `"${m}" → Akkusativ with "auf" (direction)` },
  { p: "\\bauf (dem|der)\\b", f: "gi", kase: "dat", tip: "auf + Dativ → location", note: (m)=> `"${m}" → Dativ with "auf" (location)` },
  { p: "\\ban (den|die|das)\\b", f: "gi", kase: "acc", tip: "an + Akkusativ → direction", note: (m)=> `"${m}" → Akkusativ with "an" (direction)` },
  { p: "\\ban (dem|der)\\b", f: "gi", kase: "dat", tip: "an + Dativ → location", note: (m)=> `"${m}" → Dativ with "an" (location)` },

  // accusative-only prepositions (für/ohne/durch/gegen) with common chunks
  { p: "\\b(für|ohne|durch|gegen) (den|die|das|einen|eine)\\b", f: "gi", kase: "acc",
    tip: "für/ohne/durch/gegen + Akkusativ",
    note: (m)=> `"${m}" → Akkusativ after (für/ohne/durch/gegen)`
  },

  // clear article forms
  { p: "\\beinen\\b", f: "gi", kase: "acc", tip: "einen = Akkusativ (maskulin)", note: (m)=> `"${m}" = Akkusativ (maskulin)` },
  { p: "\\beinem\\b", f: "gi", kase: "dat", tip: "einem = Dativ (maskulin/neutrum)", note: (m)=> `"${m}" = Dativ (mask./neutr.)` }
];

function grammarAnalyze(text){
  const raw = [];
  for(const r of GRAMMAR_RULES){
    const re = new RegExp(r.p, r.f);
    let m;
    while((m = re.exec(text)) !== null){
      raw.push({ start: m.index, end: m.index + m[0].length, matchText: m[0], rule: r });
    }
  }
  raw.sort((a,b)=> (a.start-b.start) || ((b.end-b.start)-(a.end-a.start)));

  const accepted = [];
  let lastEnd = -1;
  for(const m of raw){
    if(m.start >= lastEnd){
      accepted.push(m);
      lastEnd = m.end;
    }
  }

  const notesSet = new Set();
  let html = "";
  let pos = 0;

  for(const m of accepted){
    html += escapeHtml(text.slice(pos, m.start));
    html += wrapGrammar(m.matchText, m.rule.kase, m.rule.tip);
    notesSet.add(m.rule.note(m.matchText));
    pos = m.end;
  }
  html += escapeHtml(text.slice(pos));
  return { html, notes: Array.from(notesSet), matches: accepted };
}

function wrapGrammar(token, kase, tip){
  const klass = kase === "acc" ? "gram gram-acc" : "gram gram-dat";
  return `<span class="${klass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${escapeAttr(tip)}">${escapeHtml(token)}</span>`;
}

// ---------- Satzbau (structure) ----------
const VERB_FORMS = new Set([
  "bin","bist","ist","sind","seid","war","waren",
  "hat","haben","wird","werden",
  "geht","gehe","gehen","kam","kommt","kommen",
  "steht","stehen","öffnet","öffnen","zieht","ziehen","wäscht","waschen","putzt","putzen",
  "macht","machen","isst","essen","trinkt","trinken","hört","hören","klingelt","klingeln",
  "bekommt","bekommen","lächelt","lächeln","hängt","hängen","sitzt","sitzen","sagt","sagen",
  "lernen","lernt","schreibt","schreiben","hilft","helfen","beginnt","beginnen",
  "braucht","brauchen","nimmt","nehmen","sucht","suchen","findet","finden","kauft","kaufen",
  "wartet","warten","bezahlt","bezahlen","fährt","fahren","steigt","steigen","setzt","setzen",
  "bringt","bringen","reden","lacht","lachen","fühlt","fühlen","ruft","rufen","liest","lesen",
  "misst","messen","kocht","kochen","probiert","probieren","bläst","blasen","klatschen","klatscht",
  "bleibt","bleiben","bestellen","bestellt","liegt","liegen","erzählt","erzählen","spielt","spielen",
  "glitzert","glitzern","steckt","stecken","umarmt","umarmen","zeigt","zeigen","passt","passen",
  "fragt","fragen","dreht","drehen","fressen","fressen"
]);

const SEPARABLE_PREFIXES = new Set(["auf","an","aus","ein","zurück"]);
const STARTERS = new Set(["heute","dann","danach","später","endlich","am","im","in","beim","zum","zur","draußen","vor","nach"]);

function stripPunct(w){ return w.replace(/[.,!?":;()]/g, ""); }

function analyzeStructure(sentence, matches){
  const tokens = sentence.split(/\s+/).filter(Boolean);
  if(tokens.length === 0) return { chips: [], formula: "", steps: [] };

  const lastCore = stripPunct(tokens[tokens.length-1]).toLowerCase();
  const hasPrefix = SEPARABLE_PREFIXES.has(lastCore);

  let verbIdx = -1;
  for(let i=0;i<tokens.length;i++){
    const w = stripPunct(tokens[i]).toLowerCase();
    if(VERB_FORMS.has(w)){
      verbIdx = i;
      break;
    }
  }
  if(verbIdx === -1){
    return {
      chips: [{ label:"Rest", text: sentence, cls:"chip chip-rest"}],
      formula: "Subjekt + Verb (2) + Rest",
      steps: ["(No clear verb detected in this simple rule set.)"]
    };
  }

  // POS1 (optional): if sentence starts with starter and there's something before verb
  const first = stripPunct(tokens[0]).toLowerCase();
  const hasPos1 = STARTERS.has(first) && verbIdx > 0;

  const pos1Text = hasPos1 ? tokens.slice(0, verbIdx).join(" ") : "";
  const verbText = stripPunct(tokens[verbIdx]);

  let subjText = "";
  if(hasPos1){
    subjText = tokens[verbIdx+1] ? stripPunct(tokens[verbIdx+1]) : "";
  } else {
    subjText = tokens.slice(0, verbIdx).join(" ");
  }

  // Rest (after verb + subject (if pos1))
  let restStart = hasPos1 ? verbIdx + 2 : verbIdx + 1;
  let restEnd = hasPrefix ? tokens.length - 1 : tokens.length;
  if(restStart < 0) restStart = 0;
  if(restEnd < restStart) restEnd = restStart;
  const restText = tokens.slice(restStart, restEnd).join(" ");

  const chips = [];
  if(pos1Text) chips.push({label:"Pos 1", text: pos1Text, cls:"chip chip-p1"});
  chips.push({label:"Verb (2)", text: verbText, cls:"chip chip-verb"});
  if(subjText) chips.push({label:"Subjekt", text: subjText, cls:"chip chip-subj"});
  if(restText) chips.push({label:"Rest", text: restText, cls:"chip chip-rest"});
  if(hasPrefix) chips.push({label:"Prefix", text: stripPunct(tokens[tokens.length-1]), cls:"chip chip-verb"});

  // add case hints from matches (compact)
  const caseHints = [];
  for(const m of matches || []){
    if(m.rule?.kase === "acc") caseHints.push(`Akk: ${m.matchText}`);
    if(m.rule?.kase === "dat") caseHints.push(`Dat: ${m.matchText}`);
  }
  if(caseHints.length){
    chips.push({label:"Cases", text: caseHints.join(" • "), cls:"chip chip-rest"});
  }

  const formula = hasPos1
    ? "Pos 1 (Zeit/Ort) + Verb (2) + Subjekt + Rest (+ Prefix am Ende)"
    : "Subjekt + Verb (2) + Rest (+ Prefix am Ende)";

  const steps = [
    "1) Optional: start with Zeit/Ort (Position 1).",
    "2) Put the verb in Position 2.",
    "3) Put the subject (if Zeit/Ort is first, subject goes after the verb).",
    "4) Add object (Akk) and place/time details (often Dat).",
    "5) If the verb is separable: prefix goes to the end."
  ];

  return { chips, formula, steps };
}

// ---------- Theme ----------
function setTheme(mode){
  document.documentElement.setAttribute("data-bs-theme", mode);
  localStorage.setItem("theme", mode);

  const t = document.getElementById("themeToggle");
  const lbl = document.querySelector('label[for="themeToggle"]');
  const isDark = mode === "dark";
  if(t) t.checked = isDark;
  if(lbl) lbl.textContent = isDark ? "Dark" : "Light";
}
function initThemeToggle(){
  const saved = localStorage.getItem("theme");
  setTheme(saved || document.documentElement.getAttribute("data-bs-theme") || "dark");

  const t = document.getElementById("themeToggle");
  if(!t) return;
  t.addEventListener("change", () => setTheme(t.checked ? "dark" : "light"));
}

// ---------- TTS + Autoplay ----------
function ttsSupported(){
  return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
}
function getRate(){
  const sel = document.getElementById("ttsRate");
  const v = sel ? parseFloat(sel.value) : 0.95;
  return Number.isFinite(v) ? v : 0.95;
}
function speakGerman(text, {rate=0.95, onEnd=null} = {}){
  if(!ttsSupported()) return;
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = rate;
  if(onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

const autoplay = {
  active: false,
  paused: false,
  idx: 0,
  storyId: null
};

function setAutoplayButtons(){
  const btnPlay = document.getElementById("btnPlayAll");
  const btnPause = document.getElementById("btnPauseResume");
  const btnStop = document.getElementById("btnStop");

  const active = autoplay.active;
  if(btnPlay) btnPlay.disabled = active;
  if(btnPause) btnPause.disabled = !active;
  if(btnStop) btnStop.disabled = !active;

  if(btnPause){
    btnPause.textContent = autoplay.paused ? "▶ Resume" : "⏸ Pause";
  }
}

function stopAutoplay(){
  autoplay.active = false;
  autoplay.paused = false;
  autoplay.idx = 0;
  window.speechSynthesis.cancel();
  setAutoplayButtons();
}

function playAutoplayFrom(index=0){
  const story = getCurrentStory();
  if(!story) return;

  autoplay.active = true;
  autoplay.paused = false;
  autoplay.storyId = story.id;
  autoplay.idx = index;

  setAutoplayButtons();
  playNextAutoplayLine();
}

function playNextAutoplayLine(){
  const story = getCurrentStory();
  if(!story || !autoplay.active) return;

  if(autoplay.idx >= story.lines.length){
    stopAutoplay();
    return;
  }

  const line = story.lines[autoplay.idx];
  const rate = getRate();

  speakGerman(line.de, {
    rate,
    onEnd: () => {
      if(!autoplay.active) return;
      autoplay.idx += 1;
      playNextAutoplayLine();
    }
  });
}

function pauseResumeAutoplay(){
  if(!autoplay.active) return;

  if(!autoplay.paused){
    autoplay.paused = true;
    window.speechSynthesis.pause();
  } else {
    autoplay.paused = false;
    window.speechSynthesis.resume();
  }
  setAutoplayButtons();
}

// ---------- Tooltips ----------
let activeTooltips = [];
function initTooltips(){
  activeTooltips.forEach(t => t.dispose());
  activeTooltips = [];

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    activeTooltips.push(new bootstrap.Tooltip(el));
  });
}

// ---------- Quiz ----------
const quiz = {
  enabled: false,
  score: 0,
  total: 0,
  current: null // { sentence, highlight, answer("acc"/"dat"), explain }
};

function setQuizScore(){
  const el = document.getElementById("quizScore");
  if(el) el.textContent = `Quiz: ${quiz.score}/${quiz.total}`;
}

function setQuizVisible(show){
  const panel = document.getElementById("quizPanel");
  if(panel) panel.classList.toggle("d-none", !show);
}

function buildQuizCandidates(story){
  const candidates = [];
  story.lines.forEach((ln, lineIndex) => {
    const g = grammarAnalyze(ln.de);
    g.matches.forEach((m) => {
      if(m.rule.kase === "acc" || m.rule.kase === "dat"){
        candidates.push({
          sentence: ln.de,
          lineIndex,
          highlight: m.matchText,
          answer: m.rule.kase,
          explain: m.rule.note(m.matchText)
        });
      }
    });
  });
  return candidates;
}

function renderQuizQuestion(q){
  const sentEl = document.getElementById("quizSentence");
  const qEl = document.getElementById("quizQuestion");
  const fb = document.getElementById("quizFeedback");
  const next = document.getElementById("btnQuizNext");

  if(!q){
    if(sentEl) sentEl.innerHTML = `<span class="text-secondary">No Akkusativ/Dativ markers found in this story.</span>`;
    if(qEl) qEl.textContent = "";
    if(fb) fb.textContent = "";
    if(next) next.disabled = true;
    return;
  }

  const safeSentence = escapeHtml(q.sentence);
  // highlight first occurrence only (neutral style)
  const safeHighlight = escapeHtml(q.highlight);
  const highlighted = safeSentence.replace(
    safeHighlight,
    `<span class="gram gram-quiz">${safeHighlight}</span>`
  );

  if(sentEl) sentEl.innerHTML = highlighted;
  if(qEl) qEl.textContent = `What case is the highlighted part?`;
  if(fb) fb.innerHTML = "";
  if(next) next.disabled = true;
}

function nextQuiz(){
  const story = getCurrentStory();
  if(!story) return;

  const candidates = buildQuizCandidates(story);
  if(candidates.length === 0){
    quiz.current = null;
    renderQuizQuestion(null);
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  quiz.current = pick;
  renderQuizQuestion(pick);
}

function answerQuiz(ans){
  const fb = document.getElementById("quizFeedback");
  const next = document.getElementById("btnQuizNext");

  if(!quiz.current) return;

  quiz.total += 1;
  const ok = ans === quiz.current.answer;
  if(ok) quiz.score += 1;

  setQuizScore();

  const correctLabel = quiz.current.answer === "acc" ? "Akkusativ" : "Dativ";
  const userLabel = ans === "acc" ? "Akkusativ" : "Dativ";

  const cls = ok ? "text-success" : "text-danger";
  const explain = escapeHtml(quiz.current.explain);

  if(fb){
    fb.innerHTML = `
      <div class="${cls} fw-semibold">${ok ? "Correct!" : "Wrong!"}</div>
      <div class="text-secondary small">You chose: <b>${userLabel}</b> • Correct: <b>${correctLabel}</b></div>
      <div class="small mt-1">${explain}</div>
    `;
  }
  if(next) next.disabled = false;
}

// ---------- UI render ----------
let currentStoryId = STORIES[0]?.id || null;

function getCurrentStory(){
  return STORIES.find(s => s.id === currentStoryId) || STORIES[0] || null;
}

function buildStorySelect(){
  const sel = document.getElementById("storySelect");
  sel.innerHTML = "";
  STORIES.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.title;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    stopAutoplay();
    currentStoryId = sel.value;
    renderStory(currentStoryId);
    if(quiz.enabled) nextQuiz();
  });
}

let hideEnglish = false;
function setEnglishVisibility(hidden){
  const main = document.querySelector("main");
  if(!main) return;
  hideEnglish = hidden;
  main.classList.toggle("english-hidden", hideEnglish);

  const btn = document.getElementById("toggleEnglishBtn");
  if(btn) btn.textContent = hideEnglish ? "Show English" : "Hide English";
}

function renderStory(storyId){
  const story = STORIES.find(s => s.id === storyId) || STORIES[0];
  currentStoryId = story.id;

  const title = document.getElementById("storyTitle");
  if(title) title.textContent = story.title;

  const acc = document.getElementById("accordionLines");
  acc.innerHTML = "";

  story.lines.forEach((line, idx) => {
    const n = idx + 1;
    const itemId = `line-${story.id}-${n}`;
    const collapseId = `collapse-${itemId}`;

    const pron = line.pron ? line.pron : phoneticDE(line.de);
    const g = grammarAnalyze(line.de);
    const struct = analyzeStructure(line.de, g.matches);

    const grammarNotes = g.notes.length
      ? g.notes.map(x => `<li>${escapeHtml(x)}</li>`).join("")
      : `<li class="text-secondary">No clear Akkusativ/Dativ marker detected here (simple sentence).</li>`;

    const chipsHtml = struct.chips.map(c =>
      `<span class="${c.cls}"><b>${escapeHtml(c.label)}:</b> ${escapeHtml(c.text)}</span>`
    ).join(" ");

    const stepsHtml = struct.steps.map(s => `<div class="small text-secondary">${escapeHtml(s)}</div>`).join("");

    const item = document.createElement("div");
    item.className = "accordion-item mb-2 border-0";

    item.innerHTML = `
      <h2 class="accordion-header" id="heading-${itemId}">
        <button class="accordion-button collapsed shadow-sm" type="button"
          data-bs-toggle="collapse" data-bs-target="#${collapseId}"
          aria-expanded="false" aria-controls="${collapseId}">
          <span class="badge text-bg-secondary badge-line me-2">${n}</span>
          <span class="text-de fw-semibold">${g.html}</span>
        </button>
      </h2>

      <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading-${itemId}">
        <div class="accordion-body">

          <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-2">
            <div class="text-secondary small">Hover grammar highlights in the German sentence</div>
            <button class="btn btn-sm btn-outline-light" data-speak="${escapeAttr(line.de)}">🔊 Speak</button>
          </div>

          <div class="box mb-3">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="tag tag-de">DE</span>
              <span class="small text-secondary">German (highlighted)</span>
            </div>
            <div class="text-de fw-semibold">${g.html}</div>
            <div class="small text-secondary mt-2">
              <span class="tag tag-acc">Akk</span> direction / direct object
              <span class="mx-2">•</span>
              <span class="tag tag-dat">Dat</span> location / with-to-at
            </div>
          </div>

          <div class="box mb-3">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="tag tag-struct">STRUCT</span>
              <span class="small text-secondary">Sentence structure (Satzbau)</span>
            </div>

            <div class="d-flex flex-wrap gap-2 mb-2">
              ${chipsHtml}
            </div>

            <div class="small text-secondary">
              <b>Formula:</b> ${escapeHtml(struct.formula)}
            </div>

            <div class="mt-2">
              ${stepsHtml}
            </div>
          </div>

          <div class="box mb-3">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="tag tag-pron">PRON</span>
              <span class="small text-secondary">Pronunciation (easy)</span>
            </div>
            <div class="pron text-pron fw-semibold">${escapeHtml(pron)}</div>
          </div>

          <div class="en box mb-3">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="tag tag-en">EN</span>
              <span class="small text-secondary">English meaning</span>
            </div>
            <div class="text-en">${escapeHtml(line.en)}</div>
          </div>

          <div class="box">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="tag tag-dat">GRAM</span>
              <span class="small text-secondary">Grammar notes (A1)</span>
            </div>
            <ul class="small mb-0">${grammarNotes}</ul>
          </div>

        </div>
      </div>
    `;

    acc.appendChild(item);
  });

  setEnglishVisibility(hideEnglish);

  // Speak buttons
  acc.querySelectorAll("[data-speak]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      stopAutoplay();
      const text = e.currentTarget.getAttribute("data-speak");
      speakGerman(text, { rate: getRate() });
    });
  });

  initTooltips();
}

// ---------- Utilities ----------
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(str){
  return escapeHtml(str).replaceAll("\n"," ");
}

// ---------- Init ----------
(function init(){
  initThemeToggle();

  buildStorySelect();
  currentStoryId = STORIES[0]?.id || null;
  renderStory(currentStoryId);

  const ttsNote = document.getElementById("ttsNote");
  if(!ttsSupported() && ttsNote) ttsNote.classList.remove("d-none");

  // English toggle
  document.getElementById("toggleEnglishBtn").addEventListener("click", () => {
    setEnglishVisibility(!hideEnglish);
  });

  // Expand all
  document.getElementById("expandAllBtn").addEventListener("click", () => {
    document.querySelectorAll(".accordion-collapse").forEach((el) => {
      const c = bootstrap.Collapse.getOrCreateInstance(el, { toggle:false });
      c.show();
    });
  });

  // Autoplay controls
  document.getElementById("btnPlayAll").addEventListener("click", () => {
    if(!ttsSupported()) return;
    playAutoplayFrom(0);
  });

  document.getElementById("btnPauseResume").addEventListener("click", () => {
    pauseResumeAutoplay();
  });

  document.getElementById("btnStop").addEventListener("click", () => {
    stopAutoplay();
  });

  // If speed changes during autoplay, it will apply from next line automatically
  document.getElementById("ttsRate").addEventListener("change", () => {});

  // Quiz controls
  document.getElementById("quizToggle").addEventListener("change", (e) => {
    quiz.enabled = !!e.target.checked;
    setQuizVisible(quiz.enabled);

    // quiz is easier if English is hidden
    if(quiz.enabled) setEnglishVisibility(true);

    if(quiz.enabled){
      nextQuiz();
    } else {
      quiz.current = null;
      document.getElementById("quizFeedback").innerHTML = "";
    }
  });

  document.getElementById("btnQuizAcc").addEventListener("click", () => answerQuiz("acc"));
  document.getElementById("btnQuizDat").addEventListener("click", () => answerQuiz("dat"));
  document.getElementById("btnQuizNext").addEventListener("click", () => nextQuiz());

  setQuizScore();
  setAutoplayButtons();
})();