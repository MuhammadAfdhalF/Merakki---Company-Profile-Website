import { getImgPath } from '@/utils/imagePath';

export const count = [
  {
    icon: getImgPath("/images/counter/star.svg"),
    value: "4.9",
    description: "Average client satisfaction rating across completed projects",
  },
  {
    icon: getImgPath("/images/counter/admin.svg"),
    value: "50+",
    description: "Brands and businesses have collaborated with Meraki",
  },
  {
    icon: getImgPath("/images/counter/bag.svg"),
    value: "100+",
    description: "Creative projects delivered across various industries",
  },
];

export const cardData = [
  {
    iconUrl: getImgPath('/images/build-amazing/beautiful-design.svg'),
    title: 'Strategic Brand Design',
    description: 'Visual identities crafted to position your brand clearly and professionally.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/coded.svg'),
    title: 'Creative & Consistent Content',
    description: 'Design and content that stay aligned across all platforms.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/amazing.svg'),
    title: 'Website & Digital Experience',
    description: 'Modern, responsive websites built to support business growth.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/beautiful-design.svg'),
    title: 'Reliable Creative Partner',
    description: 'We work closely with clients as a long-term creative partner.',
    link: '/',
  },
];

export const boxData = [
  {
    src: getImgPath('/images/work-grow/mobile-application.jpg'),
    alt: 'portfolio',
    title: 'Brand Identity & Visual System',
    slug: "portfolio-1",
  },
  {
    src: getImgPath('/images/work-grow/weby-dashboard-design.jpg'),
    alt: 'portfolio',
    title: 'Company Profile Website',
    slug: "portfolio-2",
  },
  {
    src: getImgPath('/images/work-grow/frontend-development.jpg'),
    alt: 'portfolio',
    title: 'Website for Café & Restaurant',
    slug: "portfolio-3",
  },
  {
    src: getImgPath('/images/work-grow/illustration.jpg'),
    alt: 'portfolio',
    title: 'Social Media Content Design',
    slug: "portfolio-4",
  },
  {
    src: getImgPath('/images/work-grow/financial-image.jpg'),
    alt: 'portfolio',
    title: 'Marketing & Promotional Visuals',
    slug: "portfolio-5",
  },
];

export const accordionData = [
  {
    title: "What services does Meraki offer?",
    content:
      "We provide branding, visual design, social media design, creative content, and website development to help brands look strong and stay consistent.",
  },
  {
    title: "Can Meraki create websites such as company profiles or business websites?",
    content:
      "Yes. We build various types of websites, including company profiles, café & restaurant websites, brand websites, and landing pages tailored to your business needs.",
  },
  {
    title: "Can Meraki handle a brand from scratch?",
    content:
      "Absolutely. We assist from brand research and visual identity development to design implementation for both digital and print needs.",
  },
  {
    title: "Who are Meraki’s target clients?",
    content:
      "We work with SMEs, startups, personal brands, and companies looking to enhance their brand image and digital presence.",
  },
  {
    title: "What is the workflow when working with Meraki?",
    content:
      "Our process starts with understanding your needs, followed by solution proposals, design execution, revisions, and final delivery.",
  },
  {
    title: "Does Meraki work with clients outside the city?",
    content:
      "Yes. Although we are based in Jakarta, Pekanbaru, and Dumai, we collaborate with clients from anywhere through online communication.",
  },
];

export const sections = {
  features: [
    { name: 'Brand Strategy', href: '/' },
    { name: 'Visual Identity', href: '/' },
    { name: 'Website Development', href: '/' },
    { name: 'Social Media Design', href: '/' },
  ],
  resources: [
    { name: 'Portfolio', href: '/' },
    { name: 'Case Studies', href: '/' },
    { name: 'Insights', href: '/' },
    { name: 'Contact', href: '/' },
  ],
  platform: [
    { name: 'Branding', href: '/' },
    { name: 'Website', href: '/' },
    { name: 'Creative Content', href: '/' },
    { name: 'Terms & Conditions', href: '/' },
    { name: 'Privacy Policy', href: '/' },
  ],
};
