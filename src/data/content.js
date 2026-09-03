export const profile = {
  name: 'Mehedi Hasan',
  firstName: 'Mehedi',
  role: 'AI-Assisted Full-Stack Developer',
  tagline: "I build playful, blazing-fast web apps people love using.",
  bio: "I'm Mehedi Hasan, an AI-assisted full-stack developer from Rajshahi, Bangladesh. I turn wild ideas into polished products — from pixel-perfect UI to API design — and I love shipping fast, friendly software that feels a little more fun than the average.",
  location: 'Rajshahi, Bangladesh',
  email: 'iamehedihsn@gmail.com',
  resumeUrl: '#',
  avatarEmoji: '🧑‍🚀',
  stats: [
    { value: '🎓 7h', label: 'Of class' },
    { value: '💻 6h', label: 'Of code' },
    { value: '💡 2h', label: 'Brainstorming' },
    { value: '😴 9h', label: 'Sleeping & eating' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/iamehedi' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/' },
    { label: 'Twitter', url: 'https://x.com/' },
    { label: 'Dribbble', url: 'https://dribbble.com/' },
    { label: 'Facebook', url: 'https://facebook.com/' },
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'WhatsApp', url: 'https://wa.me/' },
  ],
}

export const skills = {
  groups: [
    {
      title: 'Frontend',
      emoji: '🎨',
      items: [
        { name: 'Flutter', level: 96 },
        { name: 'React', level: 92 },
        { name: 'TypeScript', level: 88 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'Next.js', level: 85 },
        { name: 'Vite', level: 90 },
      ],
    },
    {
      title: 'Backend',
      emoji: '⚙️',
      items: [
        { name: 'Python', level: 95 },
        { name: 'C++', level: 90 },
        { name: 'Node.js', level: 90 },
        { name: 'Express', level: 87 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'MongoDB', level: 82 },
        { name: 'GraphQL', level: 75 },
      ],
    },
    {
      title: 'Tools & Cloud',
      emoji: '🚀',
      items: [
        { name: 'Supabase', level: 96 },
        { name: 'Firebase', level: 92 },
        { name: 'WordPress', level: 94 },
        { name: 'Git & GitHub', level: 93 },
        { name: 'Docker', level: 78 },
        { name: 'AWS', level: 70 },
        { name: 'Vercel', level: 88 },
        { name: 'CI/CD', level: 76 },
      ],
    },
  ],
  marquee: [
    'React', 'Node.js', 'TypeScript', 'Tailwind', 'Next.js', 'Flutter',
    'Python', 'C++', 'GraphQL', 'PostgreSQL', 'Supabase', 'Firebase',
    'Docker', 'AWS', 'Vite', 'WordPress', 'Figma', 'Three.js',
  ],
}

export const projects = [
  {
    title: 'Nimbus Notes',
    coverUrl: '',
    emoji: '📝',
    description:
      'A collaborative note-taking app with real-time sync, markdown, and AI summarisation. Syncs across every device in under 40ms.',
    tags: ['React', 'Node.js', 'WebSockets', 'Redis'],
    accent: 'bg-punch/15',
    demo: '#',
    repo: 'https://github.com/',
    featured: true,
  },
  {
    title: 'Pulse Dashboard',
    coverUrl: '',
    emoji: '📊',
    description:
      'Real-time analytics dashboard streaming 1M+ events a day. Custom charts, alerts and a drag-and-drop widget grid.',
    tags: ['TypeScript', 'D3.js', 'PostgreSQL', 'AWS'],
    accent: 'bg-ocean/15',
    demo: '#',
    repo: 'https://github.com/',
    featured: true,
  },
  {
    title: 'Snacky',
    coverUrl: '',
    emoji: '🍜',
    description:
      'Food delivery web app with live order tracking, smart reordering and a map that makes hunger feel fast.',
    tags: ['Next.js', 'Tailwind', 'Stripe', 'Maps API'],
    accent: 'bg-sun/25',
    demo: '#',
    repo: 'https://github.com/',
    featured: true,
  },
  {
    title: 'FitBot',
    coverUrl: '',
    emoji: '💪',
    description:
      'AI workout coach that generates personalised routines from a quick chat — complete with form-check GIFs.',
    tags: ['React', 'OpenAI API', 'Supabase'],
    accent: 'bg-mint/15',
    demo: '#',
    repo: 'https://github.com/',
    featured: false,
  },
  {
    title: 'Travel Tales',
    coverUrl: '',
    emoji: '✈️',
    description:
      'A storytelling platform for travellers with interactive maps, photo journals and community challenges.',
    tags: ['Vue', 'GraphQL', 'MongoDB'],
    accent: 'bg-grape/15',
    demo: '#',
    repo: 'https://github.com/',
    featured: false,
  },
  {
    title: 'Noodles Time',
    coverUrl: '',
    emoji: '🫖',
    description:
      'A mood-based music & focus timer app that curates lo-fi playlists to match how you feel right now.',
    tags: ['React Native', 'Spotify API'],
    accent: 'bg-punch/15',
    demo: '#',
    repo: 'https://github.com/',
    featured: false,
  },
]

export const experience = [
  {
    role: 'Senior Full-Stack Developer',
    company: 'Pixel Foundry',
    period: '2023 — Present',
    emoji: '🔵',
    points: [
      'Led a team of 6 shipping a SaaS platform used by 40k+ users',
      'Cut page load times by 58% with code-splitting and edge caching',
      'Designed the API layer now powering 3 client products',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Code & Canvas',
    period: '2021 — 2023',
    emoji: '🟢',
    points: [
      'Built and launched 15+ client web apps end-to-end',
      'Introduced a component library that halved build time',
      'Mentored 4 junior developers into senior roles',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Bright Labs',
    period: '2020 — 2021',
    emoji: '🟣',
    points: [
      'Shipped accessible, animated marketing sites',
      'Implemented design systems in React + Tailwind',
      'Won "Best UI of the Year" at the internal hackathon',
    ],
  },
]

export const testimonials = [
  {
    quote:
      'Mehedi is a unicorn. He delivered a full product in three weeks and the design made our customers say "wow".',
    name: 'Sarah Chen',
    role: 'CEO, Nimbus',
    emoji: '🧑‍💼',
  },
  {
    quote:
      'Fast, communicative and obsessive about quality. Our dashboard load times went from seconds to instant.',
    name: 'David Okafor',
    role: 'CTO, Pulse',
    emoji: '👨‍💻',
  },
  {
    quote:
      'The rare developer who cares about the details most people miss. Every interaction feels delightful.',
    name: 'Priya Sharma',
    role: 'Product Lead, Snacky',
    emoji: '👩‍🎨',
  },
]

export const gallery = [
  { src: 'https://picsum.photos/seed/mhdev1/600/800', alt: 'Hackathon weekend', caption: 'Hackathon mode 🏆' },
  { src: 'https://picsum.photos/seed/mhdev2/600/700', alt: 'My desk setup', caption: 'My happy place 🖥️' },
  { src: 'https://picsum.photos/seed/mhdev3/600/900', alt: 'Noodles break', caption: 'Fuel: noodles 🍜' },
  { src: 'https://picsum.photos/seed/mhdev4/600/700', alt: 'Team offsite', caption: 'Team day 🧑‍🤝‍🧑' },
  { src: 'https://picsum.photos/seed/mhdev5/600/800', alt: 'Late night coding', caption: 'Shipping at night 🌙' },
  { src: 'https://picsum.photos/seed/mhdev6/600/900', alt: 'Speaking at a meetup', caption: 'On stage 🎤' },
  { src: 'https://picsum.photos/seed/mhdev7/600/600', alt: 'Sketching ideas', caption: 'Idea sketches 📓' },
  { src: 'https://picsum.photos/seed/mhdev8/600/800', alt: 'Evening city walk', caption: 'Code walk 🚶' },
  { src: 'https://picsum.photos/seed/mhdev9/600/700', alt: 'Coffee and code', caption: 'Coffee + code ☕💻' },
]

export const music = {
  vibe: 'Lo-fi, indie & synthwave while I build',
  note: 'Drop your real audio URLs (or a Spotify embed) in src/data/content.js to make these play.',
  playlist: [
    { title: 'Midnight City', artist: 'M83', duration: '4:03', emoji: '🌃', audioUrl: '', coverUrl: '' },
    { title: 'Nightcall', artist: 'Kavinsky', duration: '4:18', emoji: '🚗', audioUrl: '', coverUrl: '' },
    { title: 'Tadow', artist: 'Masego & FKJ', duration: '5:01', emoji: '🎷', audioUrl: '', coverUrl: '' },
    { title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:57', emoji: '🌅', audioUrl: '', coverUrl: '' },
    { title: 'Sleepyhead', artist: 'Passion Pit', duration: '2:55', emoji: '💤', audioUrl: '', coverUrl: '' },
    { title: 'Burning', artist: 'Whitney', duration: '3:10', emoji: '🔥', audioUrl: '', coverUrl: '' },
  ],
  spotifyEmbedUrl: '',
}

export const certifications = [
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta',
    issueDate: '2024',
    credentialId: 'META-FED-2024-889',
    credentialUrl: 'https://coursera.org/verify/professional-cert',
    imageUrl: '',
    emoji: '⚛️',
    skills: ['React', 'JavaScript', 'HTML5 & CSS3', 'UI/UX', 'Responsive Design'],
    description:
      'Comprehensive 9-course program covering modern front-end development, component architecture, testing, and responsive UI engineering.',
  },
  {
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issueDate: '2023',
    credentialId: 'AWS-SAA-839201',
    credentialUrl: 'https://aws.amazon.com/verification',
    imageUrl: '',
    emoji: '☁️',
    skills: ['AWS', 'Cloud Architecture', 'Serverless', 'Security', 'S3 & Lambda'],
    description:
      'Demonstrated expertise in architecting resilient, secure, high-performing, and cost-optimized distributed systems on AWS.',
  },
  {
    title: 'Google Professional Cloud Developer',
    issuer: 'Google Cloud',
    issueDate: '2023',
    credentialId: 'GCP-PCD-491028',
    credentialUrl: 'https://cloud.google.com/certification',
    imageUrl: '',
    emoji: '⚡',
    skills: ['GCP', 'Kubernetes', 'Microservices', 'Docker', 'DevOps'],
    description:
      'Certified in building scalable cloud-native applications, deploying containerized microservices, and managing cloud storage & databases.',
  },
]

export default { profile, skills, certifications, projects, experience, testimonials, gallery, music }
