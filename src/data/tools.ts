import { 
  Shield, 
  Mail, 
  HardDrive, 
  Users, 
  Lock, 
  FileText,
  Cloud,
  Laptop,
  Database,
  LucideIcon
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  short_description: string;
  detailed_description?: string;
  target_audience?: string;
  documentation?: string;
  contact_info?: string;
  icon?: string;
  link: string;
  category: string;
  tags?: string[];
}

// Categories are now fetched from API - no longer exported from here

export const tools: any[] = [
  {
    id: "antivirus",
    name: "Antivirus Beskyttelse",
    description: "Beskytter din computer mod virus, malware og andre trusler med realtids scanning.",
    detailedDescription: "Vores antivirusløsning giver omfattende beskyttelse mod alle kendte former for malware, ransomware og phishing-angreb. Systemet opdateres automatisk med de nyeste virusdefinitioner og kører usynligt i baggrunden uden at påvirke din computers ydeevne.\n\nFordele:\n• Realtidsbeskyttelse mod alle kendte trusler\n• Automatiske opdateringer\n• Minimal påvirkning af systemets ydeevne\n• Centraliseret styring og overvågning",
    targetAudience: "Alle medarbejdere",
    documentation: "INSTALLATION OG OPSÆTNING\n\nAntivirusprogrammet er automatisk installeret på alle Region Nordjyllands computere. Du behøver ikke at gøre noget selv.\n\nDaglig brug:\n1. Programmet kører automatisk i baggrunden\n2. Du modtager kun beskeder ved fund af trusler\n3. Opdateringer sker automatisk uden brugerinteraktion\n\nHvis du modtager en advarsel:\n1. Tryk IKKE på nogen links eller knapper i mistænkelige emails\n2. Lad antivirusprogrammet fjerne truslen automatisk\n3. Kontakt IT-support hvis du er i tvivl\n\nPLANLAGTE SCANNINGER\nDer køres automatisk fuld scanning hver søndag kl. 02:00. Sørg for at computeren er tændt eller i dvaletilstand.\n\nYDERLIGERE SIKKERHED\n• Åbn aldrig vedhæftede filer fra ukendte afsendere\n• Download kun software fra godkendte kilder\n• Hold altid dit operativsystem opdateret",
    contact: "IT-Sikkerhed: it-sikkerhed@rn.dk eller telefon 9932 1111",
    icon: Shield,
    link: "#",
    category: "Sikkerhed",
    tags: ["virus", "malware", "sikkerhed", "beskyttelse", "scanning"]
  },
  {
    id: "email",
    name: "Email Platform",
    description: "Region Nordjyllands officielle email-system med kalenderfunktion og kontakter.",
    detailedDescription: "Vores email-platform giver dig adgang til professionel email-kommunikation med integreret kalender, kontaktstyring og opgaveadministration. Systemet er tilgængeligt fra alle enheder og sikrer, at dine data altid er synkroniseret.\n\nFordele:\n• Adgang fra computer, tablet og smartphone\n• Stor mailboks kapacitet (50 GB)\n• Integreret kalender med mødeindkaldelser\n• Deling af kalendere med kolleger\n• Sikker kommunikation med kryptering",
    targetAudience: "Alle medarbejdere",
    documentation: "ADGANG TIL EMAIL\n\nWeb adgang:\n1. Gå til webmail.rn.dk\n2. Log ind med dit brugernavn og adgangskode\n3. Du har nu adgang til email, kalender og kontakter\n\nMobil adgang:\n1. Download Outlook app fra App Store eller Google Play\n2. Tilføj din @rn.dk email\n3. Log ind med dine credentials\n\nOPRETTELSE AF SIGNATURER\n1. Klik på indstillinger (tandhjul)\n2. Vælg 'Email signatur'\n3. Brug den officielle skabelon fra intranettet\n4. Gem ændringer\n\nKALENDER FUNKTIONER\nOpret møde:\n1. Klik på 'Ny begivenhed'\n2. Tilføj deltagere via 'Inviter deltagere'\n3. Vælg tid og varighed\n4. Tilføj eventuelt mødelokale\n5. Send invitation\n\nDel kalender:\n1. Højreklik på din kalender\n2. Vælg 'Delingsrettigheder'\n3. Tilføj kolleger og vælg rettighedsniveau\n4. Gem ændringer\n\nEMAIL REGLER\n• Maksimal vedhæftet fil størrelse: 25 MB\n• Brug altid professionel tone\n• Inkluder emailsignatur på alle eksterne emails\n• Svar inden for 24 timer på hverdage",
    contact: "Email Support: email-support@rn.dk eller telefon 9932 1122",
    icon: Mail,
    link: "https://outlook.office.com",
    category: "Kommunikation",
    tags: ["email", "mail", "kalender", "outlook", "kontakter"]
  },
  {
    id: "backup",
    name: "Backup System",
    description: "Automatisk backup af vigtige filer til sikker opbevaring med mulighed for gendannelse.",
    detailedDescription: "Backup-systemet sikrer, at alle dine vigtige arbejdsfiler automatisk bliver sikkerhedskopieret hver dag. Du kan nemt gendanne filer, hvis de ved et uheld bliver slettet eller beskadiget. Systemet kører i baggrunden og kræver ingen manuel handling.\n\nFordele:\n• Automatisk daglig backup\n• Nem gendannelse af filer\n• Versionering - gå tilbage til tidligere versioner\n• Beskyttelse mod ransomware\n• Ubegrænset lagerplads til arbejdsfiler",
    targetAudience: "Alle medarbejdere med computer",
    documentation: "SÅDAN VIRKER BACKUP\n\nAutomatisk backup:\n• Alle filer i 'Dokumenter', 'Skrivebord' og 'Billeder' bliver automatisk sikkerhedskopieret\n• Backup kører hver dag kl. 20:00\n• Du behøver ikke gøre noget - det sker automatisk\n\nGENDANNELSE AF FILER\n\nMetode 1 - Enkle filer:\n1. Åbn 'Denne Computer'\n2. Naviger til den mappe hvor filen var\n3. Højreklik i mappen og vælg 'Gendan tidligere versioner'\n4. Vælg datoen hvor filen eksisterede\n5. Vælg filen og klik 'Gendan'\n\nMetode 2 - Via backup portal:\n1. Gå til backup.rn.dk\n2. Log ind med dit brugernavn\n3. Find filen i mappestrukturen\n4. Klik på 'Gendan'\n5. Vælg destination for gendannelsen\n\nVERSIONERING\nSystemet gemmer versioner af filer i op til 30 dage:\n1. Højreklik på filen\n2. Vælg 'Egenskaber'\n3. Gå til fanen 'Tidligere versioner'\n4. Vælg den ønskede version\n5. Klik 'Gendan' eller 'Åbn' for at se indholdet\n\nVIGTIGT AT VIDE\n• Gem ALTID arbejdsfiler på netværksdrevet eller i 'Dokumenter'\n• Filer på skrivebordet bliver også sikkerhedskopieret\n• Eksterne harddiske bliver IKKE sikkerhedskopieret\n• Ved spørgsmål kontakt IT-support",
    contact: "Backup Support: backup-support@rn.dk eller telefon 9932 1133",
    icon: HardDrive,
    link: "#",
    category: "Sikkerhed",
    tags: ["backup", "sikkerhedskopi", "gendannelse", "filer", "data"]
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Samarbejdsplatform til videomøder, chat og fildeling med kolleger.",
    detailedDescription: "Microsoft Teams er vores primære platform til intern kommunikation og samarbejde. Her kan du holde videomøder, chatte med kolleger, dele filer og arbejde sammen i realtid på dokumenter. Teams erstatter behovet for fysiske møder i mange situationer og gør samarbejde nemmere.\n\nFordele:\n• Video- og lydmøder med op til 300 deltagere\n• Øjeblikkelig messaging med kolleger\n• Fildeling og fælles dokumentredigering\n• Integration med andre Microsoft værktøjer\n• Skærmoptagelse og deling",
    targetAudience: "Alle medarbejdere",
    documentation: "KOM GODT I GANG MED TEAMS\n\nFørste gang:\n1. Teams er allerede installeret på din computer\n2. Åbn Teams fra skrivebordet eller Start-menuen\n3. Log ind med din @rn.dk email\n4. Gennemgå den korte introduktionsguide\n\nSTART ET VIDEOMØDE\n1. Klik på 'Kalender' i venstre side\n2. Klik 'Nyt møde'\n3. Tilføj titel og deltagere\n4. Vælg dato og tidspunkt\n5. Klik 'Send' for at oprette mødet\n\nHurtig mødestart:\n1. Klik på 'Mød nu' øverst til højre\n2. Vælg mødeindstillinger\n3. Kopier mødelinket og send til deltagere\n\nCHAT FUNKTIONER\nStart en chat:\n1. Klik på 'Chat' i venstre side\n2. Klik på 'Ny chat'\n3. Skriv navnet på personen du vil chatte med\n4. Skriv din besked\n\nOpret gruppe-chat:\n1. Start en ny chat\n2. Tilføj flere personer\n3. Giv gruppen et navn\n4. Start samtalen\n\nFILDELING\nDel filer i chat:\n1. Klik på papirklips-ikonet\n2. Vælg fil fra computer eller OneDrive\n3. Filen uploades og deles automatisk\n\nSamarbejd på dokumenter:\n1. Upload et Word/Excel dokument til Teams\n2. Klik på dokumentet\n3. Flere kan nu redigere samtidigt\n4. Ændringer gemmes automatisk\n\nGODE RÅD\n• Sluk mikrofon når du ikke taler i store møder\n• Brug video når det er muligt - det skaber bedre kontakt\n• Brug 'Håndsoprækning' i store møder\n• Sæt status til 'Optaget' når du ikke vil forstyrres",
    contact: "Teams Support: teams-support@rn.dk eller telefon 9932 1144",
    icon: Users,
    link: "https://teams.microsoft.com",
    category: "Kommunikation",
    tags: ["teams", "møder", "video", "chat", "samarbejde"]
  },
  {
    id: "vpn",
    name: "VPN Adgang",
    description: "Sikker forbindelse til Region Nordjyllands netværk når du arbejder hjemmefra.",
    detailedDescription: "VPN (Virtual Private Network) giver dig sikker adgang til alle Region Nordjyllands systemer, når du arbejder hjemmefra eller fra andre eksterne lokationer. Forbindelsen er krypteret og beskytter dine data mod uautoriseret adgang.\n\nFordele:\n• Sikker adgang til interne systemer\n• Krypteret dataforbindelse\n• Adgang til netværksdrev hjemmefra\n• Beskyttelse på offentlige WiFi netværk\n• Fungerer på alle enheder",
    targetAudience: "Medarbejdere med behov for ekstern adgang",
    documentation: "INSTALLATION AF VPN\n\nWindows:\n1. Gå til software.rn.dk\n2. Find 'Region Nordjylland VPN'\n3. Klik 'Download og installer'\n4. Følg installations-guiden\n5. Genstart computeren\n\nMac:\n1. Åbn App Store\n2. Søg efter 'Region Nordjylland VPN'\n3. Klik 'Hent'\n4. Følg installations-instruktionerne\n5. Genstart computeren\n\nFØRSTE GANGS OPSÆTNING\n1. Åbn VPN programmet\n2. Indtast VPN adresse: vpn.rn.dk\n3. Brug dit normale brugernavn og kodeord\n4. Klik 'Opret forbindelse'\n5. Ved første login modtager du en SMS med bekræftelseskode\n6. Indtast koden og gem enheden som betroet\n\nDAGLIG BRUG\nOpret forbindelse:\n1. Åbn VPN programmet fra systembakken\n2. Klik på 'Forbind'\n3. Indtast kodeord hvis du bliver spurgt\n4. Vent på grøn status - du er nu forbundet\n\nAfbryd forbindelse:\n1. Åbn VPN programmet\n2. Klik på 'Afbryd'\n3. Forbindelsen lukkes\n\nFEJLFINDING\nKan ikke forbinde:\n1. Kontroller din internet forbindelse\n2. Prøv at genstarte VPN programmet\n3. Genstart computeren\n4. Kontakt IT-support hvis problemet fortsætter\n\nLangsom forbindelse:\n1. Luk unødvendige programmer\n2. Prøv at afbryde og genoprette forbindelsen\n3. Test din internet hastighed på speedtest.net\n\nSIKKERHED\n• Brug ALDRIG VPN på offentlige computere\n• Log altid af når du er færdig\n• Del ALDRIG dine VPN login oplysninger\n• Kontakt IT-support ved mistænkelig aktivitet",
    contact: "VPN Support: vpn-support@rn.dk eller telefon 9932 1155",
    icon: Lock,
    link: "#",
    category: "Sikkerhed",
    tags: ["vpn", "hjemmearbejde", "ekstern adgang", "sikkerhed", "netværk"]
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Fælles dokumentbibliotek hvor teams kan dele og samarbejde om filer.",
    detailedDescription: "SharePoint er vores centrale platform til dokumenthåndtering og samarbejde. Her kan teams oprette fælles dokumentbiblioteker, dele viden og arbejde sammen på filer i realtid. Systemet sikrer versionsstyring og giver mulighed for at finde dokumenter hurtigt.\n\nFordele:\n• Centraliseret dokumentopbevaring\n• Samtidig redigering af dokumenter\n• Automatisk versionsstyring\n• Avanceret søgefunktion\n• Integration med Microsoft Office\n• Adgangsstyring på dokumentniveau",
    targetAudience: "Teams og afdelinger der deler dokumenter",
    documentation: "ADGANG TIL SHAREPOINT\n\n1. Gå til sharepoint.rn.dk\n2. Log ind med dit brugernavn\n3. Du ser nu dine team-sites\n\nNAVIGERING\nDine sites:\n• Klik på 'Mine sites' for at se alle sites du har adgang til\n• Klik på et site navn for at åbne det\n• Brug søgefeltet til at finde specifikke sites\n\nARBEJDE MED DOKUMENTER\n\nUpload dokument:\n1. Naviger til det ønskede dokumentbibliotek\n2. Klik 'Upload' eller træk filer til browservinduet\n3. Vælg filer fra din computer\n4. Dokumenterne uploades automatisk\n\nOpret nyt dokument:\n1. Klik på 'Ny'\n2. Vælg dokumenttype (Word, Excel, PowerPoint)\n3. Dokumentet åbnes i browser\n4. Start redigeringen - gemmes automatisk\n\nRedigér eksisterende dokument:\n1. Klik på dokumentets navn\n2. Vælg 'Åbn i app' for desktop version\n3. Eller redigér direkte i browseren\n4. Ændringer gemmes løbende\n\nVERSIONSSYTRING\n\nSe tidligere versioner:\n1. Højreklik på dokumentet\n2. Vælg 'Versionshistorik'\n3. Se liste over alle versioner\n4. Klik på en version for at åbne den\n\nGendan tidligere version:\n1. Åbn versionshistorikken\n2. Find den version du vil gendanne\n3. Klik på pilen ved versionen\n4. Vælg 'Gendan'\n\nDELING OG TILLADELSER\n\nDel et dokument:\n1. Vælg dokumentet\n2. Klik 'Del' i værktøjslinjen\n3. Indtast email på personer der skal have adgang\n4. Vælg om de må redigere eller kun læse\n5. Tilføj eventuelt en besked\n6. Klik 'Send'\n\nOprette mappe:\n1. Gå til dokumentbiblioteket\n2. Klik 'Ny' → 'Mappe'\n3. Navngiv mappen\n4. Klik 'Opret'\n\nBEDSTE PRAKSIS\n• Brug beskrivende filnavne\n• Organiser filer i logiske mapper\n• Tag dokumenter for lettere søgning\n• Slet ikke andres filer uden aftale\n• Brug altid check-in/check-out ved større ændringer",
    contact: "SharePoint Support: sharepoint-support@rn.dk eller telefon 9932 1166",
    icon: FileText,
    link: "https://sharepoint.rn.dk",
    category: "Samarbejde",
    tags: ["sharepoint", "dokumenter", "deling", "samarbejde", "filer"]
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Personlig cloud storage til dine arbejdsfiler med automatisk synkronisering.",
    detailedDescription: "OneDrive er din personlige cloud-lagerplads hvor du kan gemme, synkronisere og dele filer sikkert. Alle filer i OneDrive bliver automatisk synkroniseret mellem dine enheder og er tilgængelige både online og offline. Du får 1 TB lagerplads.\n\nFordele:\n• 1 TB personlig lagerplads\n• Automatisk synkronisering mellem enheder\n• Adgang til filer fra hvor som helst\n• Beskyttelse mod tab af data\n• Del filer sikkert med eksterne parter\n• Offline adgang til vigtige filer",
    targetAudience: "Alle medarbejdere",
    documentation: "OPSÆTNING AF ONEDRIVE\n\nFørste gang:\n1. OneDrive er allerede installeret på din arbejdscomputer\n2. Klik på OneDrive ikonet i systembakken (cloud ikon)\n3. Log ind med din @rn.dk email\n4. Vælg hvilke mapper der skal synkroniseres\n5. Klik 'Start synkronisering'\n\nYderligere enheder:\n1. Download OneDrive app fra App Store/Google Play\n2. Log ind med arbejds-email\n3. Aktiver automatisk upload af billeder (valgfrit)\n\nGEMNING AF FILER\n\nGem direkte til OneDrive:\n1. Åbn et dokument i Word, Excel, etc.\n2. Klik 'Gem som'\n3. Vælg 'OneDrive - Region Nordjylland'\n4. Vælg mappe og filnavn\n5. Klik 'Gem'\n\nFlyt eksisterende filer:\n1. Åbn Stifinder/Finder\n2. Find OneDrive mappen\n3. Træk filer ind i OneDrive mappen\n4. Filerne synkroniseres automatisk\n\nDELING AF FILER\n\nDel med kolleger:\n1. Højreklik på filen i OneDrive\n2. Vælg 'Del'\n3. Indtast kollegers email\n4. Vælg rettigheder (kan redigere/kan se)\n5. Klik 'Send'\n\nDel med eksterne:\n1. Højreklik på filen\n2. Vælg 'Del'\n3. Klik 'Kopiér link'\n4. Vælg link-indstillinger (adgangskode, udløbsdato)\n5. Send linket via email\n\nOFFLINE ADGANG\n\nGør filer tilgængelige offline:\n1. Højreklik på fil eller mappe\n2. Vælg 'Altid tilgængelig på denne enhed'\n3. Filen downloades og er nu tilgængelig offline\n4. Ændringer synkroniseres når du kommer online igen\n\nFRIGØR PLADS\n1. Højreklik på fil eller mappe\n2. Vælg 'Frigør plads'\n3. Filen fjernes fra computeren men forbliver i skyen\n4. Du kan stadig se og åbne filen - den downloades ved behov\n\nVERSIONSHISTORIK\n\nGendan tidligere version:\n1. Gå til onedrive.rn.dk i browseren\n2. Højreklik på filen\n3. Vælg 'Versionshistorik'\n4. Vælg den version du vil gendanne\n5. Klik 'Gendan'\n\nLAGERPLADS\n\nTjek dit forbrug:\n1. Klik på OneDrive ikonet\n2. Klik på indstillinger (tandhjul)\n3. Se 'Lagerplads' - du har 1 TB total\n\nFRIGØR PLADS\n• Slet unødvendige filer\n• Flyt store filer til SharePoint hvis de skal deles\n• Brug 'Frigør plads' funktionen på gamle filer",
    contact: "OneDrive Support: onedrive-support@rn.dk eller telefon 9932 1177",
    icon: Cloud,
    link: "https://onedrive.live.com",
    category: "Samarbejde",
    tags: ["onedrive", "cloud", "synkronisering", "lagerplads", "filer"]
  },
  {
    id: "software",
    name: "Software Center",
    description: "Selvbetjeningsportal hvor du kan installere godkendt software selv.",
    detailedDescription: "Software Center gør det nemt for dig selv at installere godkendt software på din arbejdscomputer uden at skulle kontakte IT-support. Alle programmer er testet og godkendt til brug i Region Nordjylland. Du kan også se hvilke opdateringer der er tilgængelige.\n\nFordele:\n• Selvbetjening - installer software selv\n• Kun godkendt og testet software\n• Automatiske opdateringer\n• Ingen ventetid på IT-support\n• Oversigt over installeret software\n• Fjernelse af software du ikke længere bruger",
    targetAudience: "Alle medarbejdere",
    documentation: "ADGANG TIL SOFTWARE CENTER\n\n1. Klik på Start-menuen\n2. Søg efter 'Software Center'\n3. Åbn programmet\n\nAlternativt:\n1. Klik på software-ikonet i systembakken\n2. Programmet åbnes\n\nINSTALLATION AF SOFTWARE\n\n1. Åbn Software Center\n2. Klik på 'Programmer' i venstre side\n3. Gennemse tilgængelige programmer\n4. Klik på det program du ønsker\n5. Læs beskrivelsen\n6. Klik 'Installer'\n7. Vent på installationen færdiggøres\n8. Du får besked når det er klar\n\nTilgængelige kategorier:\n• Kontorsoftware (Office, Adobe Reader)\n• Kommunikation (Teams, Zoom)\n• Udviklingsværktøjer (Visual Studio Code)\n• Grafik (GIMP, Paint.NET)\n• Diverse værktøjer\n\nOPDATERINGER\n\nTjek for opdateringer:\n1. Åbn Software Center\n2. Klik på 'Opdateringer'\n3. Se liste over tilgængelige opdateringer\n4. Vælg de opdateringer du vil installere\n5. Klik 'Installer alle' eller installer individuelt\n\nAutomatiske opdateringer:\n• Kritiske sikkerhedsopdateringer installeres automatisk\n• Du får besked hvis genstart er påkrævet\n• Planlæg genstarter uden for arbejdstid når muligt\n\nAFINSTALLATION\n\n1. Åbn Software Center\n2. Klik på 'Installeret'\n3. Find programmet du vil fjerne\n4. Klik på programmet\n5. Klik 'Afinstaller'\n6. Bekræft afinstallation\n7. Vent på processen færdiggøres\n\nINSTALLATIONSHISTORIK\n\n1. Klik på 'Installationsstatus'\n2. Se historik for alle installationer\n3. Tjek status for igangværende installationer\n4. Se eventuelle fejlbeskeder\n\nFEJLFINDING\n\nInstallation fejler:\n1. Tjek at du har internetforbindelse\n2. Luk alle åbne programmer\n3. Prøv at genstarte computeren\n4. Forsøg installation igen\n5. Kontakt IT-support hvis problemet fortsætter\n\nProgram mangler:\n• Ikke al software er tilgængelig i Software Center\n• Specialiseret software kræver godkendelse\n• Kontakt din leder for at anmode om nyt software\n\nVIGTIGT\n• Installer KUN software fra Software Center\n• Download IKKE software fra internettet\n• Hvis du mangler et program, kontakt IT-support\n• Alle installationer logges af sikkerhedsmæssige årsager",
    contact: "Software Support: software-support@rn.dk eller telefon 9932 1188",
    icon: Laptop,
    link: "#",
    category: "Værktøjer",
    tags: ["software", "programmer", "installation", "opdateringer", "apps"]
  },
  {
    id: "database",
    name: "Database Adgang",
    description: "Sikker adgang til Region Nordjyllands databaser til dataanalyse og rapportering.",
    detailedDescription: "Database Adgang giver autoriserede medarbejdere sikker adgang til Region Nordjyllands forskellige databaser til dataanalyse, rapportering og udtræk. Systemet sikrer, at kun autoriserede personer kan tilgå følsomme data og logger al aktivitet.\n\nFordele:\n• Sikker adgang til autoriserede databaser\n• Avancerede søge- og filtreringsmuligheder\n• Eksport til Excel og andre formater\n• Standardrapporter og mulighed for egne udtræk\n• Fuld audit trail af dataadgang\n• Overholdelse af GDPR og datasikkerhed",
    targetAudience: "Autoriserede medarbejdere med databehov",
    documentation: "ANMODNING OM DATABASE ADGANG\n\nAdgang til databaser kræver godkendelse:\n1. Udfyld anmodningsformular på intranettet\n2. Angiv hvilke databaser du har brug for adgang til\n3. Begrund dit behov (GDPR krav)\n4. Få godkendelse fra din leder\n5. Send til IT-sikkerhed for behandling\n6. Du modtager svar inden for 3 arbejdsdage\n\nFØRSTE GANGS LOGIN\n\n1. Åbn database-portalen: db.rn.dk\n2. Log ind med dit brugernavn\n3. Gennemfør obligatorisk sikkerhedsinstruktion\n4. Accepter vilkår for dataanvendelse\n5. Du har nu adgang til godkendte databaser\n\nDATAUDTRÆK\n\nStandardrapporter:\n1. Vælg 'Rapporter' i menuen\n2. Find den ønskede rapport i listen\n3. Vælg tidsperiode og filtre\n4. Klik 'Generér rapport'\n5. Download som Excel eller PDF\n\nBrugerdefineret udtræk:\n1. Vælg 'Nyt udtræk' i menuen\n2. Vælg database og tabeller\n3. Marker de felter du ønsker\n4. Tilføj filtre efter behov\n5. Preview resultat\n6. Eksportér data\n\nDATA SIKKERHED\n\nVIGTIGT - Følg altid disse regler:\n• Del ALDRIG data med uautoriserede personer\n• Gem data kun på godkendte lokationer (OneDrive/SharePoint)\n• Kryptér filer med personhenførbare data\n• Slet data når det ikke længere er nødvendigt\n• Rapportér mistænkelig aktivitet til IT-sikkerhed\n\nGDPR COMPLIANCE\n\nAl dataanvendelse skal overholde GDPR:\n• Log kun data du har behov for\n• Begræns dataadgang til nødvendige felter\n• Dokumentér formålet med dataudtræk\n• Slet data efter brug\n• Underret DPO ved sikkerhedsbrud\n\nEKSPORT BEGRÆNSNINGER\n\nMaksimum antal rækker per udtræk: 10.000\nFor større udtræk:\n1. Kontakt database-administratoren\n2. Begrund behovet for stort udtræk\n3. Udtræk genereres og stilles til rådighed sikkert\n\nREVISIONS LOG\n\nAl adgang til databaser logges:\n• Hvem har tilgået data\n• Hvornår data blev tilgået\n• Hvilke data der blev set/eksporteret\n• IP-adresse og computer\n\nFEJLFINDING\n\nKan ikke logge ind:\n1. Kontroller at du har aktiv database-adgang\n2. Prøv at nulstille dit kodeord\n3. Kontakt IT-support hvis problemet fortsætter\n\nManglende data:\n• Data kan være klassificeret højere end din adgang\n• Kontakt database-administratoren for information\n\nLangsom respons:\n• Undgå store udtræk i dagtimerne\n• Brug filtre til at begrænse resultater\n• Kontakt support ved vedvarende problemer",
    contact: "Database Support: database-support@rn.dk eller telefon 9932 1199",
    icon: Database,
    link: "#",
    category: "Værktøjer",
    tags: ["database", "data", "rapporter", "udtræk", "analyse"]
  }
];
