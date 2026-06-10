import { BlogStatus, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@2026!', 12);

  await prisma.adminUser.upsert({
    where: { email: 'admin@taw10.com' },
    update: {
      fullName: 'TAW10 Super Admin',
      password,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      fullName: 'TAW10 Super Admin',
      email: 'admin@taw10.com',
      password,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  const fallbackFeatures = [
    { name_fr: 'Certificat Négatif', name_ar: 'الشهادة السلبية', name_en: 'Negative Certificate' },
    { name_fr: 'Rédaction des Statuts', name_ar: 'القانون الأساسي', name_en: 'Registration of Statutes' },
    { name_fr: 'Inscription Taxe Professionnelle', name_ar: 'التعريف الضريبي', name_en: 'Professional Tax Registration' },
    { name_fr: 'Registre de Commerce', name_ar: 'السجل التجاري', name_en: 'Commercial Register' },
    { name_fr: "Demande d'identification fiscale", name_ar: 'طلب شهادة التعريف الجبائي', name_en: 'Tax Identification Request' },
    { name_fr: 'Affiliation CNSS', name_ar: 'الانخراط في CNSS', name_en: 'CNSS Affiliation' },
    { name_fr: 'Annonce Légale', name_ar: 'الإعلان القانوني', name_en: 'Legal Announcement' },
    { name_fr: 'Domiciliation adresse prestigieuse (12 mois)', name_ar: 'التوطين في عنوان مرموق (12 شهر)', name_en: 'Domiciliation in prestigious address (12 months)' },
    { name_fr: 'Modèle J', name_ar: 'النموذج J', name_en: 'Model J' },
    { name_fr: 'Accès Service E-déclaration DGI', name_ar: 'الوصول لخدمة DGI الإلكترونية', name_en: 'DGI E-filing Service Access' },
    { name_fr: 'Accès Service DAMANCOM', name_ar: 'الوصول لخدمة DAMANCOM', name_en: 'DAMANCOM Service Access' },
    { name_fr: 'Timbre', name_ar: 'الطابع', name_en: 'Stamp' },
    { name_fr: 'Accompagnement Ouverture Compte', name_ar: 'الدعم في فتح حساب بنكي', name_en: 'Bank Account Opening Support' },
    { name_fr: 'Site Web', name_ar: 'الموقع الإلكتروني', name_en: 'Website' },
  ];

  const plans = [
    { name: 'INTILAQA', price: 2499, description: 'Transparence et simplicite pour demarrer.', theme: 'DEFAULT' as const, isPopular: false, isActive: true, sortOrder: 1, includedUntil: 7 },
    { name: 'INTILAQA PRO', price: 4699, description: 'La formule recommandee pour creer votre societe.', theme: 'FEATURED' as const, isPopular: true, isActive: true, sortOrder: 2, includedUntil: 13 },
    { name: 'INTILAQA PLUS', price: 5999, description: 'Pack avance avec domiciliation 24 mois.', theme: 'DEFAULT' as const, isPopular: false, isActive: true, sortOrder: 3, includedUntil: 13 },
    { name: 'INTILAQA PREMIUM', price: 8999, description: 'L’offre complete incluant le site web.', theme: 'PREMIUM' as const, isPopular: false, isActive: true, sortOrder: 4, includedUntil: 14 },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { sortOrder: plan.sortOrder },
      update: {
        name: plan.name,
        price: plan.price,
        description: plan.description,
        theme: plan.theme,
        isPopular: plan.isPopular,
        isActive: plan.isActive,
        features: {
          deleteMany: {},
          create: fallbackFeatures.map((item, index) => {
            let name_fr = item.name_fr;
            let name_ar = item.name_ar;
            let name_en = item.name_en;
            if (plan.name.includes('PLUS') || plan.name.includes('PREMIUM')) {
              name_fr = name_fr.replace('(12 mois)', '(24 mois)');
              name_ar = name_ar.replace('(12 شهر)', '(24 شهر)');
              name_en = name_en.replace('(12 months)', '(24 months)');
            }
            return {
              name_fr,
              name_ar,
              name_en,
              isIncluded: index < plan.includedUntil,
              sortOrder: index + 1,
            };
          }),
        },
      },
      create: {
        name: plan.name,
        price: plan.price,
        description: plan.description,
        theme: plan.theme,
        isPopular: plan.isPopular,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
        features: {
          create: fallbackFeatures.map((item, index) => {
            let name_fr = item.name_fr;
            let name_ar = item.name_ar;
            let name_en = item.name_en;
            if (plan.name.includes('PLUS') || plan.name.includes('PREMIUM')) {
              name_fr = name_fr.replace('(12 mois)', '(24 mois)');
              name_ar = name_ar.replace('(12 شهر)', '(24 شهر)');
              name_en = name_en.replace('(12 months)', '(24 months)');
            }
            return {
              name_fr,
              name_ar,
              name_en,
              isIncluded: index < plan.includedUntil,
              sortOrder: index + 1,
            };
          }),
        },
      },
    });
  }

  const blogArticles = [
    {
      title: 'Comment créer une société à Marrakech en 2026 : Guide complet étape par étape',
      slug: 'comment-creer-societe-maroc-2026',
      title_fr: 'Comment créer une société à Marrakech en 2026 : Guide complet étape par étape',
      title_en: 'How to set up a company in Marrakech in 2026: Complete step-by-step guide',
      title_ar: 'كيفية إنشاء شركة في مراكش عام 2026: دليل شامل خطوة بخطوة',
      excerpt_fr: 'Découvrez toutes les étapes pour créer votre société à Marrakech en 2026 : certificat négatif, domiciliation, statuts, RC et ouverture de compte. Guide complet par TAW 10.',
      excerpt_en: 'Learn all the steps to set up your company in Marrakech in 2026: negative certificate, domiciliation, articles of association, commercial registry, and bank account opening.',
      excerpt_ar: 'اكتشف جميع خطوات تأسيس شركتك في مراكش عام 2026: الشهادة السلبية، التوطين، القانون الأساسي، السجل التجاري وفتح الحساب البنكي.',
      content_fr: 'Guide complet pour créer votre société à Marrakech en 2026 avec TAW 10 : certificat négatif, domiciliation, statuts, dépôt du capital, registre de commerce, identifiant fiscal et ouverture du compte bancaire.',
      content_en: 'Complete guide to setting up your company in Marrakech in 2026 with TAW 10: negative certificate, domiciliation, articles of association, capital deposit, commercial registry, tax identifier, and bank account opening.',
      content_ar: 'دليل كامل لإنشاء شركتك في مراكش عام 2026 مع TAW 10: الشهادة السلبية، التوطين، القانون الأساسي، إيداع رأس المال، السجل التجاري، التعريف الضريبي وفتح الحساب البنكي.',
      metaTitle_fr: 'Comment créer une société à Marrakech en 2026',
      metaTitle_en: 'How to set up a company in Marrakech in 2026',
      metaTitle_ar: 'كيفية إنشاء شركة في مراكش عام 2026',
      metaDescription_fr: 'Découvrez toutes les étapes pour créer votre société à Marrakech en 2026 : certificat négatif, domiciliation, statuts, RC et ouverture de compte.',
      metaDescription_en: 'Complete guide to creating your company in Marrakech in 2026: negative certificate, domiciliation, statutes, commercial registry, and bank account.',
      metaDescription_ar: 'دليل كامل لإنشاء شركتك في مراكش عام 2026: الشهادة السلبية، التوطين، القانون الأساسي، السجل التجاري وفتح الحساب.',
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      excerpt:
        'Découvrez toutes les étapes pour créer votre société à Marrakech en 2026 : certificat négatif, domiciliation, statuts, RC et ouverture de compte. Guide complet par TAW 10.',
      content:
        'Guide complet pour créer votre société à Marrakech en 2026 avec TAW 10 : certificat négatif, domiciliation, statuts, dépôt du capital, registre de commerce, identifiant fiscal et ouverture du compte bancaire.',
      metaTitle: 'Comment créer une société à Marrakech en 2026',
      metaDescription:
        'Découvrez toutes les étapes pour créer votre société à Marrakech en 2026 : certificat négatif, domiciliation, statuts, RC et ouverture de compte.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-05-19T00:00:00.000Z'),
    },
    {
      title: 'Les avantages de la domiciliation d’entreprise à Marrakech',
      slug: 'avantages-domiciliation-marrakech',
      featuredImage: '/blog-avantage.jpg',
      title_fr: 'Les avantages de la domiciliation d’entreprise à Marrakech',
      title_en: 'The benefits of business domiciliation in Marrakech',
      title_ar: 'مزايا توطين الشركة في مراكش',
      excerpt_fr: 'Découvrez pourquoi choisir Marrakech pour domicilier votre entreprise : prestige, réduction des coûts de fonctionnement, flexibilité et démarches administratives simplifiées.',
      excerpt_en: 'Discover why choosing Marrakech for your business domiciliation brings prestige, lower operating costs, flexibility, and simpler administrative procedures.',
      excerpt_ar: 'اكتشف لماذا يعد اختيار مراكش لتوطين شركتك خياراً ممتازاً: مكانة مهنية، تقليل التكاليف، مرونة وتبسيط الإجراءات الإدارية.',
      content_fr: 'La domiciliation d’entreprise à Marrakech offre une adresse professionnelle prestigieuse, réduit les coûts de fonctionnement, améliore la flexibilité et simplifie les démarches administratives.',
      content_en: 'Business domiciliation in Marrakech gives your company a prestigious professional address, reduces operating costs, improves flexibility, and simplifies administrative procedures.',
      content_ar: 'يوفر توطين الشركة في مراكش عنواناً مهنياً مرموقاً، ويقلل تكاليف التشغيل، ويزيد المرونة، ويسهل الإجراءات الإدارية.',
      metaTitle_fr: 'Les avantages de la domiciliation d’entreprise à Marrakech',
      metaTitle_en: 'The benefits of business domiciliation in Marrakech',
      metaTitle_ar: 'مزايا توطين الشركة في مراكش',
      metaDescription_fr: 'Découvrez pourquoi choisir Marrakech pour domicilier votre entreprise : prestige, réduction des coûts, flexibilité et démarches administratives simplifiées.',
      metaDescription_en: 'Discover why Marrakech is a strong choice for business domiciliation: prestige, lower costs, flexibility, and simplified administration.',
      metaDescription_ar: 'اكتشف مزايا توطين شركتك في مراكش: مكانة مهنية، تقليل التكاليف، مرونة وتبسيط الإجراءات الإدارية.',
      excerpt:
        'Découvrez pourquoi choisir Marrakech pour domicilier votre entreprise : prestige, réduction des coûts de fonctionnement, flexibilité et démarches administratives simplifiées.',
      content:
        'La domiciliation d’entreprise à Marrakech offre une adresse professionnelle prestigieuse, réduit les coûts de fonctionnement, améliore la flexibilité et simplifie les démarches administratives.',
      metaTitle: 'Les avantages de la domiciliation d’entreprise à Marrakech',
      metaDescription:
        'Découvrez pourquoi choisir Marrakech pour domicilier votre entreprise : prestige, réduction des coûts, flexibilité et démarches administratives simplifiées.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-05-19T00:00:00.000Z'),
    },
  ];

  for (const article of blogArticles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  const teamMembers = [
    {
      name_fr: 'Hicham MHAMEDI',
      name_en: 'Hicham MHAMEDI',
      name_ar: 'محمدي هشام',
      role_fr: 'PDG & Fondateur',
      role_en: 'CEO & Founder',
      role_ar: 'الرئيس التنفيذي والمؤسس',
      description_fr: "Leader visionnaire et expert en droit des affaires marocains, Hicham dirige TAW 10 avec un engagement envers l'excellence.",
      description_en: 'Visionary leader and expert in Moroccan business law, Hicham leads TAW 10 with a commitment to excellence.',
      description_ar: 'قائد رؤيوي وخبير في قانون الأعمال المغربي، يقود هشام TAW 10 بالتزام راسخ بالتميز.',
      imageUrl: '/hicham.jpeg',
      sortOrder: 1,
      isActive: true,
    },
    {
      name_fr: 'AFAFE KHLIFAL',
      name_en: 'AFAFE KHLIFAL',
      name_ar: 'عفاف اخليفال',
      role_fr: 'Gestion Opérationnelle',
      role_en: 'Operational Management',
      role_ar: 'الإدارة التشغيلية',
      description_fr: "Experte en efficacité opérationnelle et en gestion de projet, Afafe assure l'exécution fluide de tous nos services.",
      description_en: 'Expert in operational efficiency and project management, Afafe ensures the seamless execution of all our services.',
      description_ar: 'خبيرة في الكفاءة التشغيلية وإدارة المشاريع، تضمن عفاف التنفيذ السلس لجميع خدماتنا.',
      imageUrl: '/afafe-khlifal.png',
      sortOrder: 2,
      isActive: true,
    },
    {
      name_fr: 'Salma AAOUAD',
      name_en: 'Salma AAOUAD',
      name_ar: 'سلمى عواد',
      role_fr: 'Direction Commerciale',
      role_en: 'Commercial Direction',
      role_ar: 'الإدارة التجارية',
      description_fr: 'Spécialiste du développement commercial, Salma accompagne nos clients vers leur réussite.',
      description_en: 'Specialist in business development, Salma guides our clients toward their success.',
      description_ar: 'متخصصة في التنمية التجارية، ترافق عملاءنا نحو نجاحهم.',
      imageUrl: '/salma-aaouad.png',
      sortOrder: 3,
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { sortOrder: member.sortOrder },
      update: member,
      create: member,
    });
  }

  const services = [
    {
      slug: 'domiciliation',
      title_fr: 'Domiciliation Premium',
      title_en: 'Premium Domiciliation',
      title_ar: 'التوطين الممتاز',
      description_fr: 'Une adresse prestigieuse à Marrakech pour renforcer votre crédibilité et gérer votre siège social avec sérénité.',
      description_en: 'A prestigious address in Marrakech to strengthen your credibility and manage your registered office with confidence.',
      description_ar: 'عنوان مرموق في مراكش لتعزيز مصداقيتك وإدارة المقر الاجتماعي لشركتك بثقة.',
      icon: 'location_on',
      imageUrl: '/luxury_marrakech_office_hero_1775496536100.png',
      sortOrder: 1,
      isActive: true,
    },
    {
      slug: 'creation-entreprise',
      title_fr: "Création d'Entreprise",
      title_en: 'Company Creation',
      title_ar: 'إنشاء الشركات',
      description_fr: 'Un accompagnement complet pour créer votre société au Maroc, du certificat négatif jusqu’au registre de commerce.',
      description_en: 'Complete support to create your company in Morocco, from the negative certificate to the commercial registry.',
      description_ar: 'مواكبة كاملة لإنشاء شركتك في المغرب، من الشهادة السلبية إلى السجل التجاري.',
      icon: 'rocket_launch',
      imageUrl: '/leadership-photo.jpeg',
      sortOrder: 2,
      isActive: true,
    },
    {
      slug: 'secretariat',
      title_fr: 'Secrétariat Virtuel',
      title_en: 'Virtual Secretariat',
      title_ar: 'السكرتارية الافتراضية',
      description_fr: 'Externalisez vos appels, rendez-vous et courriers avec une équipe professionnelle toujours disponible.',
      description_en: 'Outsource calls, appointments, and correspondence with a professional team that is always available.',
      description_ar: 'فوّض إدارة المكالمات والمواعيد والمراسلات لفريق مهني دائم التوفر.',
      icon: 'forward_to_inbox',
      imageUrl: '/team-member-1.jpeg',
      sortOrder: 3,
      isActive: true,
    },
    {
      slug: 'accompagnement-juridique',
      title_fr: 'Accompagnement Juridique',
      title_en: 'Legal Support',
      title_ar: 'المواكبة القانونية',
      description_fr: 'Sécurisez vos démarches juridiques, modifications statutaires, transferts de siège et actes stratégiques.',
      description_en: 'Secure legal procedures, statutory changes, registered office transfers, and strategic corporate actions.',
      description_ar: 'أمّن إجراءاتك القانونية وتعديلاتك النظامية ونقل المقر والعمليات الاستراتيجية.',
      icon: 'gavel',
      imageUrl: '/team-member-2.jpeg',
      sortOrder: 4,
      isActive: true,
    },
    {
      slug: 'support-administratif',
      title_fr: 'Support Administratif',
      title_en: 'Administrative Support',
      title_ar: 'الدعم الإداري',
      description_fr: 'Gagnez du temps avec une gestion administrative rigoureuse, organisée et adaptée à votre activité.',
      description_en: 'Save time with rigorous, organized administrative management tailored to your business.',
      description_ar: 'وفّر وقتك من خلال إدارة إدارية دقيقة ومنظمة ومناسبة لنشاطك.',
      icon: 'support_agent',
      imageUrl: '/blog-avantage.jpg',
      sortOrder: 5,
      isActive: true,
    },
    {
      slug: 'conseil-strategique',
      title_fr: 'Conseil Stratégique',
      title_en: 'Strategic Consulting',
      title_ar: 'الاستشارة الاستراتيجية',
      description_fr: 'Développez votre implantation avec une vision claire, des conseils concrets et un réseau local solide.',
      description_en: 'Develop your presence with clear vision, practical advice, and a strong local network.',
      description_ar: 'طوّر حضورك برؤية واضحة ونصائح عملية وشبكة محلية قوية.',
      icon: 'insights',
      imageUrl: '/hicham.jpeg',
      sortOrder: 6,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.serviceOffering.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  const faqs = [
    {
      question: 'Quels documents sont necessaires ?',
      answer: 'Une CIN ou un passeport, les informations de la societe, le certificat negatif si disponible, et les coordonnees du gerant.',
      sortOrder: 1,
      isActive: true,
    },
    {
      question: 'Combien de temps prend la creation ?',
      answer: 'Le delai depend du dossier et des administrations, mais TAW10 optimise chaque etape pour avancer rapidement.',
      sortOrder: 2,
      isActive: true,
    },
    {
      question: 'La domiciliation inclut-elle la gestion du courrier ?',
      answer: 'Oui, les offres de domiciliation peuvent inclure la reception, le suivi et la notification du courrier professionnel.',
      sortOrder: 3,
      isActive: true,
    },
    {
      question: 'Puis-je choisir un pack depuis le site ?',
      answer: 'Oui, vous pouvez choisir le pack qui convient a votre projet et envoyer une demande directement depuis les cartes de prix.',
      sortOrder: 4,
      isActive: true,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.upsert({
      where: { sortOrder: faq.sortOrder },
      update: faq,
      create: faq,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
