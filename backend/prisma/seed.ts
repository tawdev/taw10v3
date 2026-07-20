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
      content_fr: `Créer une société à Marrakech en 2026 est une décision stratégique pour tout entrepreneur. Grâce aux plateformes en ligne de **TAW 10** sur [taw10.com](https://taw10.com) et [taw10.ma](https://taw10.ma), les démarches de création d'entreprise au Maroc sont simplifiées. 

### Étape 1 : Le Certificat Négatif
Il s'agit d'obtenir la réservation de votre nom commercial auprès de l'OMPIC.

### Étape 2 : La Domiciliation d'Entreprise
Toute entreprise a besoin d'un siège social. Choisir la domiciliation à Marrakech avec TAW10 vous permet d'économiser sur les coûts de location physique d'un bureau tout en disposant d'une adresse prestigieuse sur l'avenue Allal El Fassi.

### Étape 3 : Rédaction des Statuts
Nos experts rédigent vos statuts de SARL ou SA en totale conformité légale.

### Étape 4 : Registre de Commerce & Immatriculation
Nous nous occupons de l'enregistrement au tribunal de commerce, de l'Identifiant Fiscal (IF) et de la Patente.

Pour démarrer votre projet de création d'entreprise au Maroc dès aujourd'hui, visitez notre portail d'assistance sur [taw10.ma](https://taw10.ma) ou contactez notre équipe commerciale via [taw10.com](https://taw10.com).`,
      content_en: `Setting up a company in Marrakech in 2026 is a major milestone. Thanks to **TAW 10** virtual services available on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma), company formation in Morocco has never been faster.

### 1. Negative Certificate
Clear your trade name online via OMPIC.

### 2. Business Domiciliation
Acquire a registered office address in Marrakech on the famous Allal El Fassi avenue. It is cost-efficient and provides a professional image.

### 3. Drafting Statutes
Get your corporate bylaws prepared by business lawyers.

### 4. Trade Register & Tax Setup
Complete your commercial registration and obtain your tax ID (IF) and patente.

Start your business creation journey in Morocco with our dedicated support team on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma).`,
      content_ar: `يعد إنشاء شركة في مراكش عام 2026 خطوة استراتيجية ناجحة. بفضل خدمات **TAW 10** عبر موقعنا [taw10.com](https://taw10.com) و [taw10.ma](https://taw10.ma)، تم تبسيط خطوات تأسيس الشركات في المغرب بشكل كبير.

### 1. الشهادة السلبية (Certificat Négatif)
حجز الاسم التجاري الخاص بشركتكم لدى المكتب المغربي للملكية الصناعية والتجارية (OMPIC).

### 2. توطين الشركات بمراكش (Domiciliation)
الحصول على مقر اجتماعي مرموق لشركتكم في شارع علال الفاسي بمراكش دون تكاليف كراء باهظة.

### 3. صياغة القانون الأساسي (Statuts)
يقوم خبراؤنا بكتابة وتوثيق القانون الأساسي لشركتكم.

### 4. السجل التجاري والتعريف الضريبي (RC & IF)
إتمام إجراءات التسجيل في السجل التجاري بالمحكمة التجارية والحصول على التعريف الضريبي والضمان الاجتماعي.

ابدأ مشروعك لتأسيس المقاولات في المغرب اليوم عبر بوابتنا [taw10.ma](https://taw10.ma) أو [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Comment créer une société à Marrakech en 2026',
      metaTitle_en: 'How to set up a company in Marrakech in 2026',
      metaTitle_ar: 'كيفية إنشاء شركة في مراكش عام 2026',
      metaDescription_fr: 'Découvrez toutes les étapes pour créer votre société à Marrakech en 2026 avec TAW10 sur taw10.ma et taw10.com.',
      metaDescription_en: 'Complete guide to creating your company in Marrakech in 2026 with TAW10 on taw10.com and taw10.ma.',
      metaDescription_ar: 'دليل كامل لإنشاء شركتك في مراكش عام 2026 مع TAW10 عبر موقعنا الإلكتروني.',
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
      content_fr: `La domiciliation d’entreprise à Marrakech offre de multiples opportunités aux investisseurs. Grâce aux solutions de **TAW 10** disponibles sur [taw10.com](https://taw10.com) et [taw10.ma](https://taw10.ma), domiciliez votre entreprise en toute sérénité.

### 1. Une adresse prestigieuse à Marrakech
Renforcez la crédibilité de votre structure en disposant d'un siège social sur l'avenue Allal El Fassi, un axe majeur des affaires à Marrakech.

### 2. Une importante économie financière
Évitez les charges de location commerciale d'un bureau physique, d'aménagement, de charges d'eau/électricité et de taxes professionnelles lourdes au démarrage.

### 3. Gestion professionnelle du courrier
Nous recevons, scannons et vous réexpédions vos correspondances administratives au quotidien.

Découvrez nos différents tarifs de domiciliation à Marrakech sur [taw10.ma](https://taw10.ma) et [taw10.com](https://taw10.com).`,
      content_en: `Business domiciliation in Marrakech is a popular choice for startup entrepreneurs. Establish your registered office in Morocco with **TAW 10** via [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma).

### 1. Prestigious Business Address
Boost your corporate credibility with a premium head office address on Allal El Fassi avenue in Marrakech.

### 2. Maximize Cost Savings
Save on commercial rent, utility bills, office furniture, and upfront setup costs.

### 3. Virtual Mailroom
Daily receipt, digital scanning, and email forwarding of all your business letters.

Compare our business domiciliation plans online on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma).`,
      content_ar: `يوفر توطين الشركة في مراكش فرصاً استثنائية للمستثمرين. بفضل حلول **TAW 10** المتاحة على [taw10.com](https://taw10.com) و [taw10.ma](https://taw10.ma)، يمكنك توطين شركتك بأمان وسهولة.

### 1. عنوان مرموق في مراكش
عزز مصداقية علامتك التجارية بمقر رسمي في شارع علال الفاسي بمراكش.

### 2. توفير التكاليف والسيولة
تجنب مصاريف كراء مكتب مادي، فواتير الماء والكهرباء وتكاليف الصيانة السنوية.

### 3. إدارة المراسلات والبريد
نستقبل بريدك ووثائقك الإدارية ونقوم بتصويرها وإرسالها لك يومياً.

اكتشف باقات وأسعار توطين الشركات بمراكش على [taw10.ma](https://taw10.ma) و [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Les avantages de la domiciliation d’entreprise à Marrakech',
      metaTitle_en: 'The benefits of business domiciliation in Marrakech',
      metaTitle_ar: 'مزايا توطين الشركة في مراكش',
      metaDescription_fr: 'Découvrez pourquoi choisir Marrakech pour domicilier votre entreprise avec TAW10 sur taw10.ma et taw10.com.',
      metaDescription_en: 'Discover why Marrakech is a strong choice for business domiciliation with TAW10 on taw10.com.',
      metaDescription_ar: 'اكتشف مزايا توطين شركتك في مراكش مع TAW10 عبر بوابتنا الإلكترونية.',
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
    {
      title: 'Guide de choix de la forme juridique au Maroc : SARL, SA ou Auto-entrepreneur ?',
      slug: 'choisir-forme-juridique-maroc',
      featuredImage: '/luxury_marrakech_office_hero_1775496536100.png',
      title_fr: 'Guide de choix de la forme juridique au Maroc : SARL, SA ou Auto-entrepreneur ?',
      title_en: 'Choosing a legal structure in Morocco: SARL, SA, or Self-employed?',
      title_ar: 'دليل اختيار الشكل القانوني للشركة في المغرب: شركة ذات مسؤولية محدودة، شركة مساهمة أم مقاول ذاتي؟',
      excerpt_fr: 'Quel statut juridique choisir pour votre projet au Maroc ? Comparez les formes SARL, SA et Auto-entrepreneur pour faire le meilleur choix avec TAW10.',
      excerpt_en: 'Which legal status should you choose for your business in Morocco? Compare SARL, SA, and self-employed options with TAW10.',
      excerpt_ar: 'أي شكل قانوني تختار لمشروعك في المغرب؟ قارن بين الشركات والمقاول الذاتي لتتخذ القرار الصحيح مع TAW10.',
      content_fr: `Le choix de la forme juridique est l'une des décisions les plus importantes lors de la création d'entreprise au Maroc. Sur [taw10.com](https://taw10.com) et [taw10.ma](https://taw10.ma), nos conseillers vous accompagnent pour opter pour la structure la plus adaptée à vos besoins.

### 1. La SARL (Société à Responsabilité Limitée)
C'est la forme la plus courante au Maroc pour les petites et moyennes entreprises. Elle protège les biens personnels des associés et n'impose pas de capital minimum.

### 2. Le statut de l'Auto-entrepreneur
Idéal pour les consultants, freelances et prestataires de services individuels avec un chiffre d'affaires plafonné.

### 3. La SA (Société Anonyme)
Adaptée aux grands projets nécessitant des capitaux importants avec un minimum de 5 associés.

Nos experts juridiques rédigent vos statuts de SARL ou SA clés en main. Rendez-vous sur [taw10.ma](https://taw10.ma) pour lancer vos formalités de création ou visitez [taw10.com](https://taw10.com) pour plus de conseils personnalisés.`,
      content_en: `Selecting the right legal entity is crucial for starting your business in Morocco. Explore our packages on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma) to choose your legal structure.

### 1. Limited Liability Company (SARL)
The most popular corporate form in Morocco. It offers limited liability protection and requires no minimum capital.

### 2. Self-Employed (Auto-entrepreneur)
Perfect for freelancers and single consultants with limited annual revenue.

### 3. Joint Stock Company (SA)
Designed for larger corporations with a minimum capital requirement of 300,000 DH.

Get professional legal guidance from TAW10 experts on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma) to incorporate your business.`,
      content_ar: `يعد اختيار الشكل القانوني لشركتكم من أهم القرارات عند تأسيس المقاولات في المغرب. على [taw10.com](https://taw10.com) و [taw10.ma](https://taw10.ma)، يرافقكم مستشارونا لاختيار البنية الأكثر ملاءمة لمشروعكم.

### 1. الشركة ذات المسؤولية المحدودة (SARL)
وهي الشكل الأكثر شعبية في المغرب للشركات الصغيرة والمتوسطة، حيث تحمي أموال الشركاء الشخصية ولا تفرض حداً أدنى لرأس المال.

### 2. نظام المقاول الذاتي
مناسب جداً للأنشطة الفردية والمستشارين المستقلين برقم معاملات سنوي محدد.

### 3. شركة المساهمة (SA)
تصلح للمشاريع الكبيرة التي تحتاج إلى تمويل ضخم بحد أدنى للرأسمال يبلغ 300,000 درهم.

احصل على مرافقة قانونية لتأسيس شركتك اليوم عبر موقعنا [taw10.ma](https://taw10.ma) أو [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Choisir sa forme juridique au Maroc | TAW10',
      metaTitle_en: 'Choosing a legal structure in Morocco | TAW10',
      metaTitle_ar: 'دليل اختيار الشكل القانوني للشركة في المغرب | TAW10',
      metaDescription_fr: 'Comparez les structures juridiques SARL, SA et auto-entrepreneur pour votre projet au Maroc avec TAW10.',
      metaDescription_en: 'Compare SARL, SA, and self-employed structures for your business in Morocco with TAW10.',
      metaDescription_ar: 'قارن بين أشكال الشركات في المغرب لتتخذ الخيار الأمثل لمشروعك مع TAW10.',
      excerpt: 'Quel statut juridique choisir pour votre projet au Maroc ? Comparez les formes SARL, SA et Auto-entrepreneur.',
      content: 'Le choix de la forme juridique est l\'une des décisions les plus importantes lors de la création d\'entreprise au Maroc.',
      metaTitle: 'Choisir sa forme juridique au Maroc | TAW10',
      metaDescription: 'Comparez les structures juridiques SARL, SA et auto-entrepreneur pour votre projet au Maroc.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-06-10T00:00:00.000Z'),
    },
    {
      title: 'Comment choisir sa banque professionnelle au Maroc pour sa nouvelle entreprise',
      slug: 'choisir-banque-professionnelle-maroc',
      featuredImage: '/leadership-photo.jpeg',
      title_fr: 'Comment choisir sa banque professionnelle au Maroc pour sa nouvelle entreprise',
      title_en: 'How to choose a business bank in Morocco for your new company',
      title_ar: 'كيف تختار البنك المهني المناسب لشركتك الجديدة في المغرب',
      excerpt_fr: 'Découvrez les critères essentiels pour choisir la bonne banque professionnelle au Maroc et ouvrir votre compte bloqué de création de société.',
      excerpt_en: 'Learn how to select the best commercial bank in Morocco to open your capital deposit account and manage business banking.',
      excerpt_ar: 'اكتشف المعايير الأساسية لاختيار البنك المهني المناسب في المغرب وفتح الحساب البنكي المجمد لتأسيس شركتك.',
      content_fr: `L'ouverture d'un compte bancaire professionnel est une étape obligatoire pour finaliser la création de votre société. Grâce à **TAW 10** sur [taw10.ma](https://taw10.ma) et [taw10.com](https://taw10.com), simplifiez vos relations bancaires.

### 1. Compte de capital bloqué
Toute SARL avec un capital supérieur à 100 000 DH (et recommandé pour toutes) doit bloquer ses fonds et obtenir une attestation de dépôt.

### 2. Tarifs et services de banque en ligne
Comparez les frais de tenue de compte, les coûts des virements nationaux/internationaux et la qualité de la plateforme de e-banking.

### 3. Accompagnement de TAW10
Nous vous mettons en relation avec les meilleures agences bancaires de Marrakech pour faciliter et accélérer l'ouverture de votre compte définitif.

Visitez [taw10.ma](https://taw10.ma) pour démarrer vos formalités d'immatriculation de société ou contactez-nous sur [taw10.com](https://taw10.com) pour obtenir votre contrat de domiciliation nécessaire à l'ouverture du compte.`,
      content_en: `Opening a professional bank account is a key step to complete your company incorporation in Morocco. Learn more at [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma).

### 1. Capital Deposit Account
Secure your share capital in a blocked account to receive the mandatory deposit certificate.

### 2. Evaluate Fees & Services
Review monthly maintenance fees, international transaction costs, and online banking platforms.

### 3. Banking Partnership
TAW10 introduces you to leading banks in Marrakech to speed up your corporate account setup.

Start today by visiting [taw10.ma](https://taw10.ma) or talking to our advisors on [taw10.com](https://taw10.com).`,
      content_ar: `يعتبر فتح حساب بنكي مهني خطوة إلزامية لإنهاء تأسيس شركتكم. بفضل **TAW 10** على [taw10.ma](https://taw10.ma) و [taw10.com](https://taw10.com)، نسهل علاقاتكم البنكية.

### 1. حساب رأس المال المجمد
إيداع رأس مال الشركة في حساب بنكي مجمد للحصول على شهادة الإيداع الإلزامية للتأسيس.

### 2. مقارنة الخدمات والتعريفات
قارن بين مصاريف تسيير الحساب، تكاليف التحويلات الدولية وجودة الخدمات البنكية الإلكترونية.

### 3. شراكة TAW10 البنكية
نقوم بربطكم بوكالات بنكية شريكة في مراكش لتسريع فتح حسابكم النهائي.

ابدأ اليوم عبر زيارة [taw10.ma](https://taw10.ma) أو تواصل معنا على [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Choisir sa banque professionnelle au Maroc | TAW10',
      metaTitle_en: 'How to choose a business bank in Morocco | TAW10',
      metaTitle_ar: 'كيف تختار البنك المهني لشركتك في المغرب | TAW10',
      metaDescription_fr: 'Guide pratique pour choisir la banque professionnelle et ouvrir le compte bancaire de votre entreprise au Maroc.',
      metaDescription_en: 'Practical guide to selecting a business bank and opening your corporate account in Morocco.',
      metaDescription_ar: 'دليل عملي لاختيار البنك المهني المناسب وفتح حساب شركتكم في المغرب.',
      excerpt: 'Découvrez les critères essentiels pour choisir la bonne banque professionnelle au Maroc.',
      content: 'L\'ouverture d\'un compte bancaire professionnel est une étape obligatoire pour finaliser la création de votre société.',
      metaTitle: 'Choisir sa banque professionnelle au Maroc | TAW10',
      metaDescription: 'Guide pratique pour choisir la banque professionnelle et ouvrir le compte bancaire de votre entreprise au Maroc.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-06-15T00:00:00.000Z'),
    },
    {
      title: 'Comment réussir la création de sa SARL au Maroc : formalités et conseils',
      slug: 'reussir-creation-sarl-maroc',
      featuredImage: '/luxury_marrakech_office_hero_1775496536100.png',
      title_fr: 'Comment réussir la création de sa SARL au Maroc : formalités et conseils',
      title_en: 'How to successfully create a SARL in Morocco: formal procedures and tips',
      title_ar: 'كيف تنجح في إنشاء شركة ذات مسؤولية محدودة (SARL) في المغرب: الإجراءات والنصائح',
      excerpt_fr: 'Guide pratique pour réussir la création de votre SARL au Maroc de A à Z : certificat négatif, statuts, et immatriculation avec TAW10.',
      excerpt_en: 'Step-by-step guide to successfully incorporating your SARL company in Morocco with TAW10.',
      excerpt_ar: 'دليل عملي للنجاح في إنشاء شركتك ذات المسؤولية المحدودة (SARL) في المغرب من الألف إلى الياء مع TAW10.',
      content_fr: `La SARL (Société à Responsabilité Limitée) reste le choix favori des investisseurs au Maroc. Grâce aux services d'assistance de **TAW 10** sur [taw10.ma](https://taw10.ma) et [taw10.com](https://taw10.com), optimisez la création de votre entreprise.

### 1. La rédaction d'un objet social précis
L'activité de votre entreprise doit être clairement définie pour éviter tout refus au registre du commerce.

### 2. Le choix du siège social (Domiciliation)
L'adresse du siège social détermine la juridiction de votre entreprise. Opter pour une domiciliation d'entreprise à Marrakech chez TAW10 simplifie grandement vos démarches de patente et d'identifiant fiscal.

### 3. Les formalités d'enregistrement
Enregistrement au tribunal de commerce, déclaration de patente, et affiliation CNSS.

Lancez dès aujourd'hui la création de votre SARL au Maroc avec nos avocats partenaires sur [taw10.ma](https://taw10.ma) ou consultez nos guides de domiciliation sur [taw10.com](https://taw10.com).`,
      content_en: `Starting a SARL (LLC) is the most preferred route for foreign investors in Morocco. Get complete support with **TAW 10** on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma).

### 1. Choose a clear Business Purpose
Ensure your corporate activities are properly described to pass the commercial court check.

### 2. Domicile your Office
Using a business center address in Marrakech instead of renting a local office lowers your starting expenses and tax liabilities.

### 3. Commercial Registry Filing
Finalize registration at the trade court and register for local corporate tax.

Incorporate your SARL company in Morocco easily with TAW10. Visit [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma) to start.`,
      content_ar: `تظل الشركة ذات المسؤولية المحدودة (SARL) الخيار المفضل للمستثمرين في المغرب. بفضل خدمات الدعم من **TAW 10** على [taw10.ma](https://taw10.ma) و [taw10.com](https://taw10.com)، يمكنك تسريع تأسيس شركتك.

### 1. تحديد غرض الشركة بدقة
يجب صياغة نشاط الشركة بوضوح لتجنب أي رفض من طرف المحكمة التجارية.

### 2. اختيار المقر الاجتماعي (التوطين بمراكش)
تحديد عنوان الشركة يحدد دائرتها الضريبية والقانونية. اختيار التوطين لدى TAW10 يسهل بشكل كبير الحصول على البتنت والتعريف الضريبي.

### 3. إتمام إجراءات التسجيل النهائي
التسجيل في السجل التجاري والتحصيل الضريبي والاشتراك في الضمان الاجتماعي.

ابدأ تأسيس شركتك اليوم بكل سهولة عبر [taw10.ma](https://taw10.ma) أو [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Créer sa SARL au Maroc : formalités et conseils | TAW10',
      metaTitle_en: 'How to successfully create a SARL in Morocco | TAW10',
      metaTitle_ar: 'كيف تنجح في إنشاء شركة SARL في المغرب | TAW10',
      metaDescription_fr: 'Guide pratique pour réussir la création de votre SARL au Maroc de A à Z avec TAW10 sur taw10.ma.',
      metaDescription_en: 'Step-by-step guide to incorporating your SARL company in Morocco with TAW10 on taw10.com.',
      metaDescription_ar: 'دليل عملي لتأسيس شركة ذات مسؤولية محدودة بالمغرب مع TAW10 عبر موقعنا الإلكتروني.',
      excerpt: 'Guide pratique pour réussir la création de votre SARL au Maroc de A à Z.',
      content: 'La SARL (Société à Responsabilité Limitée) reste le choix favori des investisseurs au Maroc.',
      metaTitle: 'Créer sa SARL au Maroc : formalités et conseils | TAW10',
      metaDescription: 'Guide pratique pour réussir la création de votre SARL au Maroc de A à Z.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-06-20T00:00:00.000Z'),
    },
    {
      title: 'Pourquoi domicilier son entreprise à Marrakech en 2026',
      slug: 'pourquoi-domicilier-entreprise-marrakech',
      featuredImage: '/blog-avantage.jpg',
      title_fr: 'Pourquoi domicilier son entreprise à Marrakech en 2026',
      title_en: 'Why you should choose business domiciliation in Marrakech in 2026',
      title_ar: 'لماذا يجب عليك اختيار توطين شركتك في مراكش عام 2026',
      excerpt_fr: 'Marrakech se positionne comme le hub des entrepreneurs au Maroc. Découvrez pourquoi la domiciliation y est idéale avec TAW10.',
      excerpt_en: 'Marrakech is rising as a startup hub in North Africa. Discover why domiciliation is the best choice with TAW10.',
      excerpt_ar: 'تتمتع مراكش بجاذبية اقتصادية قوية لرواد الأعمال. اكتشف لماذا يعتبر التوطين فيها خياراً ممتازاً مع TAW10.',
      content_fr: `Marrakech n'est pas seulement une destination touristique mondiale ; c'est aussi un centre d'affaires en pleine expansion au Maroc. Avec **TAW 10** sur [taw10.ma](https://taw10.ma) et [taw10.com](https://taw10.com), domiciliez votre activité dans un écosystème dynamique.

### 1. Attractivité économique et networking
Marrakech attire de nombreux investisseurs étrangers, créant de formidables opportunités de réseautage et d'affaires.

### 2. Réduction drastique des coûts
Plutôt que d'investir dans un bail commercial contraignant, la domiciliation d'entreprise à Marrakech vous offre une adresse de siège social à faible coût.

### 3. Flexibilité administrative
Nos équipes s'occupent de la réception du courrier, de sa numérisation et de l'accueil téléphonique personnalisé pour votre entreprise.

Bénéficiez d'une adresse de prestige pour votre société à Marrakech dès maintenant sur [taw10.ma](https://taw10.ma) et [taw10.com](https://taw10.com).`,
      content_en: `Marrakech is much more than a tourist destination; it is a booming business center in Morocco. Cooperate with **TAW 10** on [taw10.com](https://taw10.com) and [taw10.ma](https://taw10.ma) to base your business there.

### 1. Strategic Location
Basing your brand in Gueliz or Allal El Fassi in Marrakech positions your company as a modern and trustworthy entity.

### 2. High Financial Flexibility
Say goodbye to expensive office rental agreements, and only pay for a virtual office address and shared meeting rooms.

### 3. Full Administrative Services
TAW10 handles your incoming mail, forwards urgent scans, and supports your local administration requirements.

Select your registered office package in Marrakech today at [taw10.com](https://taw10.com) or [taw10.ma](https://taw10.ma).`,
      content_ar: `ليست مراكش مجرد وجهة سياحية عالمية فحسب، بل هي أيضاً قطب اقتصادي متنامٍ للأعمال بالمغرب. بالتعاون مع **TAW 10** على [taw10.ma](https://taw10.ma) و [taw10.com](https://taw10.com)، يمكنك توطين نشاطك في بيئة ريادية ممتازة.

### 1. جاذبية اقتصادية وفرص تواصل وشراكات
تجذب مراكش العديد من المستثمرين، مما يوفر فرصاً هائلة للتشبيك وتطوير الأعمال.

### 2. خفض التكاليف التشغيلية بشكل كبير
بدلاً من كراء مكتب مادي مكلف، يتيح لك التوطين عنواناً قانونياً رسمياً بأقل التكاليف.

### 3. مرونة ودعم إداري متكامل
يتولى فريقنا استقبال وتصوير بريدكم وإدارة مكالماتكم الهاتفية.

احصل على مقر اجتماعي مرموق لشركتك بمراكش الآن عبر [taw10.ma](https://taw10.ma) أو [taw10.com](https://taw10.com).`,
      metaTitle_fr: 'Pourquoi domicilier son entreprise à Marrakech | TAW10',
      metaTitle_en: 'Why choose business domiciliation in Marrakech | TAW10',
      metaTitle_ar: 'لماذا يجب عليك اختيار توطين شركتك في مراكش | TAW10',
      metaDescription_fr: 'Découvrez les avantages de Marrakech pour domicilier votre entreprise avec TAW10 sur taw10.ma et taw10.com.',
      metaDescription_en: 'Discover the advantages of business domiciliation in Marrakech with TAW10 on taw10.com.',
      metaDescription_ar: 'اكتشف مزايا توطين شركتك في مراكش مع TAW10 عبر بوابتنا الإلكترونية.',
      excerpt: 'Marrakech se positionne comme le hub des entrepreneurs au Maroc. Découvrez pourquoi la domiciliation y est idéale.',
      content: 'Marrakech n\'est pas seulement une destination touristique mondiale ; c\'est aussi un centre d\'affaires en pleine expansion.',
      metaTitle: 'Pourquoi domicilier son entreprise à Marrakech | TAW10',
      metaDescription: 'Marrakech se positionne comme le hub des entrepreneurs au Maroc. Découvrez pourquoi la domiciliation y est idéale.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-06-25T00:00:00.000Z'),
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
      question_fr: 'Quels documents sont necessaires ?',
      question_en: 'What documents are required?',
      question_ar: 'ما هي الوثائق المطلوبة؟',
      answer_fr: 'Une CIN ou un passeport, les informations de la societe, le certificat negatif si disponible, et les coordonnees du gerant.',
      answer_en: 'An ID or passport, company information, negative certificate if available, and the manager\'s contact details.',
      answer_ar: 'بطاقة هوية أو جواز سفر، معلومات الشركة، الشهادة السلبية إذا توفرت، ومعلومات الاتصال بالمدير.',
      sortOrder: 1,
      isActive: true,
    },
    {
      question_fr: 'Combien de temps prend la creation ?',
      question_en: 'How long does the creation take?',
      question_ar: 'كم من الوقت يستغرق الإنشاء؟',
      answer_fr: 'Le delai depend du dossier et des administrations, mais TAW10 optimise chaque etape pour avancer rapidement.',
      answer_en: 'The timeframe depends on the file and administrations, but TAW10 optimizes every step to progress quickly.',
      answer_ar: 'تعتمد المدة على الملف والإدارات، لكن TAW10 تحسن كل خطوة للتقدم بسرعة.',
      sortOrder: 2,
      isActive: true,
    },
    {
      question_fr: 'La domiciliation inclut-elle la gestion du courrier ?',
      question_en: 'Does domiciliation include mail management?',
      question_ar: 'هل يشمل التوطين إدارة البريد؟',
      answer_fr: 'Oui, les offres de domiciliation peuvent inclure la reception, le suivi et la notification du courrier professionnel.',
      answer_en: 'Yes, domiciliation offers can include reception, tracking, and notification of professional mail.',
      answer_ar: 'نعم، يمكن أن تشمل عروض التوطين استقبال، تتبع وإشعار البريد المهني.',
      sortOrder: 3,
      isActive: true,
    },
    {
      question_fr: 'Puis-je choisir un pack depuis le site ?',
      question_en: 'Can I choose a pack from the website?',
      question_ar: 'هل يمكنني اختيار باقة من الموقع؟',
      answer_fr: 'Oui, vous pouvez choisir le pack qui convient a votre projet et envoyer une demande directement depuis les cartes de prix.',
      answer_en: 'Yes, you can choose the pack that suits your project and send a request directly from the pricing cards.',
      answer_ar: 'نعم، يمكنك اختيار الباقة التي تناسب مشروعك وإرسال طلب مباشرة من بطاقات الأسعار.',
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
