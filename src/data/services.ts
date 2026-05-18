export interface ServiceFeature {
  id: string;
  name: string;
  desc: string;
}

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: ServiceFeature[];
}

export const servicesData: Record<string, Record<string, Service>> = {
  "FR": {
    "domiciliation": {
      title: "Domiciliation Entreprise Marrakech",
      subtitle: "Votre adresse de siège social à Marrakech au meilleur tarif.",
      description: "Une <strong>domiciliation entreprise Marrakech</strong> est bien plus qu'une obligation légale ; c'est un marqueur de crédibilité. TAW 10 vous offre une <strong>adresse siège social marrakech</strong> prestigieuse combinée à une formule de <strong>domiciliation commerciale maroc</strong> clé en main. Profitez d'une <strong>domiciliation société pas cher marrakech</strong> pour propulser votre rayonnement à moindre coût.",
      benefits: [
        "Adresse prestigieuse à Marrakech",
        "Gestion quotidienne du courrier",
        "Numérisation et transfert d'emails",
        "Accès aux salles de réunion",
        "Réception de vos colis et fax"
      ],
      features: [
        { id: "01", name: "Crédibilité Instantanée", desc: "Installez votre siège social dans l'un des quartiers les plus dynamiques et respectés de la ville rouge." },
        { id: "02", name: "Flexibilité Totale", desc: "Des contrats souples qui s'adaptent à l'évolution de votre entreprise, de la startup à la multinationale." },
        { id: "03", name: "Support Dédié", desc: "Notre équipe s'occupe de vos formalités pour que vous restiez concentré sur votre cœur de métier." }
      ]
    },
    "creation-entreprise": {
      title: "Création Entreprise Marrakech",
      subtitle: "Votre accompagnement pour la création de société au Maroc en 2025.",
      description: "Réalisez votre <strong>création entreprise marrakech</strong> en toute sérénité. Que vous souhaitiez <strong>créer une SARL à marrakech</strong> ou <strong>ouvrir une entreprise au maroc</strong> en tant qu'indépendant, nos experts vous offrent un <strong>accompagnement création entreprise marrakech</strong> sur mesure. Nous optimisons chaque étape pour réduire le <strong>délai création SARL maroc</strong> au strict minimum et réussir votre <strong>création société maroc 2025</strong>.",
      benefits: [
        "Certificat négatif en 24h",
        "Rédaction des statuts sur mesure",
        "Accompagnement banque",
        "Inscription Taxe Professionnelle",
        "Obtention du RC et IF"
      ],
      features: [
        { id: "01", name: "Accompagnement 360°", desc: "Nous gérons tout, du certificat négatif jusqu'à la publication légale et l'ouverture du compte." },
        { id: "02", name: "Délais Records", desc: "Grâce à notre expertise et nos relations, nous réduisons les délais administratifs au maximum." },
        { id: "03", name: "Conseil Fiscal", desc: "Bénéficiez de conseils d'experts pour choisir la structure juridique la plus avantageuse pour vos besoins." }
      ]
    },
    "secretariat": {
      title: "Secrétariat Virtuel",
      subtitle: "Votre bureau, partout, tout le temps.",
      description: "Externalisez votre gestion administrative et profitez d'une équipe professionnelle pour gérer vos appels, vos rendez-vous et votre correspondance. Une présence permanente pour vos clients, sans les coûts d'un bureau physique.",
      benefits: [
        "Accueil téléphonique personnalisé",
        "Gestion d'agenda",
        "Prise de messages",
        "Traitement de texte",
        "Support multilingue"
      ],
      features: [
        { id: "01", name: "Image de Marque", desc: "Un accueil professionnel qui renforce la perception de votre sérieux auprès de vos partenaires." },
        { id: "02", name: "Économies Majeures", desc: "Réduisez vos charges fixes en évitant le recrutement d'une secrétaire physique à plein temps." },
        { id: "03", name: "Réactivité", desc: "Ne manquez plus jamais un appel important ou un client potentiel grâce à notre veille constante." }
      ]
    },
    "accompagnement-juridique": {
      title: "Accompagnement Juridique",
      subtitle: "Sécurisez la croissance de votre entreprise.",
      description: "Le cadre légal est le socle de toute entreprise pérenne. Nos experts vous assistent dans toutes vos modifications statutaires, transferts de siège ou cessions d'actions, garantissant une conformité totale avec la loi marocaine.",
      benefits: [
        "Modifications statutaires",
        "Transferts de siège social",
        "Cession de parts sociales",
        "Dissolution et Liquidation",
        "Veille juridique"
      ],
      features: [
        { id: "01", name: "Conformité Garantie", desc: "Évitez les risques juridiques grâce à une expertise pointue des lois en vigueur au Maroc." },
        { id: "02", name: "Efficacité Administrative", desc: "Nous prenons en charge la lourdeur des dépôts au greffe et des publications légales." },
        { id: "03", name: "Confidentialité", desc: "Un traitement rigoureux et confidentiel de tous vos dossiers stratégiques et personnels." }
      ]
    },
    "support-administratif": {
      title: "Cabinet Comptable Marrakech",
      subtitle: "Votre gestion comptabilité et fiscalité d'entreprise au Maroc.",
      description: "Trouver un <strong>cabinet comptable marrakech</strong> rigoureux est la clé de voûte de votre réussite financière. Chez TAW 10, nous mettons à votre service un <strong>expert comptable marrakech</strong> qualifié pour prendre en charge votre <strong>gestion comptabilité entreprise marrakech</strong>. De la saisie de vos pièces comptables à la <strong>déclaration TVA maroc PME</strong>, nous vous assurons une conformité fiscale absolue au Maroc.",
      benefits: [
        "Aide à la facturation",
        "Gestion des fournisseurs",
        "Classement documentaire",
        "Préparation comptable",
        "Démarches administratives"
      ],
      features: [
        { id: "01", name: "Gain de Temps", desc: "Libérez 50% de votre temps hebdomadaire en déléguant les tâches répétitives." },
        { id: "02", name: "Organisation Optimale", desc: "Mise en place de processus de classement et de suivi performants pour votre gestion." },
        { id: "03", name: "Tranquillité d'Esprit", desc: "Sachez que vos dossiers quotidiens sont entre de bonnes mains et toujours à jour." }
      ]
    },
    "conseil-strategique": {
      title: "Créer Entreprise Maroc Investisseur Étranger",
      subtitle: "L'accompagnement stratégique pour ouvrir votre société au Maroc en tant que non-résident.",
      description: "Vous souhaitez <strong>créer entreprise maroc investisseur étranger</strong> ? TAW 10 est votre partenaire privilégié pour <strong>investir à marrakech 2025</strong>. Notre cabinet vous aide à <strong>ouvrir société maroc non résident</strong> et décode pour vous la <strong>réglementation entreprise étrangère maroc</strong>. Nous vous garantissons un déploiement sécurisé, conforme et rapide de votre capital au Maroc.",
      benefits: [
        "Études de marché",
        "Business Planning",
        "Accompagnement levée de fonds",
        "Optimisation des coûts",
        "Stratégie d'implantation"
      ],
      features: [
        { id: "01", name: "Vision Insight", desc: "Bénéficiez de notre connaissance profonde du tissu économique de Marrakech et du Maroc." },
        { id: "02", name: "Réseau de Partenaires", desc: "Profitez de nos connexions avec les acteurs clés pour accélérer votre développement." },
        { id: "03", name: "Expertise Opérationnelle", desc: "Des conseils qui ne sont pas que théoriques, mais directement applicables à votre réalité métier." }
      ]
    }
  },
  "EN": {
    "domiciliation": {
      title: "Premium Domiciliation",
      subtitle: "A prestigious address for your influence.",
      description: "An address in the heart of Marrakech is much more than a legal obligation; it is a marker of credibility and prestige for your business. TAW 10 offers you a strategic location combined with an exemplary mail management service.",
      benefits: [
        "Prestigious address in Marrakech",
        "Daily mail management",
        "Email scanning and forwarding",
        "Access to meeting rooms",
        "Receipt of parcels and faxes"
      ],
      features: [
        { id: "01", name: "Instant Credibility", desc: "Establish your head office in one of the most dynamic and respected districts of the Red City." },
        { id: "02", name: "Total Flexibility", desc: "Flexible contracts that adapt to the evolution of your company, from startup to multinational." },
        { id: "03", name: "Dedicated Support", desc: "Our team takes care of your formalities so that you remain focused on your core business." }
      ]
    },
    "creation-entreprise": {
      title: "Company Creation",
      subtitle: "Launch your vision with complete peace of mind.",
      description: "From idea to realization, we accompany you in all legal and administrative stages of the creation of your company in Morocco. Speed, expertise, and transparency are our watchwords.",
      benefits: [
        "Negative certificate in 24h",
        "Custom statutes drafting",
        "Bank support",
        "Professional Tax registration",
        "Obtaining CR and IF"
      ],
      features: [
        { id: "01", name: "360° Support", desc: "We manage everything, from the negative certificate to the legal publication and account opening." },
        { id: "02", name: "Record Deadlines", desc: "Thanks to our expertise and relationships, we reduce administrative deadlines to the maximum." },
        { id: "03", name: "Tax Advice", desc: "Benefit from expert advice to choose the most advantageous legal structure for your needs." }
      ]
    },
    "secretariat": {
      title: "Virtual Secretariat",
      subtitle: "Your office, everywhere, all the time.",
      description: "Outsource your administrative management and benefit from a professional team to manage your calls, appointments, and correspondence. A permanent presence for your clients, without the costs of a physical office.",
      benefits: [
        "Personalized telephone reception",
        "Agenda management",
        "Message taking",
        "Word processing",
        "Multilingual support"
      ],
      features: [
        { id: "01", name: "Brand Image", desc: "A professional reception that strengthens the perception of your seriousness among your partners." },
        { id: "02", name: "Major Savings", desc: "Reduce your fixed charges by avoiding the recruitment of a full-time physical secretary." },
        { id: "03", name: "Responsiveness", desc: "Never miss an important call or a potential client again thanks to our constant monitoring." }
      ]
    },
    "accompagnement-juridique": {
      title: "Legal Support",
      subtitle: "Secure the growth of your business.",
      description: "The legal framework is the foundation of any sustainable business. Our experts assist you in all your statutory changes, head office transfers, or share transfers, guaranteeing total compliance with Moroccan law.",
      benefits: [
        "Statutory changes",
        "Head office transfers",
        "Share transfers",
        "Dissolution and Liquidation",
        "Legal monitoring"
      ],
      features: [
        { id: "01", name: "Guaranteed Compliance", desc: "Avoid legal risks thanks to specialized expertise in current Moroccan laws." },
        { id: "02", name: "Administrative Efficiency", desc: "We handle the burden of court filings and legal publications." },
        { id: "03", name: "Confidentiality", desc: "Rigorous and confidential processing of all your strategic and personal files." }
      ]
    },
    "support-administratif": {
      title: "Accounting Cabinet Marrakech",
      subtitle: "Your accounting management and corporate tax support in Morocco.",
      description: "Finding a trusted <strong>accounting cabinet in Marrakech</strong> is crucial for your financial success. TAW 10 provides you with a professional <strong>chartered accountant in Marrakech</strong> to manage your <strong>corporate accounting in Morocco</strong>, from basic bookkeeping to <strong>VAT declaration for SMEs</strong>.",
      benefits: [
        "Invoicing assistance",
        "Supplier management",
        "Document filing",
        "Accounting preparation",
        "Administrative procedures"
      ],
      features: [
        { id: "01", name: "Time Saving", desc: "Free up 50% of your weekly time by delegating repetitive tasks." },
        { id: "02", name: "Optimal Organization", desc: "Implementation of high-performance filing and monitoring processes for your management." },
        { id: "03", name: "Peace of Mind", desc: "Know that your daily files are in good hands and always up to date." }
      ]
    },
    "conseil-strategique": {
      title: "Morocco Company Creation Foreign Investor",
      subtitle: "Strategic guidance to open a company in Morocco as a non-resident.",
      description: "Looking to <strong>start a business in Morocco as a foreign investor</strong>? TAW 10 is your primary consultant to <strong>invest in Marrakech in 2025</strong>. We guide you to <strong>open a company in Morocco as a non-resident</strong> while securing full compliance with <strong>foreign business regulations in Morocco</strong>.",
      benefits: [
        "Market research",
        "Business Planning",
        "Fundraising support",
        "Cost optimization",
        "Implementation strategy"
      ],
      features: [
        { id: "01", name: "Vision Insight", desc: "Benefit from our deep knowledge of the economic fabric of Marrakech and Morocco." },
        { id: "02", name: "Partner Network", desc: "Enjoy our connections with key players to accelerate your development." },
        { id: "03", name: "Operational Expertise", desc: "Advice that is not just theoretical, but directly applicable to your business reality." }
      ]
    }
  },
  "AR": {
    "domiciliation": {
      title: "توطين ممتاز",
      subtitle: "العنوان المرموق لإشعاعك.",
      description: "العنوان في قلب مراكش هو أكثر بكثير من مجرد التزام قانوني؛ إنه علامة على المصداقية والهيبة لشركتك. تقدم لك TAW 10 موقعاً استراتيجياً مقترناً بخدمة إدارة بريد مثالية.",
      benefits: [
        "عنوان مرموق في مراكش",
        "إدارة البريد اليومية",
        "مسح البريد وإرساله عبر البريد الإلكتروني",
        "الوصول إلى قاعات الاجتماعات",
        "استلام الطرود والفاكس"
      ],
      features: [
        { id: "01", name: "مصداقية فورية", desc: "أنشئ مقرك الاجتماعي في أحد أكثر أحياء المدينة الحمراء ديناميكية واحتراماً." },
        { id: "02", name: "مرونة كاملة", desc: "عقود مرنة تتكيف مع تطور شركتك، من الشركة الناشئة إلى الشركة متعددة الجنسيات." },
        { id: "03", name: "دعم مخصص", desc: "يتولى فريقنا إجراءاتك الرسمية لتبقى مركزاً على جوهر عملك." }
      ]
    },
    "creation-entreprise": {
      title: "إنشاء الشركات",
      subtitle: "أطلق رؤيتك بكل طمأنينة.",
      description: "من الفكرة إلى التجسيد، نرافقك في جميع المراحل القانونية والإدارية لإنشاء شركتك في المغرب. السرعة والخبرة والشفافية هي شعاراتنا.",
      benefits: [
        "الشهادة السلبية في 24 ساعة",
        "صياغة القانون الأساسي حسب المقاس",
        "المواكبة البنكية",
        "التعريف الضريبي",
        "الحصول على السجل التجاري والتعريف الضريبي"
      ],
      features: [
        { id: "01", name: "مواكبة 360 درجة", desc: "ندير كل شيء، من الشهادة السلبية إلى النشر القانوني وفتح الحساب." },
        { id: "02", name: "مواعيد قياسية", desc: "بفضل خبرتنا وعلاقاتنا، نقلل المواعيد الإدارية إلى الحد الأقصى." },
        { id: "03", name: "استشارة ضريبية", desc: "استفد من نصائح الخبراء لاختيار الهيكل القانوني الأكثر فائدة لاحتياجاتك." }
      ]
    },
    "secretariat": {
      title: "سكرتارية افتراضية",
      subtitle: "مكتبك، في كل مكان، وفي كل وقت.",
      description: "قم بتفويض إدارتك الإدارية واستفد من فريق محترف لإدارة مكالماتك ومواعيدك ومراسلاتك. تواجد دائم لعملائك، دون تكاليف المكتب المادي.",
      benefits: [
        "استقبال هاتفي مخصص",
        "إدارة جدول المواعيد",
        "أخذ الرسائل",
        "معالجة النصوص",
        "دعم متعدد اللغات"
      ],
      features: [
        { id: "01", name: "صورة العلامة التجارية", desc: "استقبال محترف يعزز تصور جديتك لدى شركائك." },
        { id: "02", name: "توفير كبير", desc: "قلل تكاليفك الثابتة من خلال تجنب توظيف سكرتيرة مادية بدوام كامل." },
        { id: "03", name: "سرعة الاستجابة", desc: "لا تفوت أي مكالمة مهمة أو عميل محتمل بفضل مراقبتنا المستمرة." }
      ]
    },
    "accompagnement-juridique": {
      title: "المواكبة القانونية",
      subtitle: "تأمين نمو شركتك.",
      description: "الإطار القانوني هو أساس أي شركة مستدامة. يساعدك خبراؤنا في جميع تعديلاتك النظامية، أو نقل المقر الاجتماعي أو تفويت الأسهم، مما يضمن الامتثال التام للقانون المغربي.",
      benefits: [
        "التعديلات النظامية",
        "نقل المقر الاجتماعي",
        "تفويت حصص اجتماعية",
        "الحل والتصفية",
        "اليقظة القانونية"
      ],
      features: [
        { id: "01", name: "امتثال مضمون", desc: "تجنب المخاطر القانونية بفضل خبرة واسعة بالقوانين المعمول بها في المغرب." },
        { id: "02", name: "كفاءة إدارية", desc: "نتولى عبء الإيداعات في المحكمة والمنشورات القانونية." },
        { id: "03", name: "السرية", desc: "معالجة صارمة وسرية لجميع ملفاتك الاستراتيجية والشخصية." }
      ]
    },
    "support-administratif": {
      title: "مكتب محاسبة مراكش",
      subtitle: "إدارة المحاسبة والضرائب لشركتك في المغرب.",
      description: "إن العثور على <strong>مكتب محاسبة في مراكش</strong> يتميز بالدقة هو حجر الأساس لنجاحك المالي. في TAW 10، نضع رهن إشارتك <strong>محاسبًا معتمدًا في مراكش</strong> لتولي <strong>إدارة محاسبة شركتك في مراكش</strong>، من تسجيل الفواتير إلى <strong>إقرار ضريبة القيمة المضافة للشركات الصغرى والمتوسطة</strong>.",
      benefits: [
        "المساعدة في الفوترة",
        "إدارة الموردين",
        "أرشفة المستندات",
        "الإعداد المحاسبي",
        "الإجراءات الإدارية"
      ],
      features: [
        { id: "01", name: "توفير الوقت", desc: "وفر 50% من وقتك الأسبوعي بتفويض المهام المتكررة." },
        { id: "02", name: "تنظيم مثالي", desc: "إرساء عمليات أرشفة ومتابعة فعالة لإدارتك." },
        { id: "03", name: "راحة البال", desc: "اعلم أن ملفاتك اليومية في أيدٍ أمينة ومحدثة دائماً." }
      ]
    },
    "conseil-strategique": {
      title: "إنشاء شركة في المغرب للمستثمرين الأجانب",
      subtitle: "المواكبة الاستراتيجية لفتح شركتك في المغرب كغير مقيم.",
      description: "هل ترغب في <strong>إنشاء شركة في المغرب كمستثمر أجنبي</strong>؟ TAW 10 هو شريكك المفضل من أجل <strong>الاستثمار في مراكش 2025</strong>. يساعدك مكتبنا في <strong>فتح شركة في المغرب لغير المقيمين</strong> وفك رموز <strong>قوانين الشركات الأجنبية بالمغرب</strong>.",
      benefits: [
        "دراسات السوق",
        "تخطيط الأعمال",
        "المواكبة في جمع الأموال",
        "تحسين التكاليف",
        "استراتيجية الاستقرار"
      ],
      features: [
        { id: "01", name: "رؤية ثاقبة", desc: "استفد من معرفتنا العميقة بالنسيج الاقتصادي لمراكش والمغرب." },
        { id: "02", name: "شبكة شركاء", desc: "تمتع باتصالاتنا مع الفاعلين الرئيسيين لتسريع تطورك." },
        { id: "03", name: "خبرة تشغيلية", desc: "نصائح ليست نظرية فقط، بل قابلة للتطبيق مباشرة على واقع مهنتك." }
      ]
    }
  }
};
