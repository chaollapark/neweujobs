import mongoose from 'mongoose';
import { Niche } from '../src/models/Niche';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/eujobs';

interface NicheConfig {
  slug: string;
  name: string;
  h1: string;
  tagline: string;
  description: string;
  keywords: string[];
  filters: {
    cities?: string[];
    countries?: string[];
    companyPatterns?: string[];
    seniority?: string[];
    titleKeywords?: string[];
  };
  faqs: { question: string; answer: string }[];
  enabled: boolean;
  colors: { primary: string; accent: string };
}

const niches: NicheConfig[] = [
  // === BY LOCATION (8) ===
  {
    slug: 'jobs-in-brussels',
    name: 'Jobs in Brussels',
    h1: 'Find Your Next Job in Brussels',
    tagline: 'The EU capital is calling. Discover hundreds of roles in EU institutions, NGOs, consultancies, and more.',
    description: `Brussels is the political heart of Europe and one of the most international cities in the world. As the de facto capital of the European Union, it hosts the European Commission, the Council of the EU, and a large portion of the European Parliament's work. Beyond EU institutions, Brussels is home to NATO, hundreds of trade associations, NGOs, think tanks, and public affairs consultancies.\n\nThe city's job market is uniquely shaped by the "EU bubble" — a dense ecosystem of policy professionals, lobbyists, diplomats, lawyers, and communicators. Whether you are a recent graduate seeking a traineeship or an experienced professional targeting a senior policy role, Brussels offers unmatched opportunities in European affairs.\n\nBrussels is also remarkably liveable: compact, multilingual (French, Dutch, and English are widely spoken), affordable compared to other Western European capitals, and well-connected by rail to Paris, Amsterdam, London, and Cologne.`,
    keywords: ['Brussels jobs', 'EU jobs Brussels', 'work in Brussels', 'Brussels careers', 'Belgium jobs'],
    filters: { cities: ['Brussels', 'Bruxelles'] },
    faqs: [
      { question: 'What types of jobs are available in Brussels?', answer: 'Brussels offers diverse roles in EU institutions, public affairs consultancies, NGOs, trade associations, think tanks, law firms, media, international organisations like NATO, and the private sector. The EU bubble creates unique demand for policy, legal, and communications professionals.' },
      { question: 'Do I need to speak French to work in Brussels?', answer: 'English is the primary working language in most EU-related organisations. However, French is widely used in daily life and Belgian companies. Speaking French significantly broadens your job opportunities and improves quality of life.' },
      { question: 'What is the average salary in Brussels?', answer: 'Salaries vary widely by sector. EU institution officials earn 4,000-16,000+/month. Public affairs consultants earn 3,000-10,000/month. NGO salaries range from 2,200-5,000/month. Brussels is relatively affordable for a European capital.' },
      { question: 'Is Brussels a good city for expats?', answer: 'Excellent. Brussels has one of the highest percentages of foreign residents in Europe. The international community is welcoming, housing is affordable compared to London or Paris, and the city is a hub for European networking and career development.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-luxembourg',
    name: 'Jobs in Luxembourg',
    h1: 'Find Jobs in Luxembourg',
    tagline: 'Discover opportunities in one of Europe\'s wealthiest and most international capitals.',
    description: `Luxembourg is a major hub for EU institutions and international finance. The European Court of Justice, the European Investment Bank (EIB), the European Court of Auditors, and several other EU bodies are headquartered here. The city also hosts a thriving financial sector with major banks, fund management companies, and fintech startups.\n\nWorking in Luxembourg means high salaries, low taxes for certain categories of workers, and an exceptionally international environment — over 47% of the population are foreign nationals. The country's compact size and excellent public transport (free since 2020) make commuting easy.\n\nLuxembourg is particularly attractive for legal professionals, financial analysts, EU affairs specialists, and IT professionals. The trilingual environment (French, German, Luxembourgish) plus English creates a unique and rewarding workplace culture.`,
    keywords: ['Luxembourg jobs', 'EU jobs Luxembourg', 'work in Luxembourg', 'EIB jobs', 'Luxembourg careers'],
    filters: { cities: ['Luxembourg', 'Luxembourg City'] },
    faqs: [
      { question: 'What EU institutions are in Luxembourg?', answer: 'Luxembourg hosts the European Court of Justice, European Investment Bank (EIB), European Court of Auditors, Eurostat, the Publications Office, and parts of the European Commission and European Parliament secretariats.' },
      { question: 'Are salaries higher in Luxembourg?', answer: 'Yes. Luxembourg has one of the highest minimum wages and average salaries in Europe. EU institution salaries include a Luxembourg correction coefficient, and the financial sector pays competitively. Cost of living, especially housing, is also high.' },
      { question: 'What languages do I need for Luxembourg?', answer: 'English is widely used in international organisations and the financial sector. French is essential for daily life and many local businesses. German and Luxembourgish are also official languages and valued by employers.' },
      { question: 'Can I commute to Luxembourg from neighbouring countries?', answer: 'Yes. Over 200,000 people commute daily from France, Belgium, and Germany. Cross-border commuting is common and benefits from Luxembourg excellent road and rail connections.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-strasbourg',
    name: 'Jobs in Strasbourg',
    h1: 'Find Jobs in Strasbourg',
    tagline: 'Work in the seat of the European Parliament and Council of Europe.',
    description: `Strasbourg holds a special place in European politics as the official seat of the European Parliament and home to the Council of Europe, the European Court of Human Rights, and Eurocorps. The city hosts MEPs and their staff for monthly plenary sessions and employs thousands in its permanent institutions.\n\nBeyond the institutional roles, Strasbourg offers positions in human rights organisations, the Council of Europe's directorate-general, and supporting industries including hospitality and interpretation services that serve the political ecosystem.\n\nStrasbourg is a beautiful, historic city on the Franco-German border, offering a high quality of life, excellent cuisine, and a bilingual French-German cultural heritage. It is well-connected to Paris by TGV (1h50) and to Brussels and other European cities.`,
    keywords: ['Strasbourg jobs', 'European Parliament jobs', 'Council of Europe jobs', 'work in Strasbourg'],
    filters: { cities: ['Strasbourg'] },
    faqs: [
      { question: 'What institutions are based in Strasbourg?', answer: 'Strasbourg hosts the European Parliament (official seat), the Council of Europe, the European Court of Human Rights, Eurocorps, and the International Institute of Human Rights, among others.' },
      { question: 'Are European Parliament jobs based in Strasbourg or Brussels?', answer: 'Most EP staff work in Brussels where committees meet. However, plenary sessions are held in Strasbourg, and the EP maintains permanent staff there. Some roles require travel between both cities.' },
      { question: 'What is the cost of living in Strasbourg?', answer: 'Strasbourg is significantly more affordable than Paris or Brussels. Housing, dining, and transportation costs are moderate for a French city of its size, making it attractive for young professionals and families.' },
      { question: 'Do I need French for Strasbourg jobs?', answer: 'French is essential for daily life. EU institution jobs typically require English plus one or two other EU languages. Council of Europe roles primarily use English and French as working languages.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-the-hague',
    name: 'Jobs in The Hague',
    h1: 'Find Jobs in The Hague',
    tagline: 'The international city of peace and justice — home to world-class institutions.',
    description: `The Hague is the international city of peace and justice, hosting the International Court of Justice, the International Criminal Court (ICC), Europol, Eurojust, and numerous international legal and security organisations. It is also home to the Organisation for the Prohibition of Chemical Weapons (OPCW).\n\nThe city offers a unique blend of international law, security, and diplomacy careers. Legal professionals, investigators, analysts, and administrative staff find rewarding opportunities across its many institutions.\n\nThe Hague is a sophisticated, green city on the North Sea coast with an excellent quality of life, strong international community, and easy access to Amsterdam, Rotterdam, and the rest of Europe via Schiphol Airport and high-speed rail.`,
    keywords: ['The Hague jobs', 'ICC jobs', 'Europol jobs', 'international law jobs', 'Netherlands EU jobs'],
    filters: { cities: ['The Hague', 'Den Haag', "'s-Gravenhage"] },
    faqs: [
      { question: 'What international organisations are in The Hague?', answer: 'The Hague hosts the International Court of Justice, International Criminal Court (ICC), Europol, Eurojust, OPCW, the Permanent Court of Arbitration, and the Hague Conference on Private International Law, among others.' },
      { question: 'What types of roles are available in The Hague?', answer: 'The Hague specialises in international law, justice, security, and policing roles. Positions include legal officers, investigators, analysts, interpreters, IT specialists, and administrative staff at international organisations.' },
      { question: 'Do I need Dutch to work in The Hague?', answer: 'No. International organisations primarily use English and French. However, Dutch is useful for daily life and some local employers. The Netherlands has excellent English proficiency nationwide.' },
      { question: 'How does The Hague compare to Amsterdam for jobs?', answer: 'The Hague specialises in international law and governance while Amsterdam is stronger in tech, finance, and creative industries. The Hague offers more institutional and public sector international roles.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-frankfurt',
    name: 'Jobs in Frankfurt',
    h1: 'Find Jobs in Frankfurt',
    tagline: 'Europe\'s financial capital — home to the ECB and major financial institutions.',
    description: `Frankfurt is Europe's financial capital and home to the European Central Bank (ECB), the Single Supervisory Mechanism (SSM), the European Insurance and Occupational Pensions Authority (EIOPA), and Germany's Bundesbank. Major international banks, law firms, and consulting companies maintain significant offices here.\n\nThe city offers exceptional opportunities in central banking, financial regulation, monetary policy, banking supervision, and corporate finance. Since Brexit, Frankfurt has attracted numerous financial institutions relocating from London.\n\nFrankfurt combines a cosmopolitan, international atmosphere with the efficiency and quality of life Germany is known for. The city has excellent transport links, a vibrant cultural scene, and strong earning potential with a moderate cost of living compared to London or Zurich.`,
    keywords: ['Frankfurt jobs', 'ECB jobs', 'finance jobs Frankfurt', 'banking jobs Germany', 'EU finance careers'],
    filters: { cities: ['Frankfurt', 'Frankfurt am Main'] },
    faqs: [
      { question: 'What EU institutions are in Frankfurt?', answer: 'Frankfurt hosts the European Central Bank (ECB), the Single Supervisory Mechanism (SSM) for banking supervision, and the European Insurance and Occupational Pensions Authority (EIOPA). These institutions employ thousands of professionals.' },
      { question: 'What types of jobs are available in Frankfurt?', answer: 'Frankfurt specialises in central banking, financial regulation, monetary policy, banking, asset management, financial law, and consulting. IT and data science roles within financial institutions are also plentiful.' },
      { question: 'Do I need German for Frankfurt jobs?', answer: 'English is the working language at the ECB and most international financial institutions. German is needed for local companies and improves career prospects. Many firms operate bilingually in English and German.' },
      { question: 'How is the job market in Frankfurt after Brexit?', answer: 'Frankfurt has significantly benefited from Brexit, with many banks and financial institutions relocating operations from London. This has created new opportunities in finance, compliance, risk management, and legal roles.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-vienna',
    name: 'Jobs in Vienna',
    h1: 'Find Jobs in Vienna',
    tagline: 'One of the world\'s most liveable cities with a thriving international sector.',
    description: `Vienna is a major hub for international organisations, hosting the United Nations Office at Vienna (UNOV), the International Atomic Energy Agency (IAEA), the Organization for Security and Co-operation in Europe (OSCE), OPEC, and the EU Agency for Fundamental Rights (FRA).\n\nThe city offers diverse careers in diplomacy, nuclear safety, energy policy, human rights, and international security. Vienna's international organisations employ thousands of professionals from around the world.\n\nConsistently ranked among the world's most liveable cities, Vienna offers an exceptional quality of life with rich culture, excellent public transport, affordable housing compared to other Western European capitals, and a safe, green urban environment.`,
    keywords: ['Vienna jobs', 'UN Vienna jobs', 'IAEA jobs', 'international jobs Vienna', 'Austria EU jobs'],
    filters: { cities: ['Vienna', 'Wien'] },
    faqs: [
      { question: 'What international organisations are in Vienna?', answer: 'Vienna hosts UNOV, IAEA, OSCE, OPEC, CTBTO, UNODC, the EU Agency for Fundamental Rights (FRA), and the Vienna office of UNHCR. The city is the third UN headquarters alongside New York and Geneva.' },
      { question: 'What is the cost of living in Vienna?', answer: 'Vienna is more affordable than many Western European capitals. Rent is reasonable, public transport is excellent and cheap (365 annual pass), and the city offers high-quality public services including healthcare and education.' },
      { question: 'Do I need German for Vienna international jobs?', answer: 'International organisations primarily use English, with French also common at UN agencies. German is essential for daily life and local employers but not typically required for international organisation positions.' },
      { question: 'What makes Vienna attractive for international careers?', answer: 'Vienna combines world-class international organisations with exceptional quality of life, safety, culture, and affordability. It is consistently rated among the top 3 most liveable cities globally.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-berlin',
    name: 'Jobs in Berlin',
    h1: 'Find Jobs in Berlin',
    tagline: 'Europe\'s dynamic capital for policy, tech, and international affairs.',
    description: `Berlin is Germany's capital and a growing hub for EU affairs, international policy, and the tech sector. The city hosts embassies, political foundations, German federal institutions, and an expanding ecosystem of EU-focused organisations and NGOs.\n\nBerlin's tech scene is one of Europe's largest, attracting startups and scale-ups in fintech, climate tech, and digital policy. The city's policy landscape includes major think tanks, advocacy organisations, and Germany's vibrant political scene.\n\nBerlin offers a creative, international atmosphere with a lower cost of living than London, Paris, or Munich. The city's cultural richness, diverse neighbourhoods, and entrepreneurial energy make it a magnet for young professionals from across Europe.`,
    keywords: ['Berlin jobs', 'Germany EU jobs', 'Berlin policy jobs', 'Berlin tech jobs', 'work in Berlin'],
    filters: { cities: ['Berlin'] },
    faqs: [
      { question: 'What types of EU-related jobs are in Berlin?', answer: 'Berlin offers roles in political foundations (Konrad Adenauer, Friedrich Ebert), think tanks, embassies, German federal ministries working on EU affairs, international NGOs, and the tech sector, especially climate tech and digital policy.' },
      { question: 'Is Berlin good for international careers?', answer: 'Yes. Berlin is highly international with a large expat community. English is widely spoken in the tech and international sectors. The city offers a creative, affordable lifestyle and excellent European connectivity.' },
      { question: 'Do I need German for Berlin jobs?', answer: 'Many international organisations and tech companies operate in English. However, German is increasingly expected, especially for policy and public sector roles. Speaking German significantly broadens your opportunities.' },
      { question: 'How does Berlin compare to Brussels for EU affairs?', answer: 'Brussels is the centre for EU institutional work, while Berlin is key for German and European policy, political foundations, and the intersection of tech and regulation. Many professionals work across both cities.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'jobs-in-paris',
    name: 'Jobs in Paris',
    h1: 'Find Jobs in Paris',
    tagline: 'The city of lights offers world-class opportunities in EU affairs and beyond.',
    description: `Paris is a major centre for international organisations, hosting the OECD, UNESCO, the International Energy Agency (IEA), and the International Chamber of Commerce. The city also hosts the European Securities and Markets Authority (ESMA) and the European Banking Authority (EBA, post-Brexit).\n\nBeyond international institutions, Paris is France's centre for policy-making, corporate headquarters, consulting, and the luxury and creative industries. French companies with significant EU affairs operations are often headquartered here.\n\nParis offers unrivalled cultural richness, excellent connectivity to Brussels (1h20 by Thalys), and a sophisticated professional environment. French language skills are essential for most local roles but international organisations operate extensively in English.`,
    keywords: ['Paris jobs', 'OECD jobs', 'UNESCO jobs', 'France EU jobs', 'international jobs Paris'],
    filters: { cities: ['Paris'] },
    faqs: [
      { question: 'What international organisations are in Paris?', answer: 'Paris hosts the OECD, UNESCO, the International Energy Agency (IEA), European Securities and Markets Authority (ESMA), European Banking Authority (EBA), International Chamber of Commerce, and numerous other international bodies.' },
      { question: 'Do I need French for Paris international jobs?', answer: 'French is typically required for daily life and most local employers. International organisations like the OECD use English and French. Strong bilingual candidates have a significant advantage in the Paris job market.' },
      { question: 'How does the Paris job market compare to Brussels?', answer: 'Paris offers more corporate and international organisation roles while Brussels focuses on EU institutional work. Many professionals in EU affairs work across both cities, with the Thalys train connecting them in just 1 hour 20 minutes.' },
      { question: 'What is the cost of living in Paris?', answer: 'Paris is one of Europe most expensive cities, especially for housing. However, international organisation salaries include cost-of-living adjustments, and the quality of life, culture, and career opportunities are exceptional.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },

  // === BY INSTITUTION (6) ===
  {
    slug: 'european-commission-jobs',
    name: 'European Commission Jobs',
    h1: 'European Commission Jobs & Careers',
    tagline: 'Join the EU\'s executive body — the engine of European policy-making.',
    description: `The European Commission is the executive branch of the European Union, responsible for proposing legislation, implementing decisions, and managing the day-to-day business of the EU. With over 32,000 staff across Brussels, Luxembourg, and representations in every member state, it is the largest EU employer.\n\nCommission roles span an extraordinary range: from policy officers drafting legislation on climate, digital, and trade policy, to economists analysing market trends, lawyers ensuring legal compliance, scientists evaluating food safety, IT specialists building digital infrastructure, and translators working across 24 official languages.\n\nThe main entry route for permanent officials is through EPSO competitions (concours), but the Commission also recruits contract agents, temporary agents, seconded national experts, and trainees through its Blue Book programme. Salaries are competitive, tax-advantaged, and come with excellent benefits including expatriation allowance, pension, and education allowance for children.`,
    keywords: ['European Commission jobs', 'EC careers', 'EPSO', 'Commission vacancies', 'EU executive jobs'],
    filters: { companyPatterns: ['european commission', 'commission europ'] },
    faqs: [
      { question: 'How do I apply for European Commission jobs?', answer: 'Permanent official positions require passing an EPSO competition. Contract agent roles are recruited through the CAST system. Temporary agent and seconded national expert positions are advertised on the Commission careers portal and EU job sites like EUJobs.co.' },
      { question: 'What is the salary at the European Commission?', answer: 'Officials earn from approximately 4,500/month (AD5) to 18,000+/month (AD16). Contract agents earn 2,800-5,500/month depending on function group. Salaries are exempt from national tax but subject to EU community tax. Additional allowances apply.' },
      { question: 'Do I need to be an EU citizen to work at the Commission?', answer: 'EU citizenship is required for permanent official positions. Contract agent and some temporary agent roles may be open to non-EU nationals in specific circumstances. Traineeship opportunities are primarily for EU citizens with limited non-EU places.' },
      { question: 'What languages do I need for the European Commission?', answer: 'You need excellent knowledge of at least two EU official languages. The three most commonly required are English, French, and German. Administrators typically need to demonstrate competence in their main language plus at least one other.' },
      { question: 'What is the Blue Book traineeship at the Commission?', answer: 'The Blue Book is the Commission flagship traineeship programme, offering five-month paid placements (approximately 1,400/month) in Brussels or Luxembourg. Two intakes per year, highly competitive with over 15,000 applications per session.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'european-parliament-jobs',
    name: 'European Parliament Jobs',
    h1: 'European Parliament Jobs & Careers',
    tagline: 'Work at the heart of European democracy — representing 450 million citizens.',
    description: `The European Parliament is the directly elected legislative body of the EU, representing approximately 450 million citizens across 27 member states. With over 8,000 staff and 705 MEPs supported by their personal assistants and political group staff, the Parliament is a dynamic and politically charged workplace.\n\nParliament jobs include roles in the Secretariat (permanent administrative body), political group secretariats, and MEP offices. Positions range from committee secretariat staff and policy advisors to press officers, IT specialists, lawyers, interpreters, and administrative assistants.\n\nThe Parliament divides its work between Brussels (committee meetings, political group work) and Strasbourg (plenary sessions), with some administrative functions in Luxembourg. This unique tri-city setup creates a distinctive working rhythm and lifestyle for EP staff.`,
    keywords: ['European Parliament jobs', 'EP careers', 'MEP assistant jobs', 'Parliament vacancies', 'EU democracy jobs'],
    filters: { companyPatterns: ['european parliament', 'parlement europ'] },
    faqs: [
      { question: 'What types of jobs are available at the European Parliament?', answer: 'The EP hires for its Secretariat (administration, policy, legal, IT, finance), political group secretariats (political advisors, communications), and MEP offices (accredited parliamentary assistants — APAs). Interpreter and translator roles are also significant.' },
      { question: 'How do I become an MEP assistant?', answer: 'Accredited Parliamentary Assistants (APAs) are hired directly by MEPs. Positions are often found through political networks, party connections, or EU job boards. Each MEP manages their own recruitment, so there is no centralised application process.' },
      { question: 'What is the Schuman traineeship?', answer: 'The Schuman traineeship is the Parliament official internship programme, offering five-month paid placements. Named after Robert Schuman, it provides young graduates with hands-on experience in the EP. Applications are highly competitive.' },
      { question: 'Do Parliament staff need to travel between Brussels and Strasbourg?', answer: 'Yes, many EP staff travel to Strasbourg for monthly plenary sessions (usually 4 days). The Parliament provides transport and accommodation support. Some roles are permanently based in one city.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'eu-council-jobs',
    name: 'EU Council Jobs',
    h1: 'Council of the EU Jobs & Careers',
    tagline: 'Shape EU policy where member state governments negotiate the future of Europe.',
    description: `The Council of the European Union (often called the Council of Ministers) is where EU member state governments are represented. Together with the European Parliament, it negotiates and adopts EU laws. The European Council, comprising heads of state, sets the EU's overall political direction.\n\nThe General Secretariat of the Council (GSC) employs approximately 3,000 staff who support the Council's work: organising meetings, preparing legal texts, providing policy analysis, and facilitating negotiations between member states. The GSC is based in the Europa and Justus Lipsius buildings in Brussels.\n\nCouncil positions suit professionals who thrive in diplomatic, politically sensitive environments. Roles require discretion, strong analytical skills, and often legal expertise, as much of the work involves reviewing and negotiating legislation across multiple policy areas.`,
    keywords: ['EU Council jobs', 'Council of the EU careers', 'GSC jobs', 'EU legislative jobs', 'Council Secretariat'],
    filters: { companyPatterns: ['council of the eu', 'eu council', 'general secretariat.*council', 'european council'] },
    faqs: [
      { question: 'What does the Council of the EU do?', answer: 'The Council represents EU member state governments. Ministers from each country meet to discuss, amend, and adopt laws (jointly with the European Parliament) and coordinate policies. It is distinct from the European Council (heads of state) and the Council of Europe.' },
      { question: 'How do I get a job at the Council Secretariat?', answer: 'The General Secretariat recruits through EPSO competitions for permanent posts and directly for contract agent and temporary positions. Vacancies are published on the Council website and EU career portals like EUJobs.co.' },
      { question: 'What skills are valued at the Council?', answer: 'Legal expertise, diplomatic skills, discretion, and strong analytical abilities are highly valued. Many roles involve drafting legal texts, facilitating negotiations between member states, and understanding complex political dynamics across 27 countries.' },
      { question: 'Where is the Council of the EU based?', answer: 'The Council is based in Brussels, primarily in the Europa building (meetings) and the Justus Lipsius building (secretariat offices). All Council work takes place in Brussels, unlike the Parliament which also sits in Strasbourg.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'eu-agencies-jobs',
    name: 'EU Agencies Jobs',
    h1: 'EU Agency Jobs & Careers',
    tagline: 'Work at one of 40+ specialised EU agencies across Europe.',
    description: `The European Union has over 40 decentralised agencies, each specialising in a specific technical, scientific, or regulatory area. From the European Medicines Agency (EMA) in Amsterdam to the European Food Safety Authority (EFSA) in Parma and Frontex in Warsaw, these agencies play crucial roles in EU governance.\n\nAgency positions are often more accessible than EU institution roles, as they typically recruit directly rather than through EPSO competitions. Roles cover scientific assessment, regulatory oversight, data analysis, project management, and administration.\n\nEU agencies offer the benefits of working in the EU institutional framework — competitive salaries, international environments, and professional development — while being located across different member states, providing alternatives to Brussels-based careers.`,
    keywords: ['EU agency jobs', 'EMA jobs', 'EFSA jobs', 'Frontex jobs', 'ECDC jobs', 'EU decentralised agencies'],
    filters: { companyPatterns: ['frontex', 'efsa', 'ema', 'cedefop', 'eurofound', 'europol', 'eurojust', 'ecdc', 'easa', 'echa', 'enisa', 'eu-osha', 'era ', 'acer ', 'berec'] },
    faqs: [
      { question: 'How many EU agencies are there?', answer: 'There are over 40 EU decentralised agencies plus several executive agencies. They span areas including medicines (EMA), food safety (EFSA), border management (Frontex), police cooperation (Europol), disease control (ECDC), aviation safety (EASA), and many more.' },
      { question: 'Are EU agency jobs easier to get than Commission jobs?', answer: 'Generally, yes. EU agencies typically recruit directly through open calls rather than EPSO competitions. The process is faster, though still competitive. Technical expertise in the agency specific domain is often the key requirement.' },
      { question: 'Do EU agency staff get the same benefits as EU officials?', answer: 'Agency staff broadly follow the same pay scales and conditions as EU institution staff, though there can be variations. Temporary and contract agent conditions are similar, including expatriation allowance, pension rights, and leave entitlements.' },
      { question: 'Where are EU agencies located?', answer: 'EU agencies are spread across all member states. Major locations include Amsterdam (EMA), Parma (EFSA), Warsaw (Frontex), Bilbao (EU-OSHA), Dublin (Eurofound), Helsinki (ECHA), Lisbon (EMCDDA), Thessaloniki (CEDEFOP), and many more.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'eu-institutions-jobs',
    name: 'EU Institutions Jobs',
    h1: 'EU Institution Jobs & Careers',
    tagline: 'Build a career serving 450 million citizens across the European Union.',
    description: `EU institutions form the governance framework of the European Union, employing over 60,000 staff across the European Commission, European Parliament, Council of the EU, European Court of Justice, European Central Bank, European Court of Auditors, and other bodies.\n\nWorking for an EU institution means contributing to legislation, policies, and programmes that affect hundreds of millions of people. Careers span policy development, legal analysis, economic research, translation and interpretation, IT, finance, and administration.\n\nThe main recruitment path for permanent officials is through EPSO (European Personnel Selection Office) competitions, but thousands of positions are filled annually as contract agents, temporary agents, seconded national experts, and trainees. EU institutions offer some of the most attractive employment conditions in Europe, including tax-advantaged salaries, generous leave, and strong pension schemes.`,
    keywords: ['EU institution jobs', 'EPSO careers', 'EU official positions', 'EU civil service', 'European Union jobs'],
    filters: { companyPatterns: ['european commission', 'european parliament', 'council of the eu', 'european council', 'court of justice', 'european central bank', 'ecb', 'court of auditors'] },
    faqs: [
      { question: 'What are the main EU institutions?', answer: 'The seven main EU institutions are the European Commission, European Parliament, Council of the EU, European Council, Court of Justice of the EU, European Central Bank, and European Court of Auditors. Each has distinct roles and employment opportunities.' },
      { question: 'How does EPSO recruitment work?', answer: 'EPSO runs competitions (concours) for permanent EU official positions. The process includes computer-based tests (verbal, numerical, abstract reasoning), an e-tray exercise, and an assessment centre with interviews and group exercises. The entire process can take 6-12 months.' },
      { question: 'What contract types exist at EU institutions?', answer: 'EU institutions employ permanent officials (through EPSO), temporary agents (fixed-term contracts), contract agents (CAST), seconded national experts (from member state administrations), and trainees. Each has different recruitment paths and conditions.' },
      { question: 'Can I work at EU institutions without passing EPSO?', answer: 'Yes. Contract agent (CAST), temporary agent, seconded national expert, and traineeship positions do not require passing EPSO. These positions are widely advertised and offer a way to build experience within the EU institutional framework.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'ngo-jobs-brussels',
    name: 'NGO Jobs Brussels',
    h1: 'NGO & Civil Society Jobs in Brussels',
    tagline: 'Make a difference — join one of hundreds of NGOs shaping EU policy.',
    description: `Brussels is one of the world's leading centres for NGO and civil society activity. Hundreds of organisations maintain offices in the EU capital to advocate on issues from human rights and environmental protection to development aid and consumer rights. Major players include WWF European Policy Office, Greenpeace EU, Amnesty International EU, Oxfam EU, and specialised networks like the Green 10 and Social Platform.\n\nNGO roles in Brussels combine passion with professional skill: policy officers track and influence EU legislation, campaign coordinators mobilise public support, communications teams craft compelling narratives, and programme managers run EU-funded projects worth millions.\n\nWhile NGO salaries are typically lower than the private sector, the work is deeply meaningful and the policy impact can be enormous. Brussels NGOs offer excellent professional development, international exposure, and the satisfaction of working on causes that matter.`,
    keywords: ['NGO jobs Brussels', 'civil society jobs', 'advocacy jobs EU', 'nonprofit careers Brussels', 'humanitarian jobs Brussels'],
    filters: { cities: ['Brussels', 'Bruxelles'], titleKeywords: ['NGO', 'advocacy', 'campaign', 'civil society', 'humanitarian', 'rights'] },
    faqs: [
      { question: 'What NGOs are based in Brussels?', answer: 'Major Brussels NGOs include WWF EU, Greenpeace EU, Amnesty International EU, Oxfam EU, Save the Children EU, Transparency International EU, and hundreds of smaller specialised advocacy organisations covering every EU policy area.' },
      { question: 'How do I find NGO jobs in Brussels?', answer: 'Check EUJobs.co regularly, as well as individual NGO career pages. Networks like the Social Platform, Green 10, and CONCORD also circulate vacancies. LinkedIn and Brussels-specific job groups are also useful sources.' },
      { question: 'Do NGOs in Brussels pay well?', answer: 'NGO salaries are typically lower than EU institutions or the private sector, ranging from 2,200 to 7,000/month depending on the organisation and seniority. Some large international NGOs offer competitive packages, especially for senior roles.' },
      { question: 'What skills are most valued by Brussels NGOs?', answer: 'EU policy expertise, strong writing and advocacy skills, campaign management, stakeholder engagement, and language skills (especially English and French) are most valued. Experience with EU funding and project management is also highly sought after.' },
    ],
    enabled: true,
    colors: { primary: 'green', accent: 'teal' },
  },

  // === BY POLICY AREA (12) ===
  {
    slug: 'eu-climate-jobs',
    name: 'EU Climate Jobs',
    h1: 'EU Climate & Environment Jobs',
    tagline: 'Join the Green Deal — work on Europe\'s most ambitious climate agenda.',
    description: `The European Green Deal has made climate policy the EU's top political priority, creating unprecedented demand for professionals in climate, energy, and environmental policy. From the European Commission's DG CLIMA and DG ENV to specialised agencies and NGOs, the climate sector in Brussels is booming.\n\nRoles span policy development (drafting climate legislation like the Fit for 55 package), technical analysis (emissions modelling, renewable energy assessment), advocacy (NGOs pushing for ambitious climate targets), corporate sustainability (helping companies comply with EU green regulations), and climate finance.\n\nAs the EU pushes toward climate neutrality by 2050, career opportunities in this space continue to grow. Professionals with expertise in energy policy, environmental law, sustainable finance, and circular economy are particularly in demand.`,
    keywords: ['EU climate jobs', 'Green Deal careers', 'environment jobs EU', 'sustainability EU policy', 'climate policy Brussels'],
    filters: { titleKeywords: ['climate', 'green deal', 'environment', 'sustainability', 'renewable', 'energy transition', 'carbon', 'circular economy', 'biodiversity'] },
    faqs: [
      { question: 'What is the European Green Deal?', answer: 'The European Green Deal is the EU flagship policy package aiming to make Europe climate-neutral by 2050. It encompasses legislation on emissions reduction, renewable energy, sustainable finance, circular economy, biodiversity, and green industrial policy.' },
      { question: 'What types of climate jobs are available in Brussels?', answer: 'Climate roles include policy officers at the Commission or NGOs, energy analysts, environmental lawyers, sustainability consultants, climate finance specialists, advocacy campaigners, and technical experts in emissions trading and carbon markets.' },
      { question: 'What qualifications do I need for EU climate jobs?', answer: 'Relevant degrees include environmental science, energy engineering, climate policy, environmental law, and economics. Experience with EU policy-making, climate modelling, or sustainability reporting is highly valued.' },
      { question: 'Are EU climate jobs growing?', answer: 'Yes, significantly. The Green Deal has created strong demand across all sectors — from EU institutions and agencies to consultancies, NGOs, law firms, and corporate sustainability teams. Climate expertise is one of the most sought-after skills in Brussels.' },
    ],
    enabled: true,
    colors: { primary: 'green', accent: 'emerald' },
  },
  {
    slug: 'eu-digital-policy-jobs',
    name: 'EU Digital Policy Jobs',
    h1: 'EU Digital & Tech Policy Jobs',
    tagline: 'Shape the future of technology regulation — from AI to data protection.',
    description: `The EU has become the world's leading regulator of technology, with landmark legislation including the GDPR, Digital Services Act, Digital Markets Act, and AI Act. This regulatory leadership has created enormous demand for professionals who understand both technology and EU policy-making.\n\nDigital policy roles in Brussels span EU institutions (DG CONNECT, EDPS, ENISA), tech company government affairs teams, digital rights NGOs, specialised law firms, and consultancies advising on tech regulation compliance.\n\nAs the EU continues to regulate emerging technologies — AI, cryptocurrency, cloud services, cybersecurity — professionals with combined technical and policy skills are exceptionally well-positioned. Brussels is increasingly the global centre for tech policy careers.`,
    keywords: ['EU digital policy jobs', 'tech policy Brussels', 'GDPR careers', 'AI Act jobs', 'digital regulation EU'],
    filters: { titleKeywords: ['digital', 'tech policy', 'AI ', 'artificial intelligence', 'data protection', 'GDPR', 'cybersecurity', 'digital services', 'platform regulation'] },
    faqs: [
      { question: 'What major EU digital legislation exists?', answer: 'Key EU digital laws include the GDPR (data protection), Digital Services Act (online platforms), Digital Markets Act (big tech competition), AI Act (artificial intelligence regulation), Cyber Resilience Act, and Data Act. More legislation is continuously being developed.' },
      { question: 'What roles are available in EU digital policy?', answer: 'Roles include policy officers at EU institutions, government affairs managers at tech companies, digital rights advocates at NGOs, tech regulation lawyers, privacy and data protection officers, and consultants advising on regulatory compliance.' },
      { question: 'Do I need a technical background for EU tech policy?', answer: 'Not always, but it helps. Many roles require understanding of EU legislative processes combined with some technical literacy. Legal and policy backgrounds are most common, but engineering and computer science graduates increasingly enter the field.' },
      { question: 'Why is Brussels important for tech policy?', answer: 'The EU has become the global standard-setter for tech regulation (the "Brussels Effect"). Companies worldwide must comply with EU rules like GDPR. This makes Brussels the most important city globally for tech policy careers outside of Washington DC.' },
    ],
    enabled: true,
    colors: { primary: 'purple', accent: 'indigo' },
  },
  {
    slug: 'eu-trade-jobs',
    name: 'EU Trade Jobs',
    h1: 'EU Trade & International Commerce Jobs',
    tagline: 'Navigate global commerce — the EU is the world\'s largest trading bloc.',
    description: `The European Union is the world's largest trading bloc, negotiating trade agreements with countries and regions worldwide. DG TRADE at the European Commission manages these negotiations, while trade policy engages a vast ecosystem of lawyers, consultants, business associations, and advocacy groups in Brussels.\n\nTrade roles cover trade negotiations, trade defence (anti-dumping, countervailing duties), customs and tariffs, trade and sustainability, WTO disputes, and market access strategies. The intersection of trade with geopolitics, sanctions, and supply chain resilience has made this field increasingly dynamic.\n\nWith ongoing negotiations, the Trade and Technology Council with the US, and evolving EU trade doctrine, professionals in this space are in high demand. Trade expertise combines law, economics, and international relations in a uniquely challenging and rewarding career.`,
    keywords: ['EU trade jobs', 'trade policy Brussels', 'international commerce EU', 'DG TRADE careers', 'customs EU'],
    filters: { titleKeywords: ['trade', 'customs', 'tariff', 'WTO', 'export', 'import', 'commercial policy', 'trade defence', 'sanctions'] },
    faqs: [
      { question: 'What does EU trade policy involve?', answer: 'EU trade policy covers negotiating free trade agreements, managing trade defence instruments (anti-dumping duties), WTO dispute settlement, customs and market access, trade and sustainability provisions, and sanctions and export controls.' },
      { question: 'What qualifications are needed for EU trade roles?', answer: 'Trade roles typically require backgrounds in international law, economics, political science, or international relations. Understanding of WTO rules, bilateral trade agreements, and EU institutional processes is essential. Languages are a plus.' },
      { question: 'Where do EU trade professionals work?', answer: 'Key employers include DG TRADE at the European Commission, trade law firms, consultancies specialising in trade policy, business associations with trade interests, and the WTO advisory ecosystem. Most roles are in Brussels.' },
      { question: 'Is EU trade policy becoming more important?', answer: 'Yes. Geopolitical tensions, supply chain disruptions, the green transition, and digital trade are making EU trade policy more complex and strategically important than ever, creating growing demand for trade professionals.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'eu-legal-jobs',
    name: 'EU Legal Jobs',
    h1: 'EU Legal & Law Jobs',
    tagline: 'Practice at the forefront of European law — from competition to regulation.',
    description: `EU law is one of the most sophisticated and impactful legal systems in the world, and Brussels is its epicentre. The field encompasses competition law (mergers, cartels, state aid), regulatory law (GDPR, financial regulation, pharmaceutical law), trade law, institutional law, and litigation before the EU courts in Luxembourg.\n\nEU legal careers span international law firms, the Legal Service of EU institutions, in-house counsel at companies navigating EU regulation, and specialised consultancies advising on compliance. Brussels has one of the highest concentrations of international lawyers in the world.\n\nThe constant evolution of EU legislation — from the AI Act to the Green Deal — ensures that EU legal work remains intellectually stimulating and commercially important. Lawyers who specialise in EU law can expect rewarding careers with strong demand for their expertise.`,
    keywords: ['EU legal jobs', 'EU law careers', 'competition law Brussels', 'EU lawyer jobs', 'regulatory law EU'],
    filters: { titleKeywords: ['legal', 'lawyer', 'attorney', 'counsel', 'law', 'juridical', 'compliance', 'regulatory'] },
    faqs: [
      { question: 'What areas of EU law are most in demand?', answer: 'Competition law (mergers, antitrust, state aid), data protection (GDPR), financial regulation, digital regulation (DSA/DMA/AI Act), environmental law, and trade law are currently the most active and in-demand areas of EU legal practice.' },
      { question: 'Can I practice EU law without being qualified in Belgium?', answer: 'Yes. Under EU directives, lawyers qualified in any EU member state can practice in Brussels. Many international law firms in Brussels have lawyers qualified in the UK, Germany, France, and other jurisdictions working primarily on EU matters.' },
      { question: 'What do EU law firms in Brussels pay?', answer: 'International law firms in Brussels pay competitively: junior associates typically start at 4,000-6,000/month, mid-level associates earn 7,000-12,000/month, and senior roles pay significantly more. Boutique EU law firms may offer slightly different ranges.' },
      { question: 'What is the EU Legal Service?', answer: 'Each EU institution has a Legal Service that provides internal legal advice, represents the institution before EU courts, and ensures legislative proposals are legally sound. These are prestigious roles typically recruited through EPSO competitions.' },
    ],
    enabled: true,
    colors: { primary: 'slate', accent: 'blue' },
  },
  {
    slug: 'eu-health-jobs',
    name: 'EU Health Jobs',
    h1: 'EU Health Policy & Pharmaceutical Jobs',
    tagline: 'Shape European health policy — from pandemic preparedness to pharmaceutical regulation.',
    description: `The COVID-19 pandemic elevated EU health policy to unprecedented importance, leading to the creation of HERA (Health Emergency Preparedness and Response Authority) and strengthening existing bodies like the European Medicines Agency (EMA), European Centre for Disease Prevention and Control (ECDC), and DG SANTE.\n\nEU health roles span pharmaceutical regulation, public health policy, medical device assessment, health data governance, and cross-border health threats. The sector engages EU institutions, agencies, pharmaceutical companies, health-focused NGOs, and specialised consultancies.\n\nWith the EU Pharmaceutical Strategy, European Health Data Space, and ongoing health security initiatives, demand for health policy professionals continues to grow. The intersection of health, digital technology, and EU regulation creates particularly dynamic career opportunities.`,
    keywords: ['EU health jobs', 'pharmaceutical jobs EU', 'EMA careers', 'health policy Brussels', 'medical affairs EU'],
    filters: { titleKeywords: ['health', 'pharmaceutical', 'medical', 'pharma', 'biotech', 'clinical', 'EMA', 'medicines', 'healthcare'] },
    faqs: [
      { question: 'What EU bodies work on health policy?', answer: 'Key EU health bodies include DG SANTE (European Commission), EMA (European Medicines Agency in Amsterdam), ECDC (European Centre for Disease Prevention and Control in Stockholm), and HERA (Health Emergency Preparedness and Response Authority).' },
      { question: 'What types of EU health jobs are available?', answer: 'Roles include pharmaceutical regulatory affairs, public health policy officers, clinical assessors, health economists, medical writers, pharmacovigilance specialists, health technology assessment experts, and government affairs managers in pharma companies.' },
      { question: 'Where are EU health jobs located?', answer: 'Brussels (Commission, pharma company offices), Amsterdam (EMA), Stockholm (ECDC), and Parma (EFSA for food safety) are main locations. Pharmaceutical companies also maintain regulatory affairs teams in Brussels.' },
      { question: 'Is the EU health sector growing?', answer: 'Yes, significantly. Post-pandemic investments in health security, the Pharmaceutical Strategy, European Health Data Space, and ongoing health challenges have expanded the EU health ecosystem and created new professional opportunities.' },
    ],
    enabled: true,
    colors: { primary: 'red', accent: 'pink' },
  },
  {
    slug: 'eu-defence-jobs',
    name: 'EU Defence Jobs',
    h1: 'EU Defence & Security Jobs',
    tagline: 'Join Europe\'s growing defence and security sector.',
    description: `European defence and security has undergone a dramatic transformation since 2022, with massive increases in defence spending, the creation of new EU defence instruments, and a renewed focus on European strategic autonomy. The European Defence Agency (EDA), EU Military Staff, and new initiatives like the European Defence Fund have created growing demand for defence professionals.\n\nRoles span defence policy analysis, military planning, procurement and industry relations, cybersecurity, intelligence analysis, space and dual-use technology, and defence diplomacy. Both NATO (headquartered in Brussels) and EU defence bodies offer careers in this expanding field.\n\nWith EU defence spending set to increase substantially and new frameworks for defence cooperation being developed, this is one of the fastest-growing career sectors in Brussels.`,
    keywords: ['EU defence jobs', 'NATO careers', 'European defence jobs', 'security policy EU', 'military jobs Brussels'],
    filters: { titleKeywords: ['defence', 'defense', 'military', 'security', 'NATO', 'arms', 'strategic', 'intelligence'] },
    faqs: [
      { question: 'What EU bodies work on defence?', answer: 'Key bodies include the European Defence Agency (EDA), EU Military Staff (EUMS), European External Action Service (EEAS), Satellite Centre (SatCen), and the European Defence Fund. NATO headquarters is also in Brussels, offering additional opportunities.' },
      { question: 'Are EU defence jobs growing?', answer: 'Yes, rapidly. Post-2022 geopolitical shifts have led to significant increases in EU and national defence spending, creating new positions in defence policy, procurement, industry cooperation, cybersecurity, and strategic analysis.' },
      { question: 'Do I need military experience for EU defence jobs?', answer: 'Not always. While some positions require military or intelligence backgrounds, many roles in defence policy, procurement, industry affairs, and administration are open to civilians with relevant policy, legal, or technical expertise.' },
      { question: 'What security clearance is needed?', answer: 'Many EU and NATO defence positions require security clearance, which is processed through your national authorities. The clearance level (Confidential, Secret, or Top Secret) depends on the specific role. The process can take several months.' },
    ],
    enabled: true,
    colors: { primary: 'slate', accent: 'blue' },
  },
  {
    slug: 'eu-finance-jobs',
    name: 'EU Finance Jobs',
    h1: 'EU Finance & Economic Policy Jobs',
    tagline: 'Work on economic governance, financial regulation, and EU fiscal policy.',
    description: `EU financial regulation and economic governance employ thousands of professionals across Brussels, Frankfurt, and Paris. The European Central Bank (ECB), European Banking Authority (EBA), European Securities and Markets Authority (ESMA), and DG FISMA at the European Commission form the core of the EU financial regulatory framework.\n\nRoles encompass banking supervision, capital markets regulation, anti-money laundering policy, sustainable finance (EU taxonomy, ESG reporting), payment services regulation, and economic forecasting. The private sector — banks, asset managers, and fintech companies — also maintains significant government affairs and compliance teams in Brussels.\n\nWith ongoing regulatory evolution (Basel III implementation, sustainable finance, crypto-assets regulation), the demand for professionals who understand both finance and EU policy continues to grow.`,
    keywords: ['EU finance jobs', 'ECB careers', 'financial regulation EU', 'banking jobs Brussels', 'economic policy EU'],
    filters: { titleKeywords: ['finance', 'economic', 'banking', 'fiscal', 'monetary', 'financial regulation', 'ESG', 'investment', 'audit'] },
    faqs: [
      { question: 'What EU bodies work on financial regulation?', answer: 'Key bodies include the ECB (Frankfurt), EBA (Paris), ESMA (Paris), EIOPA (Frankfurt), DG FISMA at the Commission (Brussels), the Single Resolution Board (Brussels), and the European Investment Bank (Luxembourg).' },
      { question: 'What qualifications are needed for EU finance roles?', answer: 'Degrees in economics, finance, law, or accounting are typical. Professional qualifications (CFA, ACCA) are valued in some roles. Understanding of EU regulatory frameworks and financial markets is essential for policy roles.' },
      { question: 'How much do EU finance professionals earn?', answer: 'EU institutional finance roles follow standard grade scales (AD5-AD16). ECB salaries are among the highest in the EU system. Private sector finance roles in Brussels pay 4,000-15,000+/month depending on seniority and institution.' },
      { question: 'Is Brussels important for financial regulation?', answer: 'Extremely. While the ECB is in Frankfurt and EBA/ESMA are in Paris, Brussels is where financial legislation is drafted (Commission), debated (Parliament), and negotiated (Council). Most financial industry lobbying also takes place in Brussels.' },
    ],
    enabled: true,
    colors: { primary: 'emerald', accent: 'green' },
  },
  {
    slug: 'eu-research-jobs',
    name: 'EU Research Jobs',
    h1: 'EU Research & Innovation Jobs',
    tagline: 'Drive European innovation — from Horizon Europe to cutting-edge science.',
    description: `The EU is one of the world's largest funders of research and innovation, with the Horizon Europe programme providing nearly 100 billion euros for 2021-2027. DG RTD (Research and Innovation) at the European Commission, the European Research Council (ERC), and executive agencies like REA and EISMEA manage this vast research ecosystem.\n\nRoles span research policy, programme management, grant evaluation, innovation strategy, technology transfer, and scientific communication. Brussels hosts the policy side while research institutions across Europe carry out funded projects.\n\nWith the EU's focus on strategic technologies (AI, quantum, biotechnology, clean energy), career opportunities in research policy and innovation management continue to expand.`,
    keywords: ['EU research jobs', 'Horizon Europe careers', 'research policy EU', 'ERC jobs', 'innovation EU'],
    filters: { titleKeywords: ['research', 'innovation', 'science', 'R&D', 'Horizon', 'ERC', 'scientific', 'technology transfer'] },
    faqs: [
      { question: 'What is Horizon Europe?', answer: 'Horizon Europe is the EU key research and innovation funding programme with nearly 100 billion euros for 2021-2027. It supports fundamental research (ERC), collaborative projects (Pillar 2), and innovation (EIC). It is the world largest transnational research programme.' },
      { question: 'What types of EU research jobs exist?', answer: 'Roles include research policy officers (Commission), programme managers (executive agencies), grant evaluators, research integrity officers, innovation consultants, and science communication specialists. Both policy and operational positions are available.' },
      { question: 'Do I need a PhD for EU research policy roles?', answer: 'A PhD is valued but not always required. Many research policy roles require a Master degree plus relevant experience in research management, science policy, or innovation. Technical expertise in specific fields (health, digital, energy) is often more important.' },
      { question: 'Where are EU research jobs based?', answer: 'Research policy roles are mainly in Brussels (DG RTD). Executive agencies managing Horizon Europe are in Brussels. The ERC is in Brussels. The Joint Research Centre (JRC) has sites in Ispra, Seville, Karlsruhe, Petten, and Geel.' },
    ],
    enabled: true,
    colors: { primary: 'cyan', accent: 'blue' },
  },
  {
    slug: 'eu-development-jobs',
    name: 'EU Development Jobs',
    h1: 'EU International Development & Cooperation Jobs',
    tagline: 'Work on global development — the EU is the world\'s largest aid donor.',
    description: `The European Union and its member states collectively form the world's largest provider of official development assistance (ODA). DG INTPA (International Partnerships) at the Commission manages development cooperation, while the European External Action Service (EEAS) coordinates EU foreign policy including development dimensions.\n\nDevelopment roles in Brussels cover programme management, policy analysis, monitoring and evaluation, humanitarian aid coordination, and partner country engagement. The EU works across all development sectors: health, education, governance, climate adaptation, food security, and digital development.\n\nWith the Global Gateway initiative and evolving EU development partnerships, professionals with development expertise combined with EU institutional knowledge are in strong demand.`,
    keywords: ['EU development jobs', 'international cooperation EU', 'DG INTPA jobs', 'aid jobs Brussels', 'development policy EU'],
    filters: { titleKeywords: ['development', 'cooperation', 'humanitarian', 'aid', 'global gateway', 'INTPA', 'developing countries', 'capacity building'] },
    faqs: [
      { question: 'What is the EU role in international development?', answer: 'The EU and its member states are the largest global provider of development aid. DG INTPA manages EU development cooperation programmes worth billions of euros annually, covering areas from health and education to governance, climate, and digital development.' },
      { question: 'What types of development jobs are in Brussels?', answer: 'Roles include programme managers, policy officers, monitoring and evaluation specialists, humanitarian affairs officers, external relations advisors, and consultants specialising in specific sectors or regions. NGOs working on development also offer many positions.' },
      { question: 'Do I need field experience for EU development roles?', answer: 'Field experience in developing countries is highly valued, especially for programme management and operational roles. However, many policy positions in Brussels prioritise EU institutional knowledge and analytical skills over field experience.' },
      { question: 'What is the Global Gateway?', answer: 'Global Gateway is the EU strategy to invest 300 billion euros in infrastructure and development projects worldwide by 2027. It focuses on digital, climate and energy, transport, health, and education, and is creating new career opportunities in development cooperation.' },
    ],
    enabled: true,
    colors: { primary: 'orange', accent: 'amber' },
  },
  {
    slug: 'public-affairs-jobs-brussels',
    name: 'Public Affairs Jobs Brussels',
    h1: 'Public Affairs & Government Relations Jobs in Brussels',
    tagline: 'Navigate the EU\'s regulatory landscape — the world\'s most active lobbying hub.',
    description: `Brussels is the second-largest lobbying centre in the world after Washington DC, with over 12,000 organisations registered in the EU Transparency Register. Public affairs professionals help companies, trade associations, and NGOs navigate and influence EU legislation that affects industries worldwide.\n\nThe Brussels PA ecosystem includes major international consultancies (FleishmanHillard, Burson, APCO, Kreab), boutique EU affairs firms, in-house government affairs teams at corporations (Google, Microsoft, pharma companies), and trade associations representing every imaginable sector.\n\nPublic affairs offers some of the highest private-sector salaries in Brussels, with excellent career progression. The work is fast-paced, intellectually stimulating, and directly connected to policy outcomes that shape markets and societies.`,
    keywords: ['public affairs jobs Brussels', 'lobbying jobs EU', 'government affairs Brussels', 'PA consultancy jobs', 'EU advocacy careers'],
    filters: { cities: ['Brussels', 'Bruxelles'], titleKeywords: ['public affairs', 'government affairs', 'government relations', 'lobbying', 'advocacy', 'regulatory affairs', 'PA '] },
    faqs: [
      { question: 'What is public affairs in Brussels?', answer: 'Public affairs involves helping organisations engage with EU policy-makers to shape legislation and regulation. This includes monitoring legislative developments, developing positions, engaging with MEPs and Commission officials, and building coalitions around policy issues.' },
      { question: 'What does a PA consultant do?', answer: 'PA consultants advise clients on EU regulatory developments, develop advocacy strategies, draft position papers, organise stakeholder events, monitor legislative processes, and build relationships with key policy-makers across EU institutions.' },
      { question: 'How much do public affairs professionals earn?', answer: 'Junior consultants start at 3,000-4,000/month. Mid-level consultants earn 5,000-8,000/month. Senior directors and partners can earn 10,000-15,000+/month. In-house corporate roles often pay at the higher end of these ranges.' },
      { question: 'What background is best for EU public affairs?', answer: 'Political science, law, EU studies, and communications are common backgrounds. Experience in EU institutions, political campaigns, or journalism is highly valued. Strong writing, analytical, and networking skills are essential.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'eu-communication-jobs',
    name: 'EU Communication Jobs',
    h1: 'EU Communications & Media Jobs',
    tagline: 'Tell Europe\'s story — from institutional communication to EU media.',
    description: `Communication is essential to the EU's democratic legitimacy and public engagement. The European Commission's DG COMM, the European Parliament's communication directorate, and the Spokesperson's Service employ hundreds of communication professionals. Beyond institutions, every organisation in Brussels — from consultancies to NGOs — needs skilled communicators.\n\nEU communication roles span press and media relations, digital and social media management, public campaigns, audiovisual production, and strategic communication planning. The field has evolved significantly with digital transformation, requiring skills in data-driven communication and audience engagement.\n\nWith the EU combating disinformation, increasing citizen engagement, and promoting its global role, demand for communication professionals who understand both EU policy and modern media landscapes continues to grow.`,
    keywords: ['EU communication jobs', 'press officer EU', 'media jobs Brussels', 'communications manager EU', 'EU spokesperson'],
    filters: { titleKeywords: ['communication', 'press officer', 'spokesperson', 'media relations', 'social media', 'content', 'editor', 'journalist', 'PR '] },
    faqs: [
      { question: 'What communication roles exist in EU institutions?', answer: 'EU institutions hire press officers, social media managers, web editors, audiovisual producers, graphic designers, event communicators, and strategic communication planners. The Commission Spokesperson Service is one of the most visible roles.' },
      { question: 'What skills are needed for EU communications?', answer: 'Strong writing skills, media relations experience, digital and social media expertise, understanding of EU policy, and multilingualism. Video production, data visualisation, and SEO/digital marketing skills are increasingly valued.' },
      { question: 'How do EU communications differ from corporate PR?', answer: 'EU institutional communication focuses on explaining complex legislation to citizens, countering disinformation, and supporting democratic processes. It requires understanding of policy nuances and navigating the institutional landscape. Corporate PR in Brussels often focuses on advocacy communications.' },
      { question: 'What media outlets cover EU affairs?', answer: 'Key EU-focused media include POLITICO Europe, Euractiv, EUobserver, The Brussels Times, MLex, and PaRR. International outlets like Reuters, Bloomberg, AFP, and major newspapers maintain Brussels bureaux covering EU affairs.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'human-rights-jobs-brussels',
    name: 'Human Rights Jobs Brussels',
    h1: 'Human Rights & Democracy Jobs in Brussels',
    tagline: 'Defend fundamental rights and democracy at the European level.',
    description: `Brussels and The Hague form Europe's human rights corridor, hosting the EU Agency for Fundamental Rights (FRA), the European Court of Human Rights (Strasbourg), and dozens of human rights NGOs with EU advocacy offices. Human rights work in Brussels focuses on influencing EU legislation and foreign policy to protect fundamental rights both within Europe and globally.\n\nRoles include policy officers monitoring rights developments, legal experts on EU fundamental rights law, campaigners working on migration, digital rights, or rule of law issues, and programme managers coordinating EU-funded human rights projects.\n\nWith ongoing debates about rule of law in EU member states, migration policy, digital rights, and the EU's role in promoting human rights globally, this field remains deeply relevant and dynamic.`,
    keywords: ['human rights jobs Brussels', 'democracy jobs EU', 'fundamental rights EU', 'rule of law EU', 'rights advocacy Brussels'],
    filters: { titleKeywords: ['human rights', 'fundamental rights', 'democracy', 'rule of law', 'civil liberties', 'equality', 'discrimination', 'asylum', 'migration rights'] },
    faqs: [
      { question: 'What organisations work on human rights in Brussels?', answer: 'Key organisations include the EU Agency for Fundamental Rights (FRA), Amnesty International EU, Human Rights Watch EU, the European Network of National Human Rights Institutions (ENNHRI), ILGA-Europe, the European Digital Rights (EDRi), and many others.' },
      { question: 'What types of human rights roles are available?', answer: 'Roles include policy and advocacy officers, legal researchers, campaign coordinators, programme managers for EU-funded rights projects, communications specialists, and monitoring and reporting officers.' },
      { question: 'Do human rights jobs pay well?', answer: 'NGO human rights roles typically pay 2,500-6,000/month in Brussels. EU institutional roles (FRA, Commission) follow standard EU salary scales, which are significantly higher. International organisations in The Hague and Geneva also offer competitive packages.' },
      { question: 'What background is best for human rights work?', answer: 'Law (especially international and EU human rights law), political science, and international relations are the most common backgrounds. Field experience with human rights organisations, knowledge of EU policy processes, and language skills enhance competitiveness.' },
    ],
    enabled: true,
    colors: { primary: 'violet', accent: 'purple' },
  },

  // === BY LEVEL (4) ===
  {
    slug: 'senior-positions',
    name: 'Senior EU Positions',
    h1: 'Senior & Executive Positions in EU Affairs',
    tagline: 'Lead at the highest levels — director, head of unit, and C-suite roles.',
    description: `Senior positions in the EU bubble represent the pinnacle of European affairs careers. Whether you are targeting a Head of Unit role at the European Commission, a Director position at a major consultancy, a Secretary General appointment at a trade association, or a C-suite role at an international NGO, these positions require deep EU expertise and proven leadership.\n\nSenior EU roles combine strategic vision with operational excellence. Leaders in this space shape organisational direction, manage complex stakeholder relationships across institutions and member states, and drive policy outcomes on issues affecting millions of Europeans.\n\nThese positions offer exceptional compensation, significant influence, and the satisfaction of leading teams and organisations at the heart of European decision-making. Competition is fierce, but the rewards match the challenge.`,
    keywords: ['senior EU jobs', 'EU director positions', 'head of unit EU', 'executive Brussels jobs', 'C-suite EU affairs'],
    filters: { seniority: ['senior', 'executive'] },
    faqs: [
      { question: 'What senior positions are available in the EU sector?', answer: 'Senior roles include Head of Unit (AD12-14) at EU institutions, Director/Director-General positions, Secretary General of associations, Managing Director at consultancies, Country Director at NGOs, and Partner at law firms specialising in EU law.' },
      { question: 'How much do senior EU positions pay?', answer: 'EU institution senior roles (AD12-16) pay 10,000-18,000+/month. Private sector directors at consultancies earn 10,000-20,000+/month. Association Secretary Generals typically earn 8,000-15,000/month. These figures exclude allowances and bonuses.' },
      { question: 'How do I progress to senior EU roles?', answer: 'Senior roles typically require 10-20 years of experience, deep sector expertise, extensive institutional networks, proven management ability, and often experience across multiple organisations (institutions, private sector, associations, or NGOs).' },
      { question: 'Are senior EU positions recruited differently?', answer: 'Yes. Many senior positions use executive search firms, informal networks, or the Senior Management Committee process (for EU institution appointments). Building your reputation and network over years is often more important than formal applications.' },
    ],
    enabled: true,
    colors: { primary: 'slate', accent: 'blue' },
  },
  {
    slug: 'traineeships',
    name: 'EU Traineeships',
    h1: 'EU Traineeships & Internships',
    tagline: 'Start your EU career — Blue Book, Schuman, and hundreds more opportunities.',
    description: `EU traineeships are the most popular entry point for careers in the Brussels bubble. The European Commission's Blue Book programme and the European Parliament's Schuman traineeship are the flagships, each offering 5-month paid placements with a monthly grant of approximately 1,300-1,400 euros.\n\nBeyond these institutional programmes, EU agencies, the Council, the Court of Justice, the ECB, and other EU bodies all run their own traineeship schemes. Trade associations, NGOs, consultancies, and law firms in Brussels also offer internships ranging from 3 to 12 months.\n\nTraineeships provide invaluable first-hand experience in EU policy-making, help build professional networks, and are widely recognised as the best launchpad for a career in European affairs. Former trainees have gone on to become Commissioners, MEPs, senior officials, and industry leaders.`,
    keywords: ['EU traineeships', 'Blue Book traineeship', 'Schuman traineeship', 'EU internships', 'Brussels internships'],
    filters: { seniority: ['intern'], titleKeywords: ['trainee', 'traineeship', 'intern', 'internship', 'stage', 'stagiaire', 'graduate programme', 'junior fellowship'] },
    faqs: [
      { question: 'What are the main EU traineeship programmes?', answer: 'The two flagship programmes are the European Commission Blue Book traineeship and the European Parliament Schuman traineeship. Additionally, nearly all EU bodies — agencies, the Council, the Court, the ECB — offer their own traineeship programmes.' },
      { question: 'Are EU traineeships paid?', answer: 'Yes. The Blue Book and Schuman traineeships pay approximately 1,300-1,400/month. EU agency traineeships are also generally paid. Private sector internships in Brussels vary — Belgian law increasingly requires fair compensation for interns.' },
      { question: 'How competitive are EU traineeships?', answer: 'Very competitive. The Blue Book programme receives 15,000+ applications for about 900 places per intake. Strong academic records, language skills (especially French alongside English), and relevant experience significantly improve your chances.' },
      { question: 'When should I apply for EU traineeships?', answer: 'Blue Book applications open in January (October start) and July (March start). Plan 6-12 months ahead. Other institutional programmes follow their own calendars. Private sector internships can often be arranged with shorter notice.' },
      { question: 'Can traineeships lead to permanent employment?', answer: 'While not guaranteed, traineeships are the recognised entry point for EU careers. Many former trainees secure contract agent positions, pass EPSO competitions, or find roles in the Brussels ecosystem. The experience and network are invaluable.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'graduate-roles',
    name: 'Graduate EU Roles',
    h1: 'Graduate & Entry-Level EU Jobs',
    tagline: 'Launch your European affairs career — roles for recent graduates.',
    description: `Breaking into the Brussels job market as a recent graduate is challenging but achievable. While EU institution permanent posts require EPSO competitions, the broader EU affairs ecosystem offers numerous entry points for talented graduates: junior consultant positions at PA firms, research assistant roles at think tanks, programme assistant positions at NGOs, and graduate trainee schemes at trade associations.\n\nMost graduate roles in Brussels require a Master's degree (or equivalent), strong language skills (English plus one or more EU languages, especially French), and demonstrable interest in EU affairs. Previous internship experience, even short-term, is highly valued and often expected.\n\nThe first 2-3 years in Brussels are crucial for building expertise, networks, and a professional reputation. Many successful EU affairs professionals started in modest graduate roles and progressed rapidly through the ecosystem.`,
    keywords: ['graduate EU jobs', 'entry-level Brussels', 'junior EU positions', 'first job Brussels', 'EU careers graduates'],
    filters: { seniority: ['junior'], titleKeywords: ['junior', 'graduate', 'entry.level', 'assistant', 'associate'] },
    faqs: [
      { question: 'What types of graduate roles are available in Brussels?', answer: 'Common entry-level roles include junior consultant (PA firms), research assistant (think tanks), programme/project assistant (NGOs), policy assistant (trade associations), editorial assistant (media), and paralegal (law firms). Many are advertised on EUJobs.co.' },
      { question: 'What qualifications do graduates need for Brussels?', answer: 'Most roles require a Master degree in political science, EU studies, law, economics, or related fields. English fluency is essential, French is almost always expected. Previous internship experience in Brussels or EU-related work is highly valued.' },
      { question: 'What salary can graduates expect in Brussels?', answer: 'Graduate salaries in Brussels typically range from 2,000-3,500/month depending on the sector. NGOs and think tanks pay at the lower end, while consultancies and law firms are more competitive. Salaries increase rapidly with experience.' },
      { question: 'How important is a Master degree for Brussels jobs?', answer: 'Very important. A Master degree is the effective minimum for most professional roles in EU affairs. Popular programmes include the College of Europe (Bruges/Natolin), Sciences Po, LSE, KU Leuven, and ULB, but any strong Master in a relevant field is accepted.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  {
    slug: 'remote-eu-jobs',
    name: 'Remote EU Jobs',
    h1: 'Remote & Hybrid EU Jobs',
    tagline: 'Work in EU affairs from anywhere — remote and hybrid opportunities.',
    description: `The post-pandemic world has transformed EU working patterns. While Brussels remains the physical centre of EU affairs, many organisations now offer remote or hybrid arrangements. Consultancies, think tanks, NGOs, and tech companies with EU government affairs teams increasingly allow staff to work from anywhere in Europe at least part of the time.\n\nRemote-friendly EU roles include policy monitoring and analysis, digital communications, research and writing, project management, grant writing, and regulatory consulting. EU institutions themselves have introduced more flexible working arrangements, though most still require Brussels or Luxembourg presence.\n\nRemote EU jobs are particularly attractive for professionals in EU member states who want to engage with EU affairs without relocating to Brussels, or for Brussels-based professionals seeking greater flexibility.`,
    keywords: ['remote EU jobs', 'work from home EU', 'hybrid EU positions', 'remote Brussels jobs', 'flexible EU careers'],
    filters: { titleKeywords: ['remote', 'telework', 'work from home', 'hybrid', 'flexible location', 'home.based'] },
    faqs: [
      { question: 'Can I work in EU affairs remotely?', answer: 'Yes, increasingly. Many consultancies, think tanks, NGOs, and tech companies offer remote or hybrid arrangements. EU institutions have also introduced more flexible working but generally require regular Brussels/Luxembourg presence.' },
      { question: 'What EU jobs can be done remotely?', answer: 'Policy monitoring and analysis, research and writing, digital communications, project and grant management, regulatory consulting, and translation are all well-suited to remote work. Client-facing roles and institutional positions typically require more in-person presence.' },
      { question: 'Do remote EU jobs pay the same as Brussels-based roles?', answer: 'Pay varies. Some organisations maintain Brussels salary levels for remote workers, while others adjust for local cost of living. EU institutions apply correction coefficients based on your duty station location.' },
      { question: 'How do I find remote EU job opportunities?', answer: 'Check EUJobs.co and filter for remote positions. LinkedIn remote filters and specialised remote job boards also list EU affairs roles. Many job postings now specify "hybrid" or "remote-friendly" in their descriptions.' },
    ],
    enabled: true,
    colors: { primary: 'blue', accent: 'indigo' },
  },
  // === GENEVA (competing with jobsingeneva.org) ===
  {
    slug: 'geneva',
    name: 'Jobs in Geneva',
    h1: 'Find Jobs in Geneva — International Organizations, NGOs & UN Agencies',
    tagline: 'Geneva is the world capital of multilateral diplomacy. Discover roles at WHO, ILO, ICRC, WTO, UNHCR, and 40+ international organizations.',
    description: `Geneva is the world capital of multilateral diplomacy and home to the European headquarters of the United Nations at the Palais des Nations. Over 40 international organizations are headquartered in the city, making it one of the most concentrated hubs for global governance careers anywhere on earth.\n\nKey employers include the World Health Organization (WHO), the International Labour Organization (ILO), the International Committee of the Red Cross (ICRC), the World Trade Organization (WTO), the UN High Commissioner for Refugees (UNHCR), the World Intellectual Property Organization (WIPO), the International Telecommunication Union (ITU), UNAIDS, and CERN — the European Organization for Nuclear Research. Major NGOs such as Médecins Sans Frontières (MSF), GAVI the Vaccine Alliance, and the Global Fund are also based in Geneva, alongside the World Economic Forum (WEF) and the Graduate Institute of International and Development Studies.\n\nSalaries in Geneva's international sector are denominated in Swiss francs (CHF) and are among the highest in the world. Many international organization roles offer tax-advantaged compensation packages: UN system salaries, for example, are exempt from Swiss income tax. Entry-level professional positions (P2/P3) typically start around CHF 90,000–120,000, while senior roles (P5/D1) can exceed CHF 200,000 — plus benefits such as education grants, home leave, and pension contributions.\n\nWorking in Geneva generally requires strong English and French. Most international organizations operate bilingually, and French is essential for daily life, housing, and integration into the local community. Additional UN languages (Spanish, Arabic, Chinese, Russian) are highly valued.\n\nGeneva offers an exceptional quality of life — it is consistently ranked among the safest and most liveable cities in the world. The cost of living is high, but international salaries more than compensate. Compared to Brussels, which is the hub for EU institutional careers, Geneva is the center for UN system and humanitarian roles. The two cities are complementary rather than competing: many professionals build careers across both.`,
    keywords: ['Geneva jobs', 'UN jobs Geneva', 'WHO careers', 'international organization jobs Geneva', 'ILO jobs', 'ICRC careers', 'NGO jobs Geneva', 'WTO jobs', 'UNHCR jobs', 'Switzerland international jobs', 'multilateral jobs Geneva'],
    filters: {
      cities: ['Geneva', 'Genève', 'Genf'],
      countries: ['Switzerland', 'Suisse', 'Schweiz'],
      companyPatterns: [
        'world health organization', 'WHO',
        'international labour', 'ILO',
        'red cross', 'ICRC', 'CICR',
        'world trade organization', 'WTO',
        'UNHCR', 'refugee',
        'WIPO', 'intellectual property',
        'ITU', 'telecommunication',
        'UNAIDS',
        'CERN',
        'world economic forum', 'WEF',
        'médecins sans frontières', 'doctors without borders', 'MSF',
        'GAVI', 'vaccine alliance',
        'global fund',
        'inter-parliamentary union', 'IPU',
        'graduate institute',
      ],
    },
    faqs: [
      { question: 'What international organizations are based in Geneva?', answer: 'Geneva hosts over 40 international organizations including the UN European headquarters (Palais des Nations), WHO, ILO, ICRC, WTO, UNHCR, WIPO, ITU, UNAIDS, and CERN. Major NGOs like Médecins Sans Frontières (MSF), GAVI, and the Global Fund are also headquartered there, alongside the World Economic Forum.' },
      { question: 'What salary can I expect working in Geneva?', answer: 'Salaries in Geneva are denominated in Swiss francs (CHF) and are among the highest globally. UN system entry-level professional roles (P2/P3) typically pay CHF 90,000–120,000, while senior positions (P5/D1) exceed CHF 200,000. Many international organization salaries are exempt from Swiss income tax, and packages often include education grants, pension contributions, and home leave allowances.' },
      { question: 'Do I need to speak French to work in Geneva?', answer: 'Most international organizations in Geneva operate bilingually in English and French. While English is the primary working language in many UN agencies, French is essential for daily life, housing, and community integration. Strong French significantly improves your competitiveness for roles and is often listed as a requirement or strong advantage.' },
      { question: 'How does Geneva compare to Brussels or New York for international careers?', answer: 'Geneva is the global hub for UN system agencies, humanitarian organizations, and multilateral trade bodies. Brussels is the center for EU institutional careers and public affairs. New York hosts the UN General Assembly and Security Council. The three cities are complementary — many international professionals build careers across all three. Geneva stands out for its concentration of health, humanitarian, and trade organizations.' },
      { question: 'How do I apply for UN jobs in Geneva?', answer: 'UN positions in Geneva are posted on the UN Careers portal (careers.un.org) and on individual agency websites (e.g., who.int/careers, ilo.org/jobs). Applications typically require a detailed UN-format CV, a cover letter, and completion of an online application form. The process includes written assessments and competency-based interviews. Networking, JPO programmes, and UNV assignments are common entry points.' },
    ],
    enabled: true,
    colors: { primary: 'red', accent: 'white' },
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove old niches that are no longer in the new config
    const newSlugs = niches.map(n => n.slug);
    const removed = await Niche.deleteMany({ slug: { $nin: newSlugs } });
    if (removed.deletedCount > 0) {
      console.log(`Removed ${removed.deletedCount} old niche(s)`);
    }

    for (const config of niches) {
      await Niche.findOneAndUpdate({ slug: config.slug }, config, { upsert: true, new: true });
      console.log(`  Seeded: ${config.slug}`);
    }

    console.log(`\nSeeded ${niches.length} niches`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
