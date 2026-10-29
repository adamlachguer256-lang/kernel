// Banque de questions — Help Us Student
// Pour ajouter un chapitre : copier un bloc { id, title, ... } dans CHAPTERS.
// "a" = index de la bonne réponse (0 = première option), "e" = explication.

const CHAPTERS = [
  {
    id: "chap1-noyau",
    title: "Le noyau Linux",
    tag: "Chapitre 1",
    description: "Versions, configuration, /proc et sysctl, compilation, mise à jour, modules et chargeur de démarrage.",
    questions: [
      // ── Versions ─────────────────────────────────────────
      {
        s: "Versions",
        q: "Sous quelle licence le noyau Linux est-il diffusé ?",
        o: ["GNU GPL version 2.0", "Licence MIT", "Licence BSD", "GNU GPL version 3.0"],
        a: 0,
        e: "Le noyau Linux est diffusé sous licence GNU General Public License (GPL) version 2.0."
      },
      {
        s: "Versions",
        q: "Qui a créé le premier noyau Linux, et en quelle année ?",
        o: ["Richard Stallman, en 1984", "Linus Torvalds, en 1991", "Linus Torvalds, en 1994", "Ken Thompson, en 1969"],
        a: 1,
        e: "Le premier noyau Linux a été créé en 1991 par Linus Torvalds, qui reste le premier responsable de sa maintenance."
      },
      {
        s: "Versions",
        q: "En quelles années le numéro de version majeure a-t-il changé (versions 1.0 et 2.0) ?",
        o: ["1991 et 1994", "1994 et 1996", "1996 et 2003", "1994 et 2011"],
        a: 1,
        e: "La version 1.0 date de 1994 et la version 2.0 de 1996 : ces changements correspondaient à des modifications majeures du code et du concept du noyau."
      },
      {
        s: "Versions",
        q: "Avant la version 2.6, que signifie un numéro de version mineure IMPAIR (ex. 2.5) ?",
        o: ["Un noyau stable", "Un noyau en développement", "Un correctif de sécurité", "Une version abandonnée"],
        a: 1,
        e: "Pair = noyau stable, impair = noyau en développement."
      },
      {
        s: "Versions",
        q: "Selon l'ancienne numérotation, le noyau 2.4.20 est :",
        o: ["Un noyau en développement", "Un noyau stable (mineur pair), révision 20", "La 20e version majeure", "Une version de test"],
        a: 1,
        e: "Le 4 (pair) indique un noyau stable, et 20 est le numéro de révision, incrémenté à chaque nouvelle diffusion."
      },
      {
        s: "Versions",
        q: "Avant la 2.6, à quoi correspond la troisième séquence de chiffres du numéro de version ?",
        o: ["Au numéro de version majeure", "Au numéro de version mineure", "Au numéro de révision", "Au numéro de la version stable"],
        a: 2,
        e: "La troisième séquence est le numéro de révision, incrémenté chaque fois qu'une nouvelle version du noyau est diffusée."
      },
      {
        s: "Versions",
        q: "Depuis la 2.6, une quatrième séquence (numéro de version stable) a été ajoutée. À partir de quelle version a-t-elle été utilisée pour la première fois ?",
        o: ["2.6.0", "2.6.8", "2.6.39", "3.0"],
        a: 1,
        e: "Sa première utilisation date de la version 2.6.8 du noyau."
      },
      {
        s: "Versions",
        q: "Que représente la version 3.0 du noyau, annoncée le 29 mai 2011 ?",
        o: [
          "Une réécriture complète du noyau",
          "Une simple évolution de la 2.6.39, en l'honneur des 20 ans de Linux",
          "Le passage à la licence GPL v3",
          "La première version stable de Linux"
        ],
        a: 1,
        e: "La 3.0 a été annoncée pour le 20e anniversaire de Linux ; ce n'est qu'une simple évolution de la 2.6.39."
      },

      // ── Configuration ────────────────────────────────────
      {
        s: "Configuration",
        q: "Laquelle de ces propositions N'EST PAS une des quatre méthodes pour intervenir sur la configuration du noyau ?",
        o: [
          "Modification dynamique des paramètres",
          "Chargement de modules à la volée",
          "Passage de paramètres via LILO ou GRUB",
          "Modifier directement le binaire /boot/vmlinuz avec un éditeur de texte"
        ],
        a: 3,
        e: "Les 4 méthodes : modification dynamique, construction d'un noyau à partir de zéro, chargement de modules à la volée, passage de paramètres via le chargeur de démarrage."
      },
      {
        s: "Configuration",
        q: "Quelle méthode de configuration du noyau est la plus facile et la plus courante ?",
        o: [
          "La compilation à partir des sources",
          "La modification dynamique des paramètres",
          "Le passage de paramètres via GRUB",
          "Le chargement de modules"
        ],
        a: 1,
        e: "La modification dynamique est la plus facile et la plus courante ; la compilation à partir des sources est la plus difficile et la moins souvent nécessaire."
      },
      {
        s: "Configuration",
        q: "Pourquoi peut-on avoir besoin de recompiler le noyau ?",
        o: [
          "Pour changer le nom d'utilisateur",
          "Pour ajouter de nouveaux pilotes de périphériques intégrés aux structures du noyau",
          "Pour activer le ping",
          "Pour changer le mot de passe root"
        ],
        a: 1,
        e: "Le code source d'un pilote ajouté doit être intégré dans les structures de données du noyau, ce qui peut exiger une recompilation."
      },

      // ── /proc & sysctl ───────────────────────────────────
      {
        s: "/proc & sysctl",
        q: "Dans quel répertoire se trouvent les paramètres du noyau modifiables dynamiquement ?",
        o: ["/etc/sys", "/proc/sys", "/boot/sys", "/lib/modules"],
        a: 1,
        e: "Les paramètres sont accessibles et modifiables à partir des fichiers du répertoire /proc/sys."
      },
      {
        s: "/proc & sysctl",
        q: "Quelle commande fixe à 32768 le nombre maximal de fichiers ouverts simultanément ?",
        o: [
          "# echo 32768 > /proc/sys/fs/file-max",
          "# cat 32768 > /proc/sys/fs/file-max",
          "# echo 32768 > /etc/file-max",
          "# sysctl file-max 32768"
        ],
        a: 0,
        e: "On écrit la valeur dans le fichier /proc/sys/fs/file-max avec echo."
      },
      {
        s: "/proc & sysctl",
        q: "Pourquoi les modifications faites dans /proc sont-elles perdues au redémarrage ?",
        o: [
          "Parce que /proc est protégé en écriture",
          "Parce que /proc est un système de fichiers virtuel qui n'existe qu'en mémoire centrale",
          "Parce que GRUB efface /proc",
          "Parce que sysctl annule les modifications"
        ],
        a: 1,
        e: "/proc est virtuel et n'existe qu'en mémoire centrale : toute modification est temporaire."
      },
      {
        s: "/proc & sysctl",
        q: "Quel fichier permet de mémoriser les paramètres du noyau à appliquer à chaque démarrage ?",
        o: ["/etc/sysctl.conf", "/proc/sys/sysctl.conf", "/boot/config", "/etc/modprobe.conf"],
        a: 0,
        e: "On utilise /etc/sysctl.conf, par exemple avec la ligne net.ipv4.ip_forward = 0."
      },
      {
        s: "/proc & sysctl",
        q: "Que contrôle le paramètre /proc/sys/net/ipv4/ip_forward ?",
        o: [
          "Le blocage des réponses au ping",
          "Le routage (forwarding) entre les cartes réseau",
          "Le nom de la machine",
          "La gestion de Ctrl-Alt-Suppr"
        ],
        a: 1,
        e: "ip_forward active ou désactive le routage entre les cartes réseau ; c'est nécessaire pour que le système fonctionne comme un routeur."
      },
      {
        s: "/proc & sysctl",
        q: "Quel fichier permet de bloquer les réponses au ping ?",
        o: [
          "/proc/sys/net/ipv4/ip_forward",
          "/proc/sys/net/ipv4/icmp_echo_ignore_broadcasts",
          "/proc/sys/net/ipv4/icmp_echo_ignore_all",
          "/proc/sys/kernel/hostname"
        ],
        a: 2,
        e: "icmp_echo_ignore_all bloque les réponses au ping ; icmp_echo_ignore_broadcasts ignore seulement les messages ICMP de diffusion."
      },
      {
        s: "/proc & sysctl",
        q: "Si /proc/sys/kernel/ctrl-alt-del contient la valeur 0, que se passe-t-il quand on appuie sur Ctrl-Alt-Suppr ?",
        o: [
          "Rien, la séquence est ignorée",
          "Le système s'éteint immédiatement sans précaution",
          "La séquence est capturée et envoyée au programme init pour relancer le système correctement",
          "Le noyau est recompilé"
        ],
        a: 2,
        e: "Avec la valeur zéro, Ctrl-Alt-Suppr est capturé et envoyé à init pour relancer le système proprement."
      },
      {
        s: "/proc & sysctl",
        q: "Quel est l'effet de la commande : # sysctl -w net.ipv4.ip_forward=1 ?",
        o: [
          "Elle désactive le routage",
          "Elle active le routage pendant l'exécution du système",
          "Elle bloque le ping",
          "Elle écrit le paramètre de façon permanente dans /etc/sysctl.conf"
        ],
        a: 1,
        e: "sysctl -w modifie un paramètre en cours d'exécution ; ici ip_forward passe à 1, ce qui active le routage."
      },
      {
        s: "/proc & sysctl",
        q: "Quel fichier permet de changer le nom de la machine ?",
        o: ["/proc/sys/fs/file-max", "/proc/sys/kernel/hostname", "/etc/sysctl.conf", "/proc/modules"],
        a: 1,
        e: "/proc/sys/kernel/hostname permet de changer le nom de la machine."
      },

      // ── Compilation & installation ───────────────────────
      {
        s: "Compilation",
        q: "Sur quel site trouve-t-on le code source et les correctifs du noyau Linux ?",
        o: ["www.linux.org", "www.gnu.org", "www.kernel.org", "www.github.com/linux"],
        a: 2,
        e: "Le code source et les correctifs (patchs) sont disponibles sur www.kernel.org."
      },
      {
        s: "Compilation",
        q: "Quelle commande décompresse et extrait l'archive linux-2.6.35.5.tar.bz2 ?",
        o: ["tar xjfv linux-2.6.35.5.tar.bz2", "unzip linux-2.6.35.5.tar.bz2", "tar czf linux-2.6.35.5.tar.bz2", "gzip -d linux-2.6.35.5.tar.bz2"],
        a: 0,
        e: "tar xjfv : x = extraire, j = bzip2, f = fichier, v = verbeux."
      },
      {
        s: "Compilation",
        q: "Où sont stockées les informations de configuration du noyau ?",
        o: [
          "Dans /etc/kernel.conf",
          "Dans le fichier .config à la racine du répertoire source du noyau",
          "Dans /proc/sys/kernel",
          "Dans le Makefile"
        ],
        a: 1,
        e: "La configuration est dans le fichier .config, à la racine des sources. Il est déconseillé de le modifier à la main."
      },
      {
        s: "Compilation",
        q: "Avec make config, que signifie le choix « m » ?",
        o: [
          "Intégrer la fonction directement dans le noyau",
          "Construire un module chargé de façon dynamique",
          "Ne pas activer la fonction",
          "Afficher l'aide de la fonction"
        ],
        a: 1,
        e: "Y = intégré au noyau (choix par défaut), m = module dynamique, n = non activé, ? = description."
      },
      {
        s: "Compilation",
        q: "Avec make config, quel est le choix par défaut (sélectionné avec la touche Entrée) ?",
        o: ["n", "m", "Y", "?"],
        a: 2,
        e: "Y (« yes ») est le choix par défaut : la fonction est intégrée directement dans le noyau."
      },
      {
        s: "Compilation",
        q: "Quel est l'avantage de make oldconfig ?",
        o: [
          "Il propose une interface graphique",
          "Il construit une configuration à partir d'une configuration déjà existante",
          "Il compile le noyau plus vite",
          "Il installe automatiquement le noyau"
        ],
        a: 1,
        e: "Le noyau a près de 2000 options ; make oldconfig se base sur une configuration pré-construite (ex. /boot/config-2.6.32-24-generic) pour aller plus vite."
      },
      {
        s: "Compilation",
        q: "Quel outil permet de configurer le noyau en mode console en naviguant avec les flèches du clavier ?",
        o: ["make config", "make menuconfig", "make xconfig", "make gconfig"],
        a: 1,
        e: "make menuconfig fonctionne en console avec navigation au clavier ; make gconfig et make xconfig sont graphiques (souris)."
      },
      {
        s: "Compilation",
        q: "Quels outils utilisent une interface graphique pour configurer le noyau ?",
        o: ["make config et make oldconfig", "make menuconfig et make config", "make gconfig et make xconfig", "make install et make modules_install"],
        a: 2,
        e: "make gconfig et make xconfig utilisent des interfaces graphiques : on navigue avec la souris."
      },
      {
        s: "Compilation",
        q: "Quel est le résultat d'une compilation réussie avec la commande make ?",
        o: [
          "Un fichier .config",
          "Un fichier binaire : l'image du noyau, qu'il faut ensuite installer",
          "Un patch",
          "Une archive tar.bz2"
        ],
        a: 1,
        e: "make compile le noyau et les modules ; le résultat est l'image binaire du noyau, à installer avant de pouvoir démarrer dessus."
      },
      {
        s: "Installation",
        q: "Dans l'exemple du cours, où « make modules_install » place-t-il les modules ?",
        o: ["/boot/modules", "/lib/modules/2.6.35.5", "/proc/modules", "/etc/modules"],
        a: 1,
        e: "Les modules sont placés dans /lib/modules/<version>, ici /lib/modules/2.6.35.5."
      },
      {
        s: "Installation",
        q: "Comment s'appelle le script fourni par la plupart des distributions pour installer un nouveau noyau compilé ?",
        o: ["kernelsetup", "installkernel", "mkinstall", "grub-install"],
        a: 1,
        e: "installkernel copie le noyau au bon endroit et modifie le chargeur de démarrage."
      },
      {
        s: "Installation",
        q: "Laquelle de ces étapes NE FAIT PAS partie du processus déclenché par make install ?",
        o: [
          "Vérification de la bonne construction du noyau",
          "Installation de la partie statique du noyau dans /boot",
          "Téléchargement des patchs depuis kernel.org",
          "Ajout d'une entrée dans la configuration du chargeur de démarrage"
        ],
        a: 2,
        e: "make install : 1) vérification, 2) installation dans /boot, 3) création des images RAM Disk, 4) ajout d'une entrée dans le chargeur de démarrage."
      },
      {
        s: "Installation",
        q: "Lors d'une installation manuelle (architecture 386), quelle commande copie l'image du noyau ?",
        o: [
          "# cp arch/i386/boot/bzImage /boot/vmlinuz-2.6.35.5",
          "# cp .config /boot/vmlinuz-2.6.35.5",
          "# cp System.map /lib/modules/2.6.35.5",
          "# mv bzImage /proc/sys/kernel"
        ],
        a: 0,
        e: "On copie bzImage vers /boot/vmlinuz-<version>, puis System.map vers /boot/System.map-<version>."
      },
      {
        s: "Installation",
        q: "Si le démarrage ne fonctionne pas après une installation manuelle, quelle est la cause habituelle ?",
        o: [
          "Il manque le fichier .config",
          "Une image initrd est nécessaire",
          "Le ping est bloqué",
          "Le routage est désactivé"
        ],
        a: 1,
        e: "C'est généralement parce qu'une image initrd est nécessaire."
      },
      {
        s: "Installation",
        q: "Quelle commande construit généralement une image initrd ?",
        o: ["make initrd", "mkinitrd", "initrd-build", "modprobe initrd"],
        a: 1,
        e: "Exemple : mkinitrd -o /boot/initrd-2.6.35.5.img /lib/modules/2.6.35.5"
      },

      // ── Mise à jour ──────────────────────────────────────
      {
        s: "Mise à jour",
        q: "Avant de mettre à jour un noyau, que doit-on faire en premier dans le répertoire source ?",
        o: [
          "Supprimer le fichier .config",
          "Sauvegarder le fichier .config (ex. cp .config ../good_config)",
          "Lancer make install",
          "Redémarrer le système"
        ],
        a: 1,
        e: "On sauvegarde .config pour conserver toutes les options de la configuration précédente."
      },
      {
        s: "Mise à jour",
        q: "Pour passer du noyau 2.6.35.5 au 2.6.35.7, combien de patchs faut-il appliquer ?",
        o: ["Un seul", "Deux", "Trois", "Aucun, il faut tout retélécharger"],
        a: 1,
        e: "Deux patchs incrémentaux : 2.6.35.5 → 2.6.35.6, puis 2.6.35.6 → 2.6.35.7."
      },
      {
        s: "Mise à jour",
        q: "Quelle commande décompresse le patch patch-2.6.35.5-6.bz2 ?",
        o: ["tar xjfv patch-2.6.35.5-6.bz2", "bzip2 -dv patch-2.6.35.5-6.bz2", "gunzip patch-2.6.35.5-6.bz2", "patch -d patch-2.6.35.5-6.bz2"],
        a: 1,
        e: "Les patchs sont compressés en bzip2 : on les décompresse avec bzip2 -dv."
      },
      {
        s: "Mise à jour",
        q: "Depuis le répertoire linux-2.6.35.5, quelle commande applique le patch ?",
        o: [
          "$ patch -p1 < ../patch-2.6.35.5-6",
          "$ patch -p1 > ../patch-2.6.35.5-6",
          "$ make patch-2.6.35.5-6",
          "$ apply ../patch-2.6.35.5-6"
        ],
        a: 0,
        e: "patch -p1 < fichier_patch. On peut ensuite vérifier le changement de version avec head Makefile."
      },
      {
        s: "Mise à jour",
        q: "Parmi les 5 étapes de mise à niveau d'un noyau, lesquelles sont propres à la mise à jour (les autres étant identiques à une installation normale) ?",
        o: [
          "Compiler et installer",
          "Obtenir le nouveau code source et appliquer les modifications sur l'ancienne arborescence",
          "Reconfigurer et compiler",
          "Installer et redémarrer"
        ],
        a: 1,
        e: "Les 3 dernières étapes (reconfigurer, compiler, installer) sont identiques ; seules les 2 premières sont spécifiques."
      },

      // ── Modules ──────────────────────────────────────────
      {
        s: "Modules",
        q: "Où sont stockés les modules du noyau ?",
        o: ["/boot/modules", "/lib/modules/version_noyau", "/proc/sys/modules", "/etc/modules.d"],
        a: 1,
        e: "Dans /lib/modules/version_noyau, la version étant donnée par la commande uname -r."
      },
      {
        s: "Modules",
        q: "Quelle commande affiche la version du noyau en cours d'exécution ?",
        o: ["uname -r", "lsmod -v", "modinfo kernel", "cat /etc/version"],
        a: 0,
        e: "uname -r retourne la version du noyau Linux en cours."
      },
      {
        s: "Modules",
        q: "lsmod ne fait que remettre en forme le contenu de quel fichier ?",
        o: ["/proc/modules", "/lib/modules/modules.dep", "/etc/modprobe.conf", "/proc/sys/kernel/modules"],
        a: 0,
        e: "lsmod met en forme le contenu du fichier virtuel /proc/modules."
      },
      {
        s: "Modules",
        q: "Dans la sortie de lsmod : « fat  52636  1 vfat ». Que signifie cette ligne ?",
        o: [
          "Le module vfat est utilisé par fat",
          "Le module fat est utilisé par le module vfat",
          "fat et vfat sont en conflit",
          "Le module fat n'est pas chargé"
        ],
        a: 1,
        e: "La colonne « Used by » indique que fat est utilisé par vfat."
      },
      {
        s: "Modules",
        q: "Quelle commande met à jour l'arbre des dépendances entre les modules (fichier modules.dep) ?",
        o: ["lsmod", "depmod", "modinfo", "insmod"],
        a: 1,
        e: "depmod met à jour l'arbre des dépendances en modifiant le fichier modules.dep."
      },
      {
        s: "Modules",
        q: "Quelle commande affiche le nom du fichier, la description, l'auteur, la licence et les paramètres d'un module ?",
        o: ["lsmod", "modinfo", "depmod", "rmmod"],
        a: 1,
        e: "modinfo fournit toutes les informations sur un module : fichier, description, auteur, licence, dépendances, paramètres, alias matériels."
      },
      {
        s: "Modules",
        q: "Pourquoi « # insmod vfat.ko » échoue-t-il avec « Unknown symbol in module » ?",
        o: [
          "Parce que vfat.ko n'existe pas",
          "Parce que insmod ne gère pas les dépendances et que fat.ko n'est pas chargé",
          "Parce qu'il faut être en mode graphique",
          "Parce que le module est déjà chargé"
        ],
        a: 1,
        e: "insmod charge un module sans gérer les dépendances ; vfat dépend de fat, qu'il faut charger d'abord."
      },
      {
        s: "Modules",
        q: "« # rmmod fat » renvoie « ERROR: Module fat is in use by vfat ». Quel est le bon ordre ?",
        o: [
          "rmmod fat puis rmmod vfat",
          "rmmod vfat puis rmmod fat",
          "insmod fat puis rmmod vfat",
          "depmod puis rmmod fat"
        ],
        a: 1,
        e: "rmmod ne gère pas les dépendances : il faut d'abord décharger vfat, puis fat."
      },
      {
        s: "Modules",
        q: "Quelle commande charge un module AVEC toutes ses dépendances ?",
        o: ["insmod", "modprobe", "lsmod", "depmod"],
        a: 1,
        e: "modprobe charge le module, ses dépendances et les paramètres de /etc/modprobe.conf. Ex. modprobe vfat charge aussi fat."
      },
      {
        s: "Modules",
        q: "Quelle option de modprobe décharge un module et ceux dont il dépend (s'ils ne sont plus utilisés) ?",
        o: ["-d", "-r", "-u", "-x"],
        a: 1,
        e: "modprobe -r vfat décharge vfat et les modules dont il dépend s'ils ne sont plus utilisés."
      },
      {
        s: "Modules",
        q: "Quel fichier de configuration modprobe lit-il pour les paramètres des modules ?",
        o: ["/etc/sysctl.conf", "/etc/modprobe.conf", "/boot/grub/grub.conf", "/proc/modules"],
        a: 1,
        e: "modprobe utilise les paramètres contenus dans /etc/modprobe.conf."
      },

      // ── Démarrage ────────────────────────────────────────
      {
        s: "Démarrage",
        q: "Quel composant transmet les options au noyau lors du démarrage ?",
        o: ["Le programme init", "Le chargeur de démarrage (LILO ou GRUB)", "sysctl", "modprobe"],
        a: 1,
        e: "Le chargeur de démarrage (LILO ou GRUB) est responsable du transfert des options au noyau."
      },
      {
        s: "Démarrage",
        q: "Pour rendre des options de démarrage permanentes avec GRUB, quel fichier modifie-t-on ?",
        o: ["/etc/lilo.conf", "/boot/grub/grub.conf", "/etc/sysctl.conf", "/proc/cmdline"],
        a: 1,
        e: "GRUB : /boot/grub/grub.conf. LILO : /etc/lilo.conf."
      },
      {
        s: "Démarrage",
        q: "Dans « LILO: linux root=/dev/sda1 ether=0,0,eth0 ether=0,0,eth1 », que fait root=/dev/sda1 ?",
        o: [
          "Il donne les droits root à l'utilisateur",
          "Il indique la partition racine à utiliser",
          "Il formate /dev/sda1",
          "Il détecte la carte réseau eth0"
        ],
        a: 1,
        e: "root=/dev/sda1 indique la partition racine ; les options ether=0,0,ethX demandent de détecter deux cartes Ethernet."
      },
      {
        s: "Démarrage",
        q: "Quelle est la commande GRUB équivalente pour charger le noyau avec ces mêmes options ?",
        o: [
          "grub> kernel /vmlinuz root=/dev/sda1 ether=0,0,eth0 ether=0,0,eth1",
          "grub> load linux root=/dev/sda1",
          "grub> modprobe vmlinuz root=/dev/sda1",
          "grub> sysctl -w root=/dev/sda1"
        ],
        a: 0,
        e: "On utilise grub> kernel /vmlinuz ... puis grub> boot pour démarrer."
      }
    ],

    // ── Missions du mode Terminal ──────────────────────────
    // t = mission, a = commandes acceptées (regex), sol = solution affichée,
    // h = indice, out = sortie simulée, note = commentaire, root = prompt #, cwd = répertoire
    terminal: [
      {
        s: "Modules", root: false, cwd: "~",
        t: "Affiche la version du noyau Linux en cours d'exécution.",
        a: [/^uname -r$/],
        sol: "uname -r",
        h: "La commande uname avec l'option qui affiche la « release ».",
        out: "2.6.35.5"
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Liste les modules actuellement chargés dans le noyau, avec leurs dépendances.",
        a: [/^lsmod$/],
        sol: "lsmod",
        h: "ls + mod…",
        out: "Module                  Size  Used by\nfglrx                1482380  70\nnls_iso8859_1           8192  1\nnls_cp437               9856  1\nvfat                   16128  1\nfat                    52636  1 vfat",
        note: "fat est utilisé par vfat."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Affiche le contenu brut du fichier virtuel que lsmod se contente de mettre en forme.",
        a: [/^cat \/proc\/modules$/],
        sol: "cat /proc/modules",
        h: "Il se trouve dans /proc. Utilise cat.",
        out: "fglrx 1482380 60 - Live 0xf9a55000 (P)\nnls_iso8859_1 8192 0 - Live 0xf94d0000\nnls_cp437 9856 0 - Live 0xf94ed000"
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Affiche toutes les informations (fichier, licence, dépendances…) du module vfat.",
        a: [/^modinfo vfat$/],
        sol: "modinfo vfat",
        h: "mod + info.",
        out: "filename:   /lib/modules/2.6.22.17-0.1-default/kernel/fs/fat/fat.ko\nlicense:    GPL\nsrcversion: 886B1B65F96E53415B5811C\ndepends:\nsupported:  yes\nvermagic:   2.6.22.17-0.1-default SMP mod_unload 586"
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Mets à jour l'arbre des dépendances entre les modules (fichier modules.dep).",
        a: [/^depmod( -a)?$/],
        sol: "depmod",
        h: "dep + mod.",
        out: "",
        note: "modules.dep mis à jour."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Cherche la ligne de vfat dans le fichier modules.dep du noyau courant (utilise $(uname -r) dans le chemin).",
        a: [/^grep vfat \/lib\/modules\/(\$\(uname -r\)|`uname -r`|2\.6\.22\.17-0\.1-default)\/modules\.dep$/],
        sol: "grep vfat /lib/modules/$(uname -r)/modules.dep",
        h: "grep vfat /lib/modules/…/modules.dep",
        out: "/lib/modules/2.6.22.17-0.1-default/kernel/fs/vfat/vfat.ko:\n/lib/modules/2.6.22.17-0.1-default/kernel/fs/fat/fat.ko",
        note: "vfat.ko dépend de fat.ko."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Charge le module fat.ko avec la commande qui NE gère PAS les dépendances.",
        a: [/^insmod (\.\/)?fat\.ko$/],
        sol: "insmod fat.ko",
        h: "ins + mod, suivi du nom du fichier .ko",
        out: "",
        note: "fat chargé : vfat.ko peut maintenant être chargé sans erreur."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "fat est déjà chargé. Charge maintenant vfat.ko avec la même commande (sans gestion des dépendances).",
        a: [/^insmod (\.\/)?vfat\.ko$/],
        sol: "insmod vfat.ko",
        h: "insmod + le fichier du module vfat.",
        out: "",
        note: "Pas d'erreur : toutes les dépendances sont présentes."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "« rmmod fat » échoue : Module fat is in use by vfat. Décharge le BON module en premier avec rmmod.",
        a: [/^rmmod vfat(\.ko)?$/],
        sol: "rmmod vfat",
        h: "Il faut d'abord retirer celui qui utilise fat.",
        out: "",
        note: "vfat déchargé. Ensuite : rmmod fat."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Charge le module vfat AVEC toutes ses dépendances automatiquement.",
        a: [/^modprobe vfat$/],
        sol: "modprobe vfat",
        h: "La commande qui lit /etc/modprobe.conf.",
        out: "",
        note: "fat et vfat chargés automatiquement."
      },
      {
        s: "Modules", root: true, cwd: "~",
        t: "Décharge vfat ET les modules dont il dépend (s'ils ne sont plus utilisés), en une seule commande.",
        a: [/^modprobe -r vfat$/],
        sol: "modprobe -r vfat",
        h: "modprobe avec l'option -r",
        out: "",
        note: "vfat et fat déchargés."
      },
      {
        s: "/proc & sysctl", root: true, cwd: "~",
        t: "Avec la commande sysctl, active le routage (ip_forward = 1) pendant l'exécution.",
        a: [/^sysctl -w net\.ipv4\.ip_forward ?= ?1$/],
        sol: "sysctl -w net.ipv4.ip_forward=1",
        h: "sysctl -w net.ipv4.…=1",
        out: "net.ipv4.ip_forward = 1"
      },
      {
        s: "/proc & sysctl", root: true, cwd: "~",
        t: "Fixe à 32768 le nombre maximal de fichiers ouverts simultanément, en écrivant dans /proc.",
        a: [/^echo 32768 ?> ?\/proc\/sys\/fs\/file-max$/],
        sol: "echo 32768 > /proc/sys/fs/file-max",
        h: "echo … > /proc/sys/fs/…",
        out: "",
        note: "Modification temporaire : perdue au redémarrage."
      },
      {
        s: "/proc & sysctl", root: true, cwd: "~",
        t: "Bloque toutes les réponses au ping en écrivant 1 dans le bon fichier de /proc/sys.",
        a: [/^echo 1 ?> ?\/proc\/sys\/net\/ipv4\/icmp_echo_ignore_all$/, /^sysctl -w net\.ipv4\.icmp_echo_ignore_all ?= ?1$/],
        sol: "echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all",
        h: "Le fichier s'appelle icmp_echo_ignore_all, dans /proc/sys/net/ipv4/",
        out: "",
        note: "Ping bloqué."
      },
      {
        s: "/proc & sysctl", root: true, cwd: "~",
        t: "Change le nom de la machine en « serveur1 » en passant par /proc.",
        a: [/^echo "?serveur1"? ?> ?\/proc\/sys\/kernel\/hostname$/],
        sol: "echo serveur1 > /proc/sys/kernel/hostname",
        h: "echo serveur1 > /proc/sys/kernel/…",
        out: ""
      },
      {
        s: "Compilation", root: false, cwd: "~",
        t: "Décompresse et extrais l'archive linux-2.6.35.5.tar.bz2 (mode verbeux).",
        a: [/^tar -?(?=[xjvf]*x)(?=[xjvf]*j)(?=[xjvf]*f)[xjvf]{3,4} linux-2\.6\.35\.5\.tar\.bz2$/],
        sol: "tar xjfv linux-2.6.35.5.tar.bz2",
        h: "tar avec x (extraire), j (bzip2), f (fichier), v (verbeux).",
        out: "linux-2.6.35.5/\nlinux-2.6.35.5/Makefile\nlinux-2.6.35.5/README\nlinux-2.6.35.5/arch/\n…"
      },
      {
        s: "Compilation", root: false, cwd: "~/linux-2.6.35.5",
        t: "Ouvre l'outil de configuration du noyau en mode console, navigable avec les flèches du clavier.",
        a: [/^make menuconfig$/],
        sol: "make menuconfig",
        h: "make + menu…",
        out: "",
        note: "Interface de configuration en console ouverte."
      },
      {
        s: "Compilation", root: false, cwd: "~/linux-2.6.35.5",
        t: "Construis la configuration du nouveau noyau à partir de la configuration du noyau courant.",
        a: [/^make oldconfig$/],
        sol: "make oldconfig",
        h: "make + « ancienne » config.",
        out: "scripts/kconfig/conf -o arch/x86/Kconfig\n#\n# using defaults found in /boot/config-2.6.32-24-generic\n#"
      },
      {
        s: "Compilation", root: false, cwd: "~/linux-2.6.35.5",
        t: "La configuration est prête. Compile le noyau et ses modules.",
        a: [/^make$/],
        sol: "make",
        h: "Une seule commande, sans argument.",
        out: "  CC      init/main.o\n  CC      kernel/sched.o\n  LD      vmlinux\n  BUILD   arch/x86/boot/bzImage\nKernel: arch/x86/boot/bzImage is ready"
      },
      {
        s: "Installation", root: true, cwd: "~/linux-2.6.35.5",
        t: "Installe les modules compilés dans l'arborescence standard (/lib/modules/…).",
        a: [/^make modules_install$/],
        sol: "make modules_install",
        h: "make modules_…",
        out: "  INSTALL fs/fat/fat.ko\n  INSTALL fs/vfat/vfat.ko\n  DEPMOD  2.6.35.5",
        note: "Modules placés dans /lib/modules/2.6.35.5"
      },
      {
        s: "Installation", root: true, cwd: "~/linux-2.6.35.5",
        t: "Installe l'image du nouveau noyau (vérification, /boot, RAM Disk, chargeur de démarrage).",
        a: [/^make install$/],
        sol: "make install",
        h: "make + install.",
        out: "sh arch/x86/boot/install.sh 2.6.35.5 arch/x86/boot/bzImage System.map \"/boot\"",
        note: "Noyau installé : on peut redémarrer et tester."
      },
      {
        s: "Installation", root: true, cwd: "~/linux-2.6.35.5",
        t: "Installation manuelle (architecture 386) : copie l'image bzImage vers /boot/vmlinuz-2.6.35.5.",
        a: [/^cp arch\/i386\/boot\/bzImage \/boot\/vmlinuz-2\.6\.35\.5$/],
        sol: "cp arch/i386/boot/bzImage /boot/vmlinuz-2.6.35.5",
        h: "cp arch/i386/boot/… /boot/…",
        out: ""
      },
      {
        s: "Installation", root: true, cwd: "~",
        t: "Crée l'image initrd /boot/initrd-2.6.35.5.img à partir des modules de /lib/modules/2.6.35.5.",
        a: [/^mkinitrd -o \/boot\/initrd-2\.6\.35\.5\.img \/lib\/modules\/2\.6\.35\.5\/?$/],
        sol: "mkinitrd -o /boot/initrd-2.6.35.5.img /lib/modules/2.6.35.5",
        h: "mkinitrd -o <image> <répertoire des modules>",
        out: ""
      },
      {
        s: "Mise à jour", root: false, cwd: "~/linux-2.6.35.5",
        t: "Avant la mise à jour, sauvegarde le fichier .config dans le répertoire parent sous le nom good_config.",
        a: [/^cp \.config \.\.\/good_config$/],
        sol: "cp .config ../good_config",
        h: "cp .config ../…",
        out: ""
      },
      {
        s: "Mise à jour", root: false, cwd: "~",
        t: "Décompresse le patch patch-2.6.35.5-6.bz2 (mode verbeux).",
        a: [/^bzip2 -(d|dv|vd) patch-2\.6\.35\.5-6\.bz2$/, /^bunzip2 (-v )?patch-2\.6\.35\.5-6\.bz2$/],
        sol: "bzip2 -dv patch-2.6.35.5-6.bz2",
        h: "bzip2 avec -d (décompresser) et -v (verbeux).",
        out: "  patch-2.6.35.5-6.bz2: done"
      },
      {
        s: "Mise à jour", root: false, cwd: "~/linux-2.6.35.5",
        t: "Applique le patch ../patch-2.6.35.5-6 sur les sources du noyau.",
        a: [/^patch -p1 ?< ?\.\.\/patch-2\.6\.35\.5-6$/],
        sol: "patch -p1 < ../patch-2.6.35.5-6",
        h: "patch -p1 < …",
        out: "patching file Makefile\npatching file drivers/net/e1000/e1000_main.c\npatching file fs/ext4/inode.c"
      },
      {
        s: "Mise à jour", root: false, cwd: "~/linux-2.6.35.5",
        t: "Vérifie le changement de version en affichant les premières lignes du Makefile.",
        a: [/^head Makefile$/],
        sol: "head Makefile",
        h: "La commande qui affiche le début d'un fichier.",
        out: "VERSION = 2\nPATCHLEVEL = 6\nSUBLEVEL = 35\nEXTRAVERSION = .6"
      }
    ]
  }
];
