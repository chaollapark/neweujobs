// mongosh script to seed London niche into prod MongoDB
// Usage: docker exec eujobs-mongo mongosh --file /tmp/seed-london.js

db = db.getSiblingDB('test');

const london = {
  slug: 'london',
  name: 'Jobs in London',
  h1: 'Find International Affairs Jobs in London — Think Tanks, NGOs & Global Organizations',
  tagline: 'London is a global hub for diplomacy, international development, and policy research. Explore roles at EBRD, Chatham House, Amnesty International, and hundreds more.',
  description: "London is one of the world's top three cities for international affairs, alongside Brussels and Geneva. As a permanent member of the UN Security Council's host nation, a leading financial centre, and home to a vast network of think tanks, NGOs, and multilateral institutions, London offers unparalleled career opportunities in global policy and diplomacy.\n\nKey international employers headquartered in London include the European Bank for Reconstruction and Development (EBRD), the International Maritime Organization (IMO), and the Commonwealth Secretariat. The city hosts world-renowned think tanks such as Chatham House (the Royal Institute of International Affairs), the International Institute for Strategic Studies (IISS), the Overseas Development Institute (ODI), and the Royal United Services Institute (RUSI). Major international NGOs including Amnesty International, Save the Children, Oxfam, ActionAid, WaterAid, and Christian Aid all have their global or UK headquarters in London.\n\nSalaries in London's international affairs sector vary significantly by employer type. Think tank research roles typically pay £30,000–55,000, while senior policy positions at international organizations like EBRD offer £70,000–150,000+. NGO salaries range from £28,000 at entry level to £80,000+ for directors. The UK government's Foreign, Commonwealth and Development Office (FCDO) and British Council also offer substantial international affairs careers based in London.\n\nBrexit has reshaped London's international landscape but has not diminished its global standing. While some EU-focused roles have shifted to Brussels, London has strengthened its position in Commonwealth affairs, transatlantic policy, and Global South engagement. The city's world-class universities — LSE, SOAS, King's College London, and UCL — produce a steady pipeline of international affairs talent and host influential research centres.\n\nCompared to Geneva's focus on multilateral and humanitarian organizations, and Brussels' concentration on EU institutions, London excels in policy research, international development, human rights advocacy, and private-sector international consulting. Many professionals build careers across all three cities.",
  keywords: ['London international affairs jobs', 'think tank jobs London', 'NGO jobs London', 'EBRD careers', 'Chatham House jobs', 'international development jobs London', 'policy jobs London', 'Commonwealth Secretariat jobs', 'IMO careers', 'diplomacy jobs London'],
  filters: {
    cities: ['London'],
    countries: ['United Kingdom', 'UK', 'England'],
    companyPatterns: [
      'EBRD', 'European Bank for Reconstruction',
      'IMO', 'International Maritime',
      'Commonwealth Secretariat', 'Commonwealth',
      'Chatham House', 'Royal Institute of International Affairs',
      'IISS', 'International Institute for Strategic Studies',
      'ODI', 'Overseas Development Institute',
      'RUSI',
      'Amnesty International', 'Amnesty',
      'Save the Children',
      'Oxfam',
      'ActionAid', 'WaterAid', 'Christian Aid',
      'FCDO', 'Foreign Commonwealth',
      'British Council',
      'Wilton Park',
      'International Crisis Group',
      'Transparency International',
    ],
  },
  faqs: [
    { question: 'What international organizations are headquartered in London?', answer: 'London hosts several major international organizations including the European Bank for Reconstruction and Development (EBRD), the International Maritime Organization (IMO), and the Commonwealth Secretariat. It is also home to leading think tanks such as Chatham House, IISS, ODI, and RUSI, as well as the global headquarters of NGOs like Amnesty International, Save the Children, and Oxfam.' },
    { question: 'What salary can I expect in international affairs in London?', answer: 'Salaries vary by sector. Think tank research roles typically pay £30,000–55,000, senior policy positions at international organizations like EBRD offer £70,000–150,000+, and NGO roles range from £28,000 at entry level to £80,000+ for directors. Government roles at FCDO follow Civil Service pay scales. London weighting allowances often apply.' },
    { question: 'How has Brexit affected international affairs jobs in London?', answer: 'Brexit shifted some EU-focused lobbying and regulatory roles to Brussels, but London has reinforced its position in Commonwealth diplomacy, transatlantic policy, Global South engagement, and international development. New trade policy roles have emerged, and London remains the preferred European base for many global NGOs and think tanks.' },
    { question: 'How does London compare to Brussels and Geneva for international careers?', answer: 'Geneva is the hub for UN agencies and humanitarian organizations. Brussels is the centre for EU institutions and public affairs. London excels in policy research (think tanks), international development, human rights advocacy, Commonwealth affairs, and private-sector consulting. Many professionals build careers across all three cities, and the skill sets are highly transferable.' },
    { question: 'What qualifications do I need for think tank or policy jobs in London?', answer: "Most policy and research roles require a Master's degree in international relations, political science, economics, development studies, or a related field. Strong analytical and writing skills are essential. Leading universities for this path include LSE, SOAS, King's College London, Oxford, Cambridge, and UCL. Language skills and regional expertise are valued for area-specific roles." },
  ],
  enabled: true,
  colors: { primary: 'indigo', accent: 'blue' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const result = db.niches.updateOne(
  { slug: 'london' },
  { $set: london },
  { upsert: true }
);

print('London niche seeded:');
printjson(result);
