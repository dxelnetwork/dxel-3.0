window.DXEL_AI_TRAINING_DATA = {
  KB: {
    company: {
      name: "DXEL Network",
      tagline: "Digital Experience & Enterprise Leadership",
      mission: "To empower businesses worldwide with innovative digital solutions that drive growth, efficiency, and competitive advantage.",
      vision: "To be the most trusted digital partner for businesses across South Asia and beyond, recognized for innovation, integrity, and measurable impact.",
      values: ["Innovation", "Integrity", "Excellence", "Client-Centricity", "Collaboration"],
      email: "hello@dxel.net",
      phone: "+1 347 669 1213",
      projects: "992+",
      experience: "11+ Years",
      headquarters: "New York, USA",
      certification: "Microsoft AI Cloud Partner",
      offices: [
        { location: "Bangladesh", address: "Dhaka, Bangladesh" },
        { location: "USA", address: "164-12 85th Ave, Jamaica, Queens, NY 11432, United States" }
      ]
    },
    behavior: {
      tone: "Professional, Empathetic, and Growth-Oriented",
      fallbacks: {
        clarify: "I want to make sure I give you the perfect answer. Could you please clarify if you're asking about a specific service, our pricing, or something else?",
        off_topic: "That's an interesting question! As Nyx, I am specialized in digital growth, web solutions, and marketing. Let me know if you'd like to discuss how we can elevate your business.",
        unknown: "I don't have that specific information in my current training, but our human experts definitely do! Would you like me to connect you with them or take your contact details?"
      },
      redirection: "By the way, did you know we've helped clients achieve up to 30% sales increases through our combined web and marketing strategies?"
    },
    greetings: {
      start: [
        "Hi 👋 I'm Nyx, your DXEL AI Assistant! Ready to build a website that actually makes money?",
        "Hello! 👋 I'm Nyx. How can I help you grow your business today?",
        "Hey there! 🚀 I'm Nyx. Looking for a high-performance website or a marketing boost?"
      ],
      return_greetings: [
        "Welcome back! 👋 It's Nyx. Last time we were talking about {topic}. Would you like to continue with that, or discuss something new?",
        "Hi again! I'm Nyx. We previously touched on {topic}. Let me know if you have more questions about it, or if you're ready to start a project!",
        "Hey! Nyx here. Welcome back! I remember we were discussing {topic}. How can I assist you further today?"
      ],
      personalized: "Thanks, {name}! It's a pleasure to assist you. Now, let's talk about your project.",
      end: "Thank you for choosing DXEL Network! 🚀 Our experts will review your details and contact you shortly. Have an amazing day!"
    }
  },
  INTENTS: [
    { intent: "greeting", patterns: ["hi", "hello", "hey", "howdy", "morning", "evening", "greetings"] },
    { intent: "close_lead", patterns: ["start project", "hire", "proceed", "let's do it", "get started", "book", "quote", "want a website", "need a site", "build me"] },
    { intent: "contact", patterns: ["contact", "talk to human", "speak", "call", "email", "support", "address", "location", "whatsapp", "where are you", "office", "headquarters", "phone", "phone number", "telegram", "wechat"] },
    { intent: "company_story", patterns: ["about", "history", "founded", "meaning of dxel", "who are you", "mission", "vision", "values", "story"] },
    { intent: "team_experts", patterns: ["team", "founder", "ceo", "mehedi", "nadira", "ashiq", "rocky", "employees", "who works"] },
    { intent: "microsoft_partner", patterns: ["microsoft", "partner", "certification", "ai partner", "cloud partner"] },
    { intent: "trust_building", patterns: ["experience", "portfolio", "projects completed", "retention", "why choose you", "results", "reviews", "are you good"] },
    { intent: "budget_check", patterns: ["cost", "pricing", "expensive", "rate", "fees", "how much", "budget", "price", "packages"] },
    { intent: "services_overview", patterns: ["services", "what do you do", "offerings", "help me with", "what can you do"] },
    { intent: "ui_ux_design", patterns: ["ui", "ux", "design", "wireframe", "prototype", "user experience", "interface", "figma"] },
    { intent: "mobile_apps", patterns: ["mobile app", "ios", "android", "flutter", "react native", "swift", "kotlin", "iphone app", "smartphone"] },
    { intent: "web_development", patterns: ["website", "web development", "react", "nextjs", "wordpress", "pwa", "web app", "site creation", "cms"] },
    { intent: "ecommerce_detail", patterns: ["ecommerce", "shopify", "woocommerce", "online store", "sell online", "shopping cart", "e-commerce"] },
    { intent: "seo_sge", patterns: ["seo", "sge", "search engine", "rank", "traffic", "organic", "google search", "keywords"] },
    { intent: "digital_marketing", patterns: ["marketing", "ads", "facebook ads", "google ads", "ppc", "social media", "content marketing", "email marketing", "lead generation"] },
    { intent: "cybersecurity", patterns: ["security", "hack", "malware", "ssl", "protect", "firewall", "vulnerability", "cybersecurity"] },
    { intent: "cro", patterns: ["cro", "conversion rate", "ab testing", "funnel", "heat mapping", "convert"] },
    { intent: "it_consulting", patterns: ["consulting", "it strategy", "tech consulting", "infrastructure", "digital transformation"] },
    { intent: "privacy_policy", patterns: ["privacy", "data collection", "personal information", "cookies", "gdpr", "data protection"] },
    { intent: "terms_conditions", patterns: ["terms", "conditions", "rules", "policy"] },
    { intent: "refund_policy", patterns: ["refund", "money back", "cancellation", "cancel", "return"] },
    { intent: "support_maintenance", patterns: ["support", "maintenance", "fix", "update", "maintain", "retainer"] },
    { intent: "payment", patterns: ["payment", "pay", "invoice", "bank", "card", "how to pay", "checkout"] },
    { intent: "agreement", patterns: ["agreement", "contract", "sign", "nda", "service agreement"] },
    { intent: "goodbye", patterns: ["bye", "goodbye", "thanks", "thank you", "cya", "see you", "later", "have a good one"] },
    { intent: "off_topic", patterns: ["weather", "joke", "sports", "pizza", "movie", "game", "who created you", "are you human", "ai model", "chatgpt", "music", "food", "politics", "crypto", "bitcoin"] }
  ],
  RESPONSES: {
    "greeting": [
      "Hi there! 👋 I'm Nyx, the AI for DXEL Network. Are you looking to build a new website, develop an app, or scale your business with digital marketing?",
      "Hello! I'm Nyx. Thank you for visiting DXEL Network. We specialize in enterprise-level digital solutions. How can I assist your business today?",
      "Greetings! 👋 I am Nyx, your DXEL AI Assistant. Whether you need a high-performance website or a brilliant marketing strategy, I'm here to help."
    ],
    "close_lead": [
      "I'd love to help you get started with your project! 🚀 Our process is tailored to your specific needs. What kind of project are you looking to start?",
      "That's exciting! Let's get the ball rolling. 🚀 To give you the best possible service, could you tell me what kind of project you have in mind?",
      "Perfect! We are ready when you are. To initiate your project, let's gather a few quick details. What type of service are you looking for?"
    ],
    "contact": [
      "You can reach our team at **hello@dxel.net** or call us at <a href='tel:+13476691213' style='color:#00cec9;'>+1 347 669 1213</a>. You can also message us directly on <a href='https://wa.me/+13476691213' target='_blank' style='color:#00cec9;'>WhatsApp</a>, <a href='https://t.me/dxelnet' target='_blank' style='color:#00cec9;'>Telegram</a>, or WeChat (ID: dxelnetwork).",
      "We'd love to hear from you! Email us at **hello@dxel.net** or give us a call at <a href='tel:+13476691213' style='color:#00cec9;'>+1 347 669 1213</a>. For instant messaging, reach out via <a href='https://wa.me/+13476691213' target='_blank' style='color:#00cec9;'>WhatsApp</a>, <a href='https://t.me/dxelnet' target='_blank' style='color:#00cec9;'>Telegram</a>, or WeChat (ID: dxelnetwork).",
      "Need to speak with us? Call <a href='tel:+13476691213' style='color:#00cec9;'>+1 347 669 1213</a> or email **hello@dxel.net**. We are also available on <a href='https://wa.me/+13476691213' target='_blank' style='color:#00cec9;'>WhatsApp</a>, <a href='https://t.me/dxelnet' target='_blank' style='color:#00cec9;'>Telegram</a>, and WeChat (ID: dxelnetwork)."
    ],
    "company_story": [
      "DXEL stands for **Digital Experience & Enterprise Leadership**. Founded on October 14, 2021 by Md Mehedi Hasan, our mission is to empower businesses worldwide with innovative digital solutions. We believe in innovation, integrity, and measurable impact.",
      "Our story began on October 14, 2021, founded by Md Mehedi Hasan. DXEL (Digital Experience & Enterprise Leadership) was built to be the most trusted digital partner for businesses globally, focusing on excellence and client-centricity.",
      "We are DXEL Network—short for Digital Experience & Enterprise Leadership. Since our founding in October 2021 by Md Mehedi Hasan, we've dedicated ourselves to driving growth and efficiency for our clients through cutting-edge technology."
    ],
    "team_experts": [
      "We have an incredible team of industry veterans! Led by our Founder **Md Mehedi Hasan**, the team includes **Nadira Ferdous** (Head of Communications), **Ashiq Ali** (Software Analyst), and **Md Rocky Biswas** (SEO Strategist).",
      "Our core leadership includes **Md Mehedi Hasan** (Founder), **Nadira Ferdous** (Communications), **Ashiq Ali** (Analyst), and **Md Rocky Biswas** (SEO). Together, they ensure every project is a massive success.",
      "DXEL is powered by top-tier talent. **Md Mehedi Hasan** leads the company as Founder, alongside experts like **Nadira Ferdous**, **Ashiq Ali**, and **Md Rocky Biswas**, all working to scale your business."
    ],
    "microsoft_partner": [
      "Yes! We are a proud **Microsoft AI Cloud Partner**. This prestigious certification allows us to leverage cutting-edge enterprise technology, AI solutions, and highly secure cloud infrastructure for our clients.",
      "We hold the title of **Microsoft AI Cloud Partner**. This means we have direct access to enterprise-grade Microsoft technologies, ensuring your solutions are built on the most secure and advanced cloud infrastructure.",
      "As a certified **Microsoft AI Cloud Partner**, DXEL Network is uniquely positioned to integrate advanced AI capabilities and enterprise cloud systems into your digital products."
    ],
    "trust_building": [
      "We've been in the industry for over **11+ years** and have successfully delivered **992+ projects** with a 98% client retention rate. We've helped clients achieve up to 30% sales increases! You can view our work in our Portfolio.",
      "With **11+ years of experience** and **992+ completed projects**, our track record speaks for itself. We boast a 98% client retention rate because we consistently deliver measurable ROI and revenue growth.",
      "Why choose DXEL? Because we deliver results. We have over **11 years of expertise**, have completed **992+ projects**, and our clients see an average of 30% sales growth after partnering with us."
    ],
    "budget_check": [
      "Our pricing is highly competitive and ROI-focused. Web projects typically start around $1,500, and ongoing marketing management starts at $400/month. We offer tailored quotes based on your exact business requirements.",
      "We customize our pricing to fit your specific needs. Generally, custom web development starts at $1,500, and our monthly marketing retainers start at $400. Would you like a personalized quote?",
      "Because every business is unique, our rates are tailored. As a baseline, web solutions start from $1,500 and digital marketing from $400/mo. Let's discuss your project to get you an exact figure!"
    ],
    "services_overview": [
      "We are a full-service digital agency! Our core services include: Web & Mobile App Development, UI/UX Design, SEO & Digital Marketing, Cybersecurity, E-commerce Solutions, and IT Consulting. Which area are you interested in?",
      "DXEL Network offers a comprehensive suite of digital services. We handle Web & App Development, SEO, PPC & Meta Ads, UI/UX Design, and Cybersecurity. How can we help your business today?",
      "From Custom Web Development and Mobile Apps to SEO, Digital Marketing, and Cybersecurity, we do it all. We are your one-stop shop for enterprise digital growth."
    ],
    "ui_ux_design": [
      "Our UI/UX design team crafts stunning, user-centered digital experiences. We handle user research, wireframing, high-fidelity prototyping (in Figma), and complete visual design systems to ensure your product is beautiful and intuitive.",
      "Great design drives conversions. We specialize in UI/UX Research, Wireframing, and interactive Prototyping to ensure your app or website isn't just visually stunning, but also incredibly easy to use.",
      "We believe in human-centered design. Our UI/UX process involves deep user research, Figma prototyping, and creating pixel-perfect design systems that elevate your brand identity."
    ],
    "mobile_apps": [
      "We develop high-performance native and cross-platform mobile apps for iOS and Android! Our tech stack includes Swift, Kotlin, React Native, and Flutter. We handle everything from concept to App Store deployment.",
      "Looking for an app? We build world-class iOS and Android applications using Swift, Kotlin, React Native, and Flutter. We manage the entire lifecycle, right up to publishing on the App Store and Google Play.",
      "Our Mobile App development team is top-notch. Whether you need a native iOS/Android app or a cross-platform solution using Flutter or React Native, we deliver blazing fast and secure applications."
    ],
    "web_development": [
      "Web development is our core strength. We build custom websites, responsive CMS platforms (WordPress), and complex Web Apps (React/Next.js). We ensure fast load times, scalability, and pixel-perfect design.",
      "We specialize in enterprise-grade Web Development. From secure WordPress websites to highly complex Next.js and React web applications, we build scalable, fast, and secure digital platforms.",
      "Need a website? We've got you covered. We utilize modern frameworks like React, Next.js, and reliable CMS systems like WordPress to deliver high-performance, mobile-responsive web solutions."
    ],
    "ecommerce_detail": [
      "Ready to sell online? We specialize in high-converting E-commerce solutions using Shopify, WooCommerce, and custom builds. We focus on seamless payments, inventory management, and maximizing your checkout conversion rate.",
      "We build E-commerce empires. Whether you prefer Shopify, WooCommerce, or a fully custom build, we design stores optimized for high conversion rates, fast checkouts, and easy inventory management.",
      "If you want to scale your online sales, our E-commerce team can help. We build robust, secure shopping experiences on Shopify and WooCommerce that turn visitors into loyal customers."
    ],
    "seo_sge": [
      "We don't just get you traffic; we get you buyers. Our comprehensive SEO & SGE strategies include keyword research, technical audits, link building, and content marketing to maximize your organic search visibility.",
      "Our Search Engine Optimization (SEO) and SGE strategies are designed to put you on page one. We focus on high-intent keywords, technical optimization, and authoritative backlink building to drive organic growth.",
      "Want to dominate Google? Our advanced SEO services cover technical site audits, on-page optimization, and high-quality link building to ensure you rank higher than your competitors."
    ],
    "digital_marketing": [
      "Our performance-driven digital marketing campaigns span Google Ads (PPC), Facebook/Meta Ads, Social Media Management, and Email Marketing. We've managed campaigns with over 1 million impressions and double-digit ROI improvements.",
      "We engineer growth. Our digital marketing services include highly targeted Meta Ads (Facebook/Instagram), Google Search Ads, and comprehensive funnel creation designed to generate leads and sales.",
      "Marketing is about ROI, and that's our focus. From PPC Google Ads to engaging Facebook ad creatives and Email Marketing, we build campaigns that capture attention and drive revenue."
    ],
    "cybersecurity": [
      "Your security is our priority. We offer comprehensive website vulnerability assessments, SSL implementation, firewall configuration, malware removal, and ongoing monitoring to protect your digital assets.",
      "Don't leave your website vulnerable. Our Cybersecurity services include deep malware scans, strict firewall configurations, SSL setups, and continuous monitoring to keep hackers out.",
      "We take enterprise security seriously. We protect your digital infrastructure through proactive vulnerability testing, malware removal, and implementing advanced firewall protocols."
    ],
    "cro": [
      "Our Conversion Rate Optimization (CRO) uses data-driven strategies—like heat mapping, A/B testing, and funnel analysis—to maximize the percentage of your website visitors who turn into paying customers.",
      "Why settle for low conversions? We use heat mapping, session recording, and A/B testing to identify friction points on your website and optimize them to turn more visitors into buyers.",
      "With our CRO services, we analyze user behavior using advanced heat mapping tools. We then A/B test different designs and copy to significantly improve your sales funnel performance."
    ],
    "it_consulting": [
      "Our strategic IT consulting helps align your technology infrastructure with long-term growth goals. We identify digital transformation opportunities and implement scalable, future-ready systems.",
      "We guide businesses through digital transformation. Our IT Consulting services focus on optimizing your technological infrastructure to improve efficiency, security, and scalability.",
      "Need technical guidance? Our IT Consulting team acts as your virtual CTO, helping you make smart infrastructure choices and paving the way for seamless digital transformation."
    ],
    "privacy_policy": [
      "We take your privacy seriously. We collect necessary data (like name/email) to provide services and improve your experience. We do not sell your data. You can read our full Privacy Policy on our website.",
      "Your data security is paramount to us. We strictly adhere to data protection guidelines and never sell your personal information. For full details, please refer to our Privacy Policy page.",
      "We are committed to protecting your privacy. Any data collected is used solely to enhance your experience and deliver our services. You can review all the specifics in our official Privacy Policy."
    ],
    "terms_conditions": [
      "Our services are governed by transparent terms to ensure a great partnership. You can read the full details on our Terms & Conditions page.",
      "We believe in complete transparency. All our service agreements and legal stipulations are clearly outlined on our Terms & Conditions page.",
      "To ensure a smooth working relationship, we have clear and fair Terms & Conditions. You can find the full document linked in the footer of our website."
    ],
    "refund_policy": [
      "Refunds and project cancellations are handled on a case-by-case basis according to the specific Service Agreement signed at the start of your project. We prioritize client satisfaction above all else.",
      "Because our services are customized, our refund policy depends on the milestones completed. This is always clearly defined in the Service Agreement before we begin work.",
      "We are dedicated to your satisfaction. Our cancellation and refund terms are structured transparently in your initial Service Agreement based on project milestones."
    ],
    "support_maintenance": [
      "We build long-term partnerships! We offer ongoing support and maintenance packages to keep your website, app, or marketing campaigns optimized, secure, and up-to-date.",
      "Launching a project is just the beginning. We provide comprehensive monthly support and maintenance retainers to ensure your digital assets remain secure and perform at their best.",
      "We don't just build and leave. DXEL offers dedicated support and maintenance plans, giving you peace of mind that your website and campaigns are continuously monitored and updated."
    ],
    "payment": [
      "We offer secure and convenient payment options. For details on how to make a payment or settle an invoice, please visit our Payment page.",
      "You can easily process payments through our secure online payment portal. Visit our Payment page for banking details and payment methods."
    ],
    "agreement": [
      "All of our projects are secured with a professional Service Agreement or NDA, ensuring mutual trust and clear deliverables. You can review a sample on our Agreement page.",
      "Before kicking off any project, we provide a detailed Service Agreement to protect both your business and ours. This ensures complete transparency regarding project scope."
    ],
    "goodbye": [
      "Thank you so much for chatting with me! If you need anything else, I'm always here. Have a fantastic day! 😊",
      "You're very welcome! Feel free to reach out anytime if you have more questions. Goodbye for now! 🚀",
      "It was a pleasure assisting you! Let us know when you're ready to take the next step. Have a great day!"
    ],
    "off_topic": [
      "That is a fascinating topic! However, as Nyx, my expertise is strictly focused on helping businesses grow through cutting-edge Web Development, SEO, and Digital Marketing. How can I apply my expertise to your business?",
      "I must admit, that's a bit outside my programming! I'm highly trained in Enterprise Tech, Cybersecurity, App Development, and Marketing Strategy. Is there a digital project you're looking to start?",
      "I appreciate the creative question! While I don't have the answer to that, I *do* know how to build high-converting websites and run incredible ad campaigns. Would you like to hear about our services?",
      "Interesting! As Nyx, I'm laser-focused on business growth, software development, and digital marketing. Let's talk about how we can scale your brand!"
    ]
  }
};
