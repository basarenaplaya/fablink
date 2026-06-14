export const copy = {
  app: {
    name: 'FabLink',
    tagline:
      "La place de marché tunisienne pour l'impression 3D, l'usinage CNC et la fabrication PCB.",
    shortTagline: 'Fabrication numérique en Tunisie',
  },

  nav: {
    signIn: 'Se connecter',
    becomeProvider: 'Devenir fournisseur',
    providers: 'Fournisseurs',
    postJob: 'Publier une demande',
    myRequests: 'Mes demandes',
    myAccount: 'Mon compte',
    browseProviders: 'Parcourir les ateliers',
    jobBoard: 'Tableau des offres',
    listBusiness: 'Inscrire mon atelier',
    myWorkshop: 'Mon atelier',
    myProfile: 'Mon profil',
    signOut: 'Se déconnecter',
    adminSoon: 'Administration (bientôt)',
    roles: {
      client: 'Client',
      provider: 'Fournisseur',
      admin: 'Administrateur',
    },
  },

  landing: {
    hero: {
      eyebrow: 'Fabrication numérique · Tunisie',
      title: 'Trouvez l\'atelier idéal pour votre projet',
      subtitle:
        'Parcourez des ateliers vérifiés en impression 3D, usinage CNC et fabrication PCB. Contactez-les sur WhatsApp en quelques secondes.',
      searchPlaceholder: 'Rechercher un atelier, un service, une ville…',
      exploreWorkshops: 'Explorer les ateliers',
      becomeProvider: 'Devenir fournisseur',
    },
    categories: {
      title: 'Choisissez une catégorie',
      subtitle: 'Sélectionnez le type de fabrication dont vous avez besoin.',
      printing3d: {
        title: 'Impression 3D',
        description: 'Prototypes, pièces fonctionnelles et petites séries.',
      },
      cnc: {
        title: 'Usinage CNC',
        description: 'Fraisage, tournage et pièces de précision.',
      },
      pcb: {
        title: 'Fabrication PCB',
        description: 'Circuits imprimés, prototypes et assemblage.',
      },
    },
    howItWorks: {
      title: 'Comment ça marche',
      subtitle: 'Trois étapes simples pour lancer votre projet.',
      steps: [
        {
          title: 'Rechercher',
          description:
            'Filtrez par catégorie et ville pour trouver les bons ateliers.',
        },
        {
          title: 'Comparer',
          description:
            'Consultez les portfolios, services et badges de vérification.',
        },
        {
          title: 'Contacter',
          description:
            'Ouvrez WhatsApp avec un message prérempli — sans commission.',
        },
      ],
    },
    workshopCallout: {
      title: 'Vous êtes un atelier ?',
      description:
        'Rejoignez FabLink et touchez de nouveaux clients partout en Tunisie. Inscription gratuite, contact direct via WhatsApp.',
      cta: 'Inscrire mon atelier',
    },
    directory: {
      title: 'Annuaire des ateliers',
      featured: 'Ateliers vérifiés en vedette',
    },
    footer: {
      navigation: 'Navigation',
      platform: 'Plateforme',
      home: 'Accueil',
      becomeProvider: 'Devenir fournisseur',
      clientSignIn: 'Connexion client',
      postJob: 'Publier une demande',
      jobBoard: 'Tableau des offres',
      copyright: (year: number) =>
        `© ${year} FabLink. Tous droits réservés.`,
    },
  },

  auth: {
    client: {
      title: 'Trouvez un atelier',
      description:
        'Connectez-vous pour publier des demandes et contacter des ateliers vérifiés sur WhatsApp.',
      continueGoogle: 'Continuer avec Google',
      signingIn: 'Connexion en cours…',
      footer: 'Trouvez des ateliers vérifiés et contactez-les en moins de 30 secondes.',
      providerLink: 'Vous êtes un atelier ?',
      providerLinkAction: 'Devenir fournisseur',
    },
    provider: {
      signInTitle: 'Connectez-vous pour inscrire votre atelier',
      signInDescription:
        'Utilisez votre compte Google pour créer votre profil professionnel sur FabLink.',
      continueGoogle: 'Continuer avec Google',
      signingIn: 'Connexion en cours…',
      clientLink: 'Vous cherchez un atelier ?',
      clientLinkAction: 'Connectez-vous en tant que client',
    },
    errors: {
      default: 'Impossible de se connecter. Réessayez dans un instant.',
      unauthorizedDomain:
        'Ce domaine n\'est pas autorisé pour la connexion Google. Ajoutez fablink.vercel.app dans Firebase → Authentication → Domaines autorisés.',
      popupClosed: 'Connexion annulée.',
      popupCancelled: 'Une autre fenêtre de connexion est déjà ouverte.',
      popupBlocked:
        'La fenêtre de connexion a été bloquée. Autorisez les pop-ups pour ce site.',
      network: 'Problème de connexion réseau. Vérifiez votre accès internet.',
      tooManyRequests: 'Trop de tentatives. Patientez quelques minutes.',
      accountExists:
        'Un compte existe déjà avec cet e-mail via un autre mode de connexion.',
    },
  },

  providerFunnel: {
    benefits: [
      {
        title: 'Plus de visibilité',
        description:
          'Apparaissez dans l\'annuaire et soyez trouvé par des clients qui cherchent vos services.',
      },
      {
        title: 'Contact direct via WhatsApp — 0 % commission',
        description:
          'Les clients vous contactent directement. Aucune commission sur vos projets.',
      },
      {
        title: 'Montez dans le classement',
        description:
          'Un profil complet et vérifié vous aide à vous démarquer des concurrents.',
      },
    ],
    pageTitle: 'Devenir fournisseur',
    pageSubtitle:
      'Inscrivez votre atelier et rejoignez le réseau FabLink en Tunisie.',
  },

  marketplace: {
    allCategories: 'Toutes les catégories',
    allCities: 'Toutes les villes',
    verified: 'Vérifié',
    pending: 'En attente',
    noImage: 'Aucune image',
    viewProfile: 'Voir le profil',
    whatsapp: 'WhatsApp',
    contactWhatsapp: 'Contacter via WhatsApp',
    noProviders: 'Aucun atelier trouvé',
    noProvidersHint: 'Essayez d\'ajuster vos filtres ou votre recherche.',
    loadError: 'Impossible de charger les ateliers',
    noReviews: 'Pas encore d\'avis',
  },

  requests: {
    myRequests: {
      title: 'Mes demandes',
      subtitle:
        'Gérez vos projets publiés. Fermez les missions terminées ou supprimez les annonces obsolètes.',
      empty: 'Aucune demande pour le moment',
      emptyHint:
        'Publiez votre premier projet et les ateliers pourront vous contacter sur WhatsApp.',
      postJob: 'Publier une demande',
    },
    status: {
      pending: 'En attente',
      matched: 'Associée',
      closed: 'Fermée',
    },
    markResolved: 'Marquer comme résolu',
    delete: 'Supprimer la demande',
    deleteTitle: 'Supprimer cette demande ?',
    deleteDescription:
      'Cette action est irréversible. L\'annonce sera retirée du tableau des offres.',
    cancel: 'Annuler',
    downloadFile: 'Télécharger le fichier',
    posted: 'Publié le',
    toasts: {
      closed: 'Demande fermée',
      deleted: 'Demande supprimée',
      closeError: 'Impossible de fermer la demande',
      deleteError: 'Impossible de supprimer la demande',
      loadError: 'Impossible de charger vos demandes',
    },
    form: {
      title: 'Publier une demande',
      subtitle:
        'Décrivez votre projet. Les ateliers vérifiés pourront vous contacter sur WhatsApp.',
      projectTitle: 'Titre du projet',
      projectTitlePlaceholder: 'ex. Boîtier aluminium usiné CNC',
      description: 'Description',
      descriptionPlaceholder: 'Matériaux, dimensions, quantité, délais…',
      category: 'Catégorie',
      city: 'Ville',
      file: 'Fichier de conception (optionnel)',
      fileHint: 'STL, STEP, ZIP Gerber — max 20 Mo',
      submit: 'Publier la demande',
      submitting: 'Publication en cours…',
      back: 'Retour à l\'accueil',
      success: 'Votre demande a été publiée !',
      whatsappFromProfile:
        'Votre numéro WhatsApp de profil sera partagé avec les ateliers.',
    },
    board: {
      eyebrow: 'Offres ouvertes',
      title: 'Tableau des offres',
      subtitle:
        'Parcourez les demandes de fabrication ouvertes de clients en Tunisie.',
      empty: 'Aucune offre pour le moment',
      emptyHint:
        'De nouvelles demandes apparaîtront ici. Revenez bientôt ou ajustez vos filtres.',
      contactClient: 'Contacter le client via WhatsApp',
      loadError: 'Impossible de charger les demandes',
    },
  },

  profile: {
    back: 'Retour à l\'accueil',
    about: 'À propos',
    aboutSubtitle: 'Services, machines et capacités',
    editWorkshop: 'Modifier mon atelier',
    notFound: 'Atelier introuvable',
    notFoundHint:
      'Ce profil a peut-être été supprimé ou le lien est incorrect.',
  },

  onboarding: {
    title: 'Inscrire mon atelier',
    subtitle:
      'Créez votre profil professionnel. Votre compte sera examiné avant vérification.',
    shopName: 'Nom de l\'atelier',
    whatsapp: 'WhatsApp professionnel',
    services: 'Services proposés',
    city: 'Ville',
    description: 'Description',
    portfolio: 'Photos du portfolio',
    portfolioHint: (max: number) => `Jusqu'à ${max} images (JPG, PNG, WebP)`,
    submit: 'Soumettre mon profil',
    submitting: 'Envoi en cours…',
    success: 'Profil soumis ! En attente de vérification.',
    back: 'Retour à l\'accueil',
  },

  workshop: {
    manageTitle: 'Gérer mon atelier',
    manageSubtitle:
      'Mettez à jour votre profil public, vos services et votre portfolio.',
    save: 'Enregistrer les modifications',
    updated: 'Atelier mis à jour avec succès.',
    whatsappHint:
      'Ligne professionnelle affichée sur votre fiche — peut différer de votre contact personnel.',
    portfolioRequired: 'Ajoutez au moins une image de portfolio',
    portfolioMax: (max: number) => `Maximum ${max} images au total`,
    removeImage: 'Retirer l\'image',
  },

  whatsappGate: {
    title: 'Complétez votre profil',
    description:
      'Ajoutez votre numéro WhatsApp pour publier des demandes et inscrire votre atelier. Les ateliers vous contacteront sur ce numéro.',
    label: 'Numéro WhatsApp',
    hint: '8 chiffres après +216',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Numéro WhatsApp enregistré',
    required: 'Ajoutez votre WhatsApp pour continuer',
    invalid: '8 chiffres requis après +216',
  },

  phone: {
    label: 'Téléphone',
    localHint: '8 chiffres après +216',
    copied: 'Numéro copié',
    copyHint: 'Appuyer pour copier le numéro',
    invalid: 'Entrez 8 chiffres valides',
  },

  account: {
    title: 'Mon compte',
    subtitle: 'Gérez votre profil et votre activité sur FabLink.',
    tabs: {
      profile: 'Profil',
      activity: 'Activité',
    },
    profile: {
      name: 'Nom complet',
      email: 'E-mail',
      emailReadonly: 'L\'e-mail est lié à votre compte Google.',
      whatsapp: 'WhatsApp',
      whatsappHint:
        'Utilisé pour vos demandes et comme contact principal sur la plateforme.',
      profileCardDescription:
        'Mettez à jour votre nom et votre numéro WhatsApp.',
      save: 'Enregistrer',
      saving: 'Enregistrement…',
      saved: 'Profil mis à jour',
    },
    activity: {
      clientTitle: 'Mes demandes',
      clientDescription:
        'Consultez et gérez les projets que vous avez publiés.',
      clientCta: 'Voir mes demandes',
      providerTitle: 'Mon atelier',
      providerDescription:
        'Consultez votre fiche publique et modifiez vos services ou votre portfolio.',
      viewWorkshop: 'Voir mon atelier',
      providerCta: 'Gérer mon atelier',
      publicProfile: 'Mon profil public',
    },
  },

  reviews: {
    title: 'Avis clients',
    subtitle: 'Notes et retours d\'expérience sur cet atelier.',
    averageLabel: 'Note moyenne',
    count: (count: number) =>
      count === 1 ? '1 avis' : `${count} avis`,
    empty: 'Aucun avis pour le moment',
    emptyHint: 'Soyez le premier à partager votre expérience avec cet atelier.',
    form: {
      title: 'Laisser un avis',
      editTitle: 'Modifier votre avis',
      rating: 'Votre note',
      comment: 'Votre commentaire',
      commentPlaceholder:
        'Décrivez la qualité du travail, les délais, la communication…',
      submit: 'Publier l\'avis',
      update: 'Mettre à jour l\'avis',
      submitting: 'Publication…',
      signInCta: 'Connectez-vous pour laisser un avis',
      signIn: 'Se connecter',
    },
    toasts: {
      published: 'Votre avis a été publié',
      updated: 'Votre avis a été mis à jour',
      error: 'Impossible de publier l\'avis',
      loadError: 'Impossible de charger les avis',
    },
  },

  common: {
    loading: 'Chargement…',
    error: 'Une erreur est survenue',
    fixFields: 'Veuillez corriger les champs indiqués',
  },

  redirects: {
    clientToNewRequest:
      'Publiez une demande depuis votre espace client. Redirection…',
    providerToJobBoard:
      'Le tableau des offres est réservé aux fournisseurs. Redirection…',
  },
} as const;
